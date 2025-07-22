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
    final theme = Theme.of(context);
    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: Text('Home', style: theme.textTheme.titleLarge),
        backgroundColor: theme.primaryColor,
        foregroundColor: Colors.white,
        elevation: 2,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                TabBar(
                  controller: _tabController,
                  labelColor: theme.primaryColor,
                  unselectedLabelColor: theme.textTheme.bodyMedium?.color,
                  indicatorColor: theme.primaryColor,
                  tabs: const [
                    Tab(text: 'Events'),
                    Tab(text: 'Placements'),
                  ],
                ),
                Expanded(
                  child: TabBarView(
                    controller: _tabController,
                    children: [
                      _buildVideoList(_eventVideos, theme),
                      _buildVideoList(_placementVideos, theme),
                    ],
                  ),
                ),
              ],
            ),
    );
  }

  Widget _buildVideoList(List<Map<String, dynamic>> videos, ThemeData theme) {
    if (videos.isEmpty) {
      return Center(
        child: Text(
          'No videos available',
          style: theme.textTheme.bodyMedium,
        ),
      );
    }
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: videos.length,
      itemBuilder: (context, index) {
        final video = videos[index];
        return Card(
          color: theme.cardColor,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          elevation: 3,
          margin: const EdgeInsets.only(bottom: 16),
          child: ListTile(
            contentPadding: const EdgeInsets.all(16),
            title: Text(
              video['title'] ?? '',
              style: theme.textTheme.titleMedium,
            ),
            subtitle: Text(
              video['description'] ?? '',
              style: theme.textTheme.bodyMedium,
            ),
            trailing: Icon(
              Icons.play_circle_fill,
              color: theme.primaryColor,
              size: 32,
            ),
            onTap: () async {
              final url = video['url'];
              if (url != null && await canLaunchUrl(Uri.parse(url))) {
                await launchUrl(Uri.parse(url));
              }
            },
          ),
        );
      },
    );
  }
}
