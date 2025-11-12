import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:career_nest/common/theme.dart';
import 'package:video_player/video_player.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class DisplayVideoPage extends StatefulWidget {
  final Map<String, dynamic> video;

  const DisplayVideoPage({super.key, required this.video});

  @override
  State<DisplayVideoPage> createState() => _DisplayVideoPageState();
}

class _DisplayVideoPageState extends State<DisplayVideoPage> {
  late VideoPlayerController _controller;
  late Future<void> _initializeVideoPlayerFuture;
  bool _isPlayerInitialized = false;
  String? _fullVideoUrl;

  @override
  void initState() {
    super.initState();
    final String? rawUrl = widget.video['url'] as String?;
    // Build absolute URL if backend returns only filename
    final String base =
        (dotenv.maybeGet('API_URL') ?? dotenv.env['API_URL'] ?? '').trim();
    if (rawUrl != null && rawUrl.isNotEmpty) {
      if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
        _fullVideoUrl = rawUrl;
      } else if (base.isNotEmpty) {
        final String normalizedBase =
            base.endsWith('/') ? base.substring(0, base.length - 1) : base;
        _fullVideoUrl = '$normalizedBase/videos/$rawUrl';
      } else {
        // Fallback: try raw string (may fail, but better than nothing)
        _fullVideoUrl = rawUrl;
      }
    }

