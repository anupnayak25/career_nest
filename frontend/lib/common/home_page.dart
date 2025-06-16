
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:url_launcher/url_launcher.dart';


class HomePage extends StatefulWidget {
  final String userName;
  const HomePage({super.key, required this.userName});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  // Lists to store event and placement videos fetched from the API.
  List<Map<String, dynamic>> _eventVideos = [];
  List<Map<String, dynamic>> _placementVideos = [];
  @override
  void initState() {
    super.initState();
    _fetchVideos(); // Fetch videos when the widget is initialized.
  }

  // Asynchronous function to fetch video data from the API.
  Future<void> _fetchVideos() async {
    // Replace with your actual API base URL
    final token = dotenv.get('AUTH_TOKEN');
    final apiUrl = dotenv.get('API_URL');
    final Uri eventsUri = Uri.parse('$apiUrl/api/videos');
    final Uri placementsUri =
        Uri.parse('$apiUrl/api/videos/');

    try {
      // Make HTTP GET requests to fetch event and placement videos.
      final eventsResponse = await http.get(eventsUri, headers: {
        'Authorization': 'Bearer $token', // Fixed: Added 'Bearer'
        'Content-Type': 'application/json',
      });
      final placementsResponse = await http.get(placementsUri, headers: {
        'Authorization': 'Bearer $token', // Fixed: Added 'Bearer'
        'Content-Type': 'application/json',
      });

      // Check if both requests were successful (status code 200).
      if (eventsResponse.statusCode == 200 &&
          placementsResponse.statusCode == 200) {
        // Decode the JSON response body into List<dynamic>.
        final List<dynamic> eventsData = json.decode(eventsResponse.body);
        final List<dynamic> placementsData =
            json.decode(placementsResponse.body);

        // Update the state with the fetched video data.
        setState(() {
          _eventVideos = eventsData.cast<Map<String, dynamic>>();
          _placementVideos = placementsData.cast<Map<String, dynamic>>();
        });
      } else {
        // Log an error message if fetching videos failed.
       // print(
         //   'Failed to fetch videos - Events: ${eventsResponse.statusCode}, Placements: ${placementsResponse.statusCode}');
        // Optionally, you could show an error message to the user using a SnackBar or AlertDialog.
      }
    } catch (error) {
      // Log an error message if an exception occurred during the process.
     // print('Error fetching videos: $error');
      // Optionally, show an error message to the user.
    }
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2, // Number of tabs.
      child: Scaffold(
        appBar: AppBar(
          title: Text('Carreer Nest', style: TextStyle(color: Colors.white)),
          automaticallyImplyLeading: false,
          backgroundColor: Colors.blue,
          bottom: const TabBar(
            indicatorColor: Colors.white,
            labelColor: Colors.white,
            unselectedLabelColor: Colors.white70,
            tabs: [
              Tab(text: 'Events'),
              Tab(text: 'Placements'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            // Display a progress indicator if event videos are still loading, otherwise show the VideoList.
            _eventVideos.isEmpty
                ? const Center(child: CircularProgressIndicator())
                : VideoList(videos: _eventVideos),
            // Display a message if no placement videos are available, otherwise show the VideoList.
            _placementVideos.isEmpty
                ? const Center(child: Text('No placement videos yet.'))
                : VideoList(videos: _placementVideos),
          ],
        ),
      ),
    );
  }
}
// StatelessWidget to display a list of videos.
class VideoList extends StatelessWidget {
  final List<Map<String, dynamic>> videos;
  const VideoList({super.key, required this.videos});

  // Asynchronous function to launch a URL using the url_launcher package.
  Future<void> _launchURL(String url) async {
    final Uri uri = Uri.parse(url);
    // Check if the URL can be launched.
    if (!await launchUrl(uri)) {
      // If it cannot be launched, throw an exception.
      throw Exception('Could not launch $url');
    }

  }

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: videos.length,
      itemBuilder: (context, index) {
        final video = videos[index];
        return Card(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          elevation: 4,
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            title: Text(video['title'] ?? 'No Title',
                style: const TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  video['uploaded_datetime'] != null
                      ? 'Uploaded: ${DateTime.parse(video['uploaded_datetime']).toLocal().toString().split('.').first}'
                      : 'Date not available',
                  style: const TextStyle(color: Colors.grey),
                ),
                if (video['description'] != null)
                  Text(
                    video['description'],
                    style: const TextStyle(color: Colors.black87),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
              ],
            ),
            leading: const Icon(Icons.video_collection, color: Colors.blue),
            onTap: () {
              // Call _launchURL when a video item is tapped, if the URL is available.
              if (video['url'] != null) {
                _launchURL(video['url']);
              } else {
                // Show a SnackBar if the video URL is not available.
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Video URL not available.')),
                );
              }
            },
            
          ),
        );
      },
    );
  }
}
