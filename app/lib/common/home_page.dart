//home_page.dart
import 'dart:io';
import 'dart:convert';
import 'dart:typed_data';

import 'package:career_nest/common/animated_appbar.dart';
import 'package:career_nest/common/theme.dart';
import 'package:flutter/material.dart';
import 'package:career_nest/common/video_service.dart';
// import 'package:url_launcher/url_launcher.dart'; // no longer needed here
import 'package:career_nest/common/display_video.dart';
import 'package:path_provider/path_provider.dart';
import 'package:video_thumbnail/video_thumbnail.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

/// Simple in-memory + file-path cache for generated thumbnails.
class _ThumbnailCache {
  // memory cache: videoUrl -> local file path
  static final Map<String, String?> _memory = {};

  static String _safeName(String videoUrl) {
    // deterministic file name based on URL
    final safe = base64Url.encode(utf8.encode(videoUrl)).replaceAll('=', '');
    return 'thumb_$safe.webp';
  }

  static Future<String> _diskPathFor(String videoUrl) async {
    final dir = await getTemporaryDirectory();
    return '${dir.path}/${_safeName(videoUrl)}';
  }

  static Future<String?> get(String videoUrl) async {
    // 1) memory hit
    if (_memory.containsKey(videoUrl)) return _memory[videoUrl];

    // 2) disk hit
    final p = await _diskPathFor(videoUrl);
    final f = File(p);
    if (await f.exists()) {
      _memory[videoUrl] = p;
      return p;
    }

    return null;
  }

  static Future<void> set(String videoUrl, String? path) async {
    _memory[videoUrl] = path;
  }
}

class HomePage extends StatefulWidget {
  final String userName;
  const HomePage({super.key, required this.userName});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage>
    with SingleTickerProviderStateMixin {
  List<Map<String, dynamic>> _eventVideos = [];
  List<Map<String, dynamic>> _placementVideos = [];
  bool _isLoading = true;
  late TabController _tabController;

  Future<void> _fetchVideos({bool isManualRefresh = false}) async {
    if (mounted) {
      setState(() {
        _isLoading = true;
      });
    }
    try {
      final allVideos = await VideoService.getAllVideos();
      final eventVideos =
          allVideos.where((video) => video['category'] == 'Event').toList();
      final placementVideos =
          allVideos.where((video) => video['category'] == 'Placement').toList();
      if (mounted) {
        setState(() {
          _eventVideos = List<Map<String, dynamic>>.from(eventVideos);
          _placementVideos = List<Map<String, dynamic>>.from(placementVideos);
          _isLoading = false;
        });
      }
    } catch (error) {
      print('Error fetching videos: $error');
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to fetch videos. Please try again later.'),
          backgroundColor: AppColors.error,
        ),
      );
    }
  }

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _fetchVideos();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.only(top: 120),
            child: _isLoading
                ? ListView(
                    children: const [
                      SizedBox(height: 200),
                      Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            CircularProgressIndicator(
                              color: AppColors.primary,
                            ),
                            SizedBox(height: 16),
                            Text(
                              'Loading videos...',
                              style: TextStyle(
                                fontSize: 16,
                                color: Colors.grey,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  )
                : TabBarView(
                    controller: _tabController,
                    children: [
                      YouTubeVideoGrid(
                        videos: _eventVideos,
                        type: 'Events',
                        onRefresh: _fetchVideos,
                      ),
                      YouTubeVideoGrid(
                        videos: _placementVideos,
                        type: 'Placements',
                        onRefresh: _fetchVideos,
                      ),
                    ],
                  ),
          ),
          SizedBox(
            height: 140,
            child: AnimatedCurvedAppBar(
              title: "Career Nest",
              tabController: _tabController,
            ),
          ),
        ],
      ),
    );
  }
}

class YouTubeVideoGrid extends StatefulWidget {
  final List<Map<String, dynamic>> videos;
  final String type;
  final Future<void> Function()? onRefresh;

  const YouTubeVideoGrid({
    super.key,
    required this.videos,
    required this.type,
    this.onRefresh,
  });

  @override
  State<YouTubeVideoGrid> createState() => _YouTubeVideoGridState();
}

