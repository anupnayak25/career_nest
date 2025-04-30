import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:url_launcher/url_launcher.dart'; // Import for opening URLs

import 'package:career_nest/screens/student/hr/hr_list.dart';
import 'package:career_nest/screens/student/techinical/technical_list.dart';
import 'programing/programming_list.dart';
import 'quiz_pages/quiz_list.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  _DashboardPageState createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  int _selectedIndex = 0;

  final List<Widget> _pages = const [
    HomePage(userName: 'Kristin'),
    TestsPage(),
    NotificationsPage(),
    AccountPage(userName: 'Kristin'),
  ];

  void _onItemTapped(int index) {
    setState(() => _selectedIndex = index);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.blue,
        unselectedItemColor: Colors.grey,
        onTap: _onItemTapped,
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.assignment), label: 'Tests'),
          BottomNavigationBarItem(
              icon: Icon(Icons.notifications), label: 'Notifications'),
          BottomNavigationBarItem(
              icon: Icon(Icons.account_circle), label: 'Account'),
        ],
      ),
    );
  }
}

// ---------------- HOME ----------------

class HomePage extends StatefulWidget {
  final String userName;
  const HomePage({super.key, required this.userName});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  List<Map<String, dynamic>> _eventVideos = [];
  List<Map<String, dynamic>> _placementVideos = [];

  @override
  void initState() {
    super.initState();
    _fetchVideos();
  }

  Future<void> _fetchVideos() async {
    // Replace with your actual API base URL
    const String apiUrl = 'YOUR_API_BASE_URL';
    final Uri eventsUri = Uri.parse('$apiUrl/api/videos/?category=Events');
    final Uri placementsUri =
        Uri.parse('$apiUrl/api/videos/?category=Placements');

    try {
      final eventsResponse = await http.get(eventsUri);
      final placementsResponse = await http.get(placementsUri);

      if (eventsResponse.statusCode == 200 &&
          placementsResponse.statusCode == 200) {
        final List<dynamic> eventsData = json.decode(eventsResponse.body);
        final List<dynamic> placementsData =
            json.decode(placementsResponse.body);

        setState(() {
          _eventVideos = eventsData.cast<Map<String, dynamic>>();
          _placementVideos = placementsData.cast<Map<String, dynamic>>();
        });
      } else {
        print(
            'Failed to fetch videos - Events: ${eventsResponse.statusCode}, Placements: ${placementsResponse.statusCode}');
        // Optionally show an error message to the user
      }
    } catch (error) {
      print('Error fetching videos: $error');
      // Optionally show an error message to the user
    }
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          backgroundColor: Colors.blue,
          title: Text('Hi, ${widget.userName}',
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
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
            _eventVideos.isEmpty
                ? const Center(child: CircularProgressIndicator())
                : VideoList(videos: _eventVideos),
            _placementVideos.isEmpty
                ? const Center(child: Text('No placement videos yet.'))
                : VideoList(videos: _placementVideos),
          ],
        ),
      ),
    );
  }
}

class VideoList extends StatelessWidget {
  final List<Map<String, dynamic>> videos;
  const VideoList({super.key, required this.videos});

  Future<void> _launchUrl(String url) async {
    final Uri uri = Uri.parse(url);
    if (!await launchUrl(uri)) {
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
              if (video['url'] != null) {
                _launchUrl(video['url']);
              } else {
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

// ---------------- TESTS ----------------

class TestsPage extends StatelessWidget {
  const TestsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tests', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.blue,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: [
            const Text('Choose your Test', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            _buildTestCard(context, 'QUIZ', const QuizListPage()),
            _buildTestCard(context, 'Programming', const ProgramingListPage()),
            _buildTestCard(context, 'HR', const HRListPage()),
            _buildTestCard(context, 'Technical', const TechnicalListPage()),
          ],
        ),
      ),
    );
  }

  Widget _buildTestCard(BuildContext context, String title, Widget page) {
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      elevation: 3,
      child: ListTile(
        title: Text(title, style: const TextStyle(fontSize: 18)),
        leading: const Icon(Icons.assignment, color: Colors.blue),
        trailing: const Icon(Icons.arrow_forward_ios),
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => page)),
      ),
    );
  }
}

// ---------------- NOTIFICATIONS ----------------

class NotificationsPage extends StatelessWidget {
  const NotificationsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, String>> notifications = const [
      {'title': 'Congratulations on completing the test!', 'time': 'Just now'},
      {'title': 'Your course has been updated', 'time': 'Today'},
      {'title': 'You have a new message', 'time': '1 hour ago'},
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.blue,
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: notifications.length,
        itemBuilder: (context, index) {
          return NotificationCard(
            title: notifications[index]['title']!,
            time: notifications[index]['time']!,
          );
        },
      ),
    );
  }
}

class NotificationCard extends StatelessWidget {
  final String title;
  final String time;

  const NotificationCard({super.key, required this.title, required this.time});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      child: ListTile(
        leading: const Icon(Icons.notifications, color: Colors.blue),
        title: Text(title),
        subtitle: Text(time, style: const TextStyle(color: Colors.grey)),
      ),
    );
  }
}

// ---------------- ACCOUNT ----------------

class AccountPage extends StatelessWidget {
  final String userName;
  const AccountPage({super.key, required this.userName});

  @override
  Widget build(BuildContext context) {
    final List<String> options = [
      'Favourite',
      'Edit Account',
      'Settings and Privacy',
      'Help',
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Your Profile', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.blue,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Center(
              child: Column(
                children: [
                  const CircleAvatar(radius: 40, backgroundColor: Colors.blue),
                  const SizedBox(height: 10),
                  Text(userName, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                ],
              ),
            ),
            const SizedBox(height: 30),
            ...options.map((option) => _buildAccountOption(option)).toList(),
          ],
        ),
      ),
    );
  }

  Widget _buildAccountOption(String title) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      margin: const EdgeInsets.only(bottom: 10),
      child: ListTile(
        title: Text(title, style: const TextStyle(fontSize: 18)),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
        onTap: () {
          // Handle action
        },
      ),
    );
  }
}