    if (_fullVideoUrl != null && _fullVideoUrl!.isNotEmpty) {
      _isPlayerInitialized = true;
      _controller = VideoPlayerController.networkUrl(Uri.parse(_fullVideoUrl!));
      _initializeVideoPlayerFuture = _controller.initialize().then((_) {
        if (mounted) setState(() {});
      });
      _controller.setLooping(true);
    }
  }

  @override
  void dispose() {
    if (_isPlayerInitialized) {
      _controller.dispose();
    }
    super.dispose();
  }

  Future<void> _launchURL(String url) async {
    final Uri uri = Uri.parse(url);
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
      throw Exception('Could not launch $url');
    }
  }

  String _formatViewCount(int? views) {
    final v = views ?? 0;
    if (v >= 1000000) {
      return '${(v / 1000000).toStringAsFixed(1)}M views';
    } else if (v >= 1000) {
      return '${(v / 1000).toStringAsFixed(1)}K views';
    } else {
      return '$v views';
    }
  }

  String _formatUploadTime(String? uploadDateTime) {
    if (uploadDateTime == null || uploadDateTime.isEmpty) {
      return 'Date not available';
    }
    try {
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
    } catch (_) {
      return 'Date not available';
    }
  }

  @override
  Widget build(BuildContext context) {
    final String title = (widget.video['title'] as String?) ?? 'Untitled Video';
    final String? description = widget.video['description'] as String?;
    final int? views =
        widget.video['views'] is int ? widget.video['views'] as int : null;
    // Fix key typo if present
    final String? uploadedAt = (widget.video['uploaded_datetime'] ??
        widget.video['uploarded_datetime']) as String?;
    final String? category = widget.video['category'] as String?;
    final String? duration = widget.video['duration']?.toString();

    return Scaffold(
      appBar: AppBar(
        title: Text(
          title,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        backgroundColor: AppColors.primary,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (_isPlayerInitialized)
              FutureBuilder(
                future: _initializeVideoPlayerFuture,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.done &&
                      _controller.value.isInitialized) {
                    return AspectRatio(
                      aspectRatio: _controller.value.aspectRatio,
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Stack(
                          alignment: Alignment.bottomCenter,
                          children: <Widget>[
                            VideoPlayer(_controller),
                            VideoProgressIndicator(
                              _controller,
                              allowScrubbing: true,
                              padding: EdgeInsets.zero,
                            ),
                            GestureDetector(
                              onTap: () {
                                setState(() {
                                  if (_controller.value.isPlaying) {
                                    _controller.pause();
                                  } else {
                                    _controller.play();
                                  }
                                });
                              },
                              child: Center(
                                child: Icon(
                                  _controller.value.isPlaying
                                      ? Icons.pause
                                      : Icons.play_arrow,
                                  size: 50.0,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  } else if (_controller.value.hasError) {
                    return _PlaybackErrorFallback(url: _fullVideoUrl);
                  } else {
                    return Container(
                      width: double.infinity,
                      height: 220,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(12),
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            AppColors.primary.withOpacity(0.25),
                            AppColors.secondary.withOpacity(0.25),
                          ],
                        ),
                      ),
                      child: const Center(
                        child: CircularProgressIndicator(),
                      ),
                    );
                  }
                },
              )
            else
              Container(
                width: double.infinity,
                height: 220,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      AppColors.primary.withOpacity(0.25),
                      AppColors.secondary.withOpacity(0.25),
                    ],
                  ),
                ),
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    const Icon(Icons.play_circle_outline,
                        size: 72, color: Colors.white),
                    if (duration != null && duration.isNotEmpty)
                      Positioned(
                        bottom: 10,
                        right: 10,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.black.withOpacity(0.75),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            duration,
                            style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w600),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            const SizedBox(height: 16),

            // Title
            Text(
              title,
              style: AppTextStyles.bodyLarge(context).copyWith(
                fontWeight: FontWeight.w700,
                fontSize: 20,
                height: 1.3,
              ),
            ),
            const SizedBox(height: 8),

            // Meta row
            Wrap(
              crossAxisAlignment: WrapCrossAlignment.center,
              spacing: 12,
              runSpacing: 8,
              children: [
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.remove_red_eye,
                        size: 18, color: Colors.grey),
                    const SizedBox(width: 6),
                    Text(_formatViewCount(views),
                        style: const TextStyle(color: Colors.grey)),
                  ],
                ),
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.access_time, size: 18, color: Colors.grey),
                    const SizedBox(width: 6),
                    Text(_formatUploadTime(uploadedAt),
                        style: const TextStyle(color: Colors.grey)),
                  ],
                ),
                if (category != null && category.isNotEmpty)
                  Chip(
                    label: Text(category),
                    backgroundColor: AppColors.secondary.withOpacity(0.15),
                    side: BorderSide.none,
                    labelStyle: const TextStyle(fontWeight: FontWeight.w600),
                  ),
              ],
            ),

            const SizedBox(height: 16),

            // Action buttons
            if ((_fullVideoUrl ?? '').isNotEmpty)
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10)),
                  ),
                  onPressed: () => _launchURL(_fullVideoUrl!),
                  icon: const Icon(Icons.open_in_new, color: Colors.white),
                  label: const Text('Open in browser',
                      style: TextStyle(color: Colors.white)),
                ),
              )
            else
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.error.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Text(
                  'Video URL not available',
                  style: TextStyle(
                      color: AppColors.error, fontWeight: FontWeight.w600),
                ),
              ),

            const SizedBox(height: 20),

            // Description
            Text(
              'Description',
              style: AppTextStyles.bodyLarge(context)
                  .copyWith(fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 8),
            Text(
              description == null || description.isEmpty
                  ? 'No description provided.'
                  : description,
              style: AppTextStyles.bodySmall(context).copyWith(height: 1.5),
            ),
          ],
        ),
      ),
    );
  }
}

class _PlaybackErrorFallback extends StatelessWidget {
  final String? url;
  const _PlaybackErrorFallback({this.url});

  Future<void> _openExternal(String url) async {
    final uri = Uri.parse(url);
    await launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 220,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppColors.primary.withOpacity(0.25),
            AppColors.secondary.withOpacity(0.25),
          ],
        ),
      ),
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, color: Colors.white, size: 48),
              const SizedBox(height: 12),
              const Text(
                'Could not load video.',
                style:
                    TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
              ),
              if (url != null) ...[
                const SizedBox(height: 8),
                OutlinedButton.icon(
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.white,
                    side: const BorderSide(color: Colors.white70),
                  ),
                  onPressed: () => _openExternal(url!),
                  icon: const Icon(Icons.open_in_new, size: 18),
                  label: const Text('Open in browser'),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