class _YouTubeVideoGridState extends State<YouTubeVideoGrid>
    with AutomaticKeepAliveClientMixin {
  final Map<String, String?> _thumbnails = {};

  String _buildFullUrl(String? rawUrl) {
    final base =
        (dotenv.maybeGet('API_URL') ?? dotenv.env['API_URL'] ?? '').trim();
    if (rawUrl == null || rawUrl.isEmpty) return '';
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
      return rawUrl;
    }
    if (base.isEmpty) return rawUrl; // fallback if env not set
    final normalizedBase =
        base.endsWith('/') ? base.substring(0, base.length - 1) : base;
    return '$normalizedBase/videos/$rawUrl';
  }

  @override
  void initState() {
    super.initState();
    _seedFromCacheAndGenerate();
  }

  @override
  void didUpdateWidget(covariant YouTubeVideoGrid oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.videos != oldWidget.videos) {
      _seedFromCacheAndGenerate();
    }
  }

  Future<void> _seedFromCacheAndGenerate() async {
    // 1) Seed thumbnails from cache and disk without generating
    final urls = <String>[];
    for (final video in widget.videos) {
      final raw = video['url'] as String?;
      final fullUrl = _buildFullUrl(raw);
      if (fullUrl.isEmpty) continue;
      urls.add(fullUrl);
    }

    // Try to resolve from cache/disk first
    final seeded = <String, String?>{};
    for (final url in urls) {
      seeded[url] = await _ThumbnailCache.get(url);
    }

    if (mounted) {
      setState(() {
        _thumbnails.addAll(seeded);
      });
    }

    // 2) Generate only the missing ones, then update once
    final generationFutures = <Future<void>>[];
    for (final url in urls) {
      if (_thumbnails[url] != null) continue;
      generationFutures.add(() async {
        final p = await _getThumbnail(url);
        await _ThumbnailCache.set(url, p);
        _thumbnails[url] = p;
      }());
    }

    if (generationFutures.isNotEmpty) {
      await Future.wait(generationFutures);
      if (mounted) setState(() {});
    }
  }

  Future<String?> _getThumbnail(String videoUrl) async {
    try {
      // 0) If already on disk, reuse
      final dir = await getTemporaryDirectory();
      final safe = base64Url.encode(utf8.encode(videoUrl)).replaceAll('=', '');
      final filePath = '${dir.path}/thumb_$safe.webp';
      final file = File(filePath);
      if (await file.exists()) {
        return file.path;
      }

      // 1) Generate in-memory bytes, then persist
      final Uint8List? bytes = await VideoThumbnail.thumbnailData(
        video: videoUrl,
        imageFormat: ImageFormat.WEBP,
        maxHeight: 200,
        quality: 75,
      );
      if (bytes == null) return null;
      await file.writeAsBytes(bytes, flush: true);
      return file.path;
    } catch (e) {
      print('Error generating thumbnail for $videoUrl: $e');
      return null;
    }
  }

  String _formatDuration(String? duration) {
    // Mock duration - in real app, you'd get this from your API
    return "12:34";
  }

  String _formatViewCount(int views) {
    if (views >= 1000000) {
      return '${(views / 1000000).toStringAsFixed(1)}M views';
    } else if (views >= 1000) {
      return '${(views / 1000).toStringAsFixed(1)}K views';
    } else {
      return '$views views';
    }
  }

  String _formatUploadTime(String? uploadDateTime) {
    if (uploadDateTime == null) return 'Date not available';

    final uploadDate = DateTime.parse(uploadDateTime);
    final now = DateTime.now();
    final difference = now.difference(uploadDate);

    if (difference.inDays > 0) {
      return '${difference.inDays} day${difference.inDays > 1 ? 's' : ''} ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours} hour${difference.inHours > 1 ? 's' : ''} ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes} minute${difference.inMinutes > 1 ? 's' : ''} ago';
    } else {
      return 'Just now';
    }
  }

  @override
  Widget build(BuildContext context) {
    super.build(context); // for AutomaticKeepAliveClientMixin
    return RefreshIndicator(
      onRefresh: widget.onRefresh ?? () async {},
      child: widget.videos.isEmpty
          ? ListView(
              children: [
                SizedBox(height: 120),
                Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        widget.type == 'Events'
                            ? Icons.event_busy
                            : Icons.work_off,
                        size: 80,
                        color: Colors.grey[600],
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'No ${widget.type} videos yet',
                        style: TextStyle(
                          color: Colors.grey[400],
                          fontSize: 18,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Check back later for new content',
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            )
          : ListView.builder(
              padding: const EdgeInsets.all(12),
              itemCount: widget.videos.length,
              itemBuilder: (context, index) {
                final video = widget.videos[index];
                final fullUrl = _buildFullUrl(video['url'] as String?);
                final thumbnailUrl = _thumbnails[fullUrl];
                return GestureDetector(
                  onTap: () {
                    // Navigate to the display video page with full details
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => DisplayVideoPage(video: video),
                      ),
                    );
                  },
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 20, top: 20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // ...existing code for video card...
                        Container(
                          width: double.infinity,
                          height: 200,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(12),
                            color: AppColors.textPrimary,
                          ),
                          child: Stack(
                            children: [
                              if (thumbnailUrl != null)
                                ClipRRect(
                                  borderRadius: BorderRadius.circular(12),
                                  child: Image.file(
                                    File(thumbnailUrl),
                                    width: double.infinity,
                                    height: 200,
                                    fit: BoxFit.cover,
                                    errorBuilder:
                                        (context, error, stackTrace) =>
                                            _buildPlaceholder(),
                                  ),
                                )
                              else
                                _buildPlaceholder(),
                              Positioned(
                                bottom: 8,
                                right: 8,
                                child: Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 6,
                                    vertical: 2,
                                  ),
                                  decoration: BoxDecoration(
                                    color: Colors.black.withOpacity(0.8),
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: Text(
                                    _formatDuration(video['duration']),
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 12,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 12),
                        // ...existing code for video info...
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // ...existing code for avatar and details...
                            CircleAvatar(
                              radius: 18,
                              backgroundColor: AppColors.primary,
                              child: Text(
                                'CN',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  // ...existing code for title, channel, views, upload time, description...
                                  Text(
                                    video['title'] ?? 'No Title',
                                    style: AppTextStyles.bodyLarge(context)
                                        .copyWith(
                                      fontWeight: FontWeight.w500,
                                      height: 1.3,
                                    ),
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    'Career Nest',
                                    style: AppTextStyles.bodySmall(context),
                                  ),
                                  const SizedBox(height: 2),
                                  Row(
                                    children: [
                                      Text(
                                        _formatViewCount(
                                          (video['views'] as int?) ??
                                              (100 + (index * 50)),
                                        ),
                                        style: TextStyle(
                                          color: Colors.grey[400],
                                          fontSize: 14,
                                        ),
                                      ),
                                      Text(
                                        ' • ',
                                        style: TextStyle(
                                          color: Colors.grey[400],
                                          fontSize: 14,
                                        ),
                                      ),
                                      Text(
                                        _formatUploadTime(
                                            video['uploaded_datetime']),
                                        style: TextStyle(
                                          color: Colors.grey[400],
                                          fontSize: 14,
                                        ),
                                      ),
                                    ],
                                  ),
                                  if (video['description'] != null) ...[
                                    const SizedBox(height: 4),
                                    Text(
                                      video['description'],
                                      style: TextStyle(
                                        color: Colors.grey[500],
                                        fontSize: 13,
                                      ),
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ],
                                ],
                              ),
                            ),
                            IconButton(
                              icon: Icon(
                                Icons.more_vert,
                                color: Colors.grey[400],
                                size: 20,
                              ),
                              onPressed: () {
                                // Add more options functionality
                              },
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }

  @override
  bool get wantKeepAlive => true;

  Widget _buildPlaceholder() {
    return Container(
      width: double.infinity,
      height: double.infinity,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppColors.primary.withOpacity(0.3),
            AppColors.secondary.withOpacity(0.3),
          ],
        ),
      ),
      child: const Icon(
        Icons.play_circle_outline,
        size: 60,
        color: Colors.white,
      ),
    );
  }
}
