//home_page.dart
import 'package:career_nest/common/animated_appbar.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';

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

  Future<void> _fetchVideos() async {
    if (mounted) {
      setState(() {
        _isLoading = true;
      });
    }

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    final apiUrl = dotenv.get('API_URL', fallback: 'http://localhost:5000');
    final Uri videosUri = Uri.parse('$apiUrl/api/videos');

    try {
      final response = await http.get(videosUri, headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      });

      if (response.statusCode == 200) {
        final responseData = json.decode(response.body);

        if (responseData['success'] == true) {
          final List<dynamic> allVideos = responseData['data'] ?? [];

          // Separate videos by category
          final eventVideos = allVideos
              .where((video) => video['category'] == 'Event')
              .toList()
              .cast<Map<String, dynamic>>();

          final placementVideos = allVideos
              .where((video) => video['category'] == 'Placement')
              .toList()
              .cast<Map<String, dynamic>>();

          if (mounted) {
            setState(() {
              _eventVideos = eventVideos;
              _placementVideos = placementVideos;
              _isLoading = false;
            });
          }
        } else {
          if (mounted) {
            setState(() {
              _isLoading = false;
            });
          }
        }
      } else {
        if (mounted) {
          setState(() {
            _isLoading = false;
          });
        }
      }
    } catch (error) {
      print('Error fetching videos: $error');
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
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
          // Background Content (Tab Views)
          Padding(
            padding: const EdgeInsets.only(top: 120), // Same height as AppBar
            child: TabBarView(
              controller: _tabController,
              children: [
                YouTubeVideoGrid(videos: _eventVideos, type: 'Events'),
                YouTubeVideoGrid(videos: _placementVideos, type: 'Placements'),
              ],
            ),
          ),

          // Floating AppBar on top of content
          SizedBox(
            height: 120,
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

class YouTubeVideoGrid extends StatelessWidget {
  final List<Map<String, dynamic>> videos;
  final String type;

  const YouTubeVideoGrid({
    super.key,
    required this.videos,
    required this.type,
  });

  Future<void> _launchURL(String url) async {
    final Uri uri = Uri.parse(url);
    if (!await launchUrl(uri)) {
      throw Exception('Could not launch $url');
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
    if (videos.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              type == 'Events' ? Icons.event_busy : Icons.work_off,
              size: 80,
              color: Colors.grey[600],
            ),
            const SizedBox(height: 16),
            Text(
              'No $type videos yet',
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
      );
    }

    return Container(
      color: Colors.white,
      child: ListView.builder(
        padding: const EdgeInsets.all(12),
        itemCount: videos.length,
        itemBuilder: (context, index) {
          final video = videos[index];
          return GestureDetector(
            onTap: () {
              if (video['url'] != null) {
                _launchURL(video['url']);
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Video URL not available.'),
                    backgroundColor: Colors.red,
                  ),
                );
              }
            },
            child: Container(
              margin: const EdgeInsets.only(bottom: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Video Thumbnail
                  Container(
                    width: double.infinity,
                    height: 200,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      color: Colors.grey[900],
                    ),
                    child: Stack(
                      children: [
                        // Placeholder thumbnail
                        Container(
                          width: double.infinity,
                          height: double.infinity,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(12),
                            gradient: LinearGradient(
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                              colors: [
                                Colors.red.withOpacity(0.3),
                                Colors.blue.withOpacity(0.3),
                              ],
                            ),
                          ),
                          child: const Icon(
                            Icons.play_circle_outline,
                            size: 60,
                            color: Colors.black,
                          ),
                        ),
                        // Duration badge
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
                                color: Colors.black,
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
                  // Video Info
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Channel Avatar
                      CircleAvatar(
                        radius: 18,
                        backgroundColor: Colors.red,
                        child: Text(
                          'CN',
                          style: const TextStyle(
                            color: Colors.black,
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      // Video Details
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              video['title'] ?? 'No Title',
                              style: const TextStyle(
                                color: Colors.black,
                                fontSize: 16,
                                fontWeight: FontWeight.w500,
                                height: 1.3,
                              ),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Career Nest',
                              style: TextStyle(
                                color: Colors.grey[400],
                                fontSize: 14,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Row(
                              children: [
                                Text(
                                  _formatViewCount(
                                    (video['views'] as int?) ??
                                        (100 + (index * 50)), // Mock view count
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
                                  _formatUploadTime(video['uploaded_datetime']),
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
                      // More options
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
}
