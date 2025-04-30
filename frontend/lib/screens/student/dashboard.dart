import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:url_launcher/url_launcher.dart';
import 'package:url_launcher/url_launcher_string.dart';

// Import other screens within your application
import 'package:career_nest/screens/student/hr/hr_list.dart';
import 'package:career_nest/screens/student/techinical/technical_list.dart';
import 'programing/programming_list.dart';
import 'quiz_pages/quiz_list.dart';

// StatefulWidget for the main Dashboard page, as it manages the bottom navigation state.
class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  // Index to track the currently selected tab in the bottom navigation bar.
  int _selectedIndex = 0;

  // List of widgets to display for each tab in the bottom navigation bar.
  final List<Widget> _pages = const [
    HomePage(userName: 'Kristin'), // Home screen
    TestsPage(), // Tests listing screen
    NotificationsPage(), // Notifications screen
    AccountPage(userName: 'Kristin'), // User account screen
  ];

  // Function to update the selected index when a bottom navigation item is tapped.
  void _onItemTapped(int index) {
    setState(() => _selectedIndex = index);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_selectedIndex], // Display the widget corresponding to the selected index.
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex, // Set the current index of the bottom navigation bar.
        selectedItemColor: Colors.blue, // Color for the selected item.
        unselectedItemColor: Colors.grey, // Color for unselected items.
        onTap: _onItemTapped, // Call _onItemTapped when an item is pressed.
        type: BottomNavigationBarType.fixed, // Ensures all labels are always visible.
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

// ---------------- HOME SCREEN ----------------

// StatefulWidget for the Home screen to manage the state of fetched videos.
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
    // Replace 'YOUR_API_BASE_URL' with the actual base URL of your API.
    const String apiUrl = 'YOUR_API_BASE_URL';
    final Uri eventsUri = Uri.parse('$apiUrl/api/videos/?category=Events');
    final Uri placementsUri =
        Uri.parse('$apiUrl/api/videos/?category=Placements');

    try {
      // Make HTTP GET requests to fetch event and placement videos.
      final eventsResponse = await http.get(eventsUri);
      final placementsResponse = await http.get(placementsUri);

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
        print(
            'Failed to fetch videos - Events: ${eventsResponse.statusCode}, Placements: ${placementsResponse.statusCode}');
        // Optionally, you could show an error message to the user using a SnackBar or AlertDialog.
      }
    } catch (error) {
      // Log an error message if an exception occurred during the process.
      print('Error fetching videos: $error');
      // Optionally, show an error message to the user.
    }
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2, // Number of tabs.
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

// ---------------- TESTS SCREEN ----------------

// StatelessWidget for the Tests screen, as it displays static content and navigates to other test-related screens.
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
            // Build cards for different test categories, navigating to their respective screens on tap.
            _buildTestCard(context, 'QUIZ', const QuizListPage()),
            _buildTestCard(context, 'Programming', const ProgramingListPage()),
            _buildTestCard(context, 'HR', const HRListPage()),
            _buildTestCard(context, 'Technical', const TechnicalListPage()),
          ],
        ),
      ),
    );
  }

  // Helper function to build a reusable test category card.
  Widget _buildTestCard(BuildContext context, String title, Widget page) {
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      elevation: 3,
      child: ListTile(
        title: Text(title, style: const TextStyle(fontSize: 18)),
        leading: const Icon(Icons.assignment, color: Colors.blue),
        trailing: const Icon(Icons.arrow_forward_ios),
        // Navigate to the specified page when the card is tapped.
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => page)),
      ),
    );
  }
}

// ---------------- NOTIFICATIONS SCREEN ----------------

// StatelessWidget for the Notifications screen, displaying a static list of notifications.
class NotificationsPage extends StatelessWidget {
  const NotificationsPage({super.key});

  @override
  Widget build(BuildContext context) {
    // Example list of notifications. In a real app, this would likely be fetched from an API.
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
          // Build a NotificationCard widget for each notification item.
          return NotificationCard(
            title: notifications[index]['title']!,
            time: notifications[index]['time']!,
          );
        },
      ),
    );
  }
}

// StatelessWidget to display a single notification card.
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

// ---------------- ACCOUNT SCREEN ----------------

// StatelessWidget for the Account screen, displaying user profile information and options.
class AccountPage extends StatelessWidget {
  final String userName;
  const AccountPage({super.key, required this.userName});

  @override
  Widget build(BuildContext context) {
    // Example list of account options.
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
            // Display user profile information at the top.
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
            // Build a list of account option cards.
            ...options.map((option) => _buildAccountOption(option)).toList(),
          ],
        ),
      ),
    );
  }

  // Helper function to build a reusable account option card.
  Widget _buildAccountOption(String title) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      margin: const EdgeInsets.only(bottom: 10),
      child: ListTile(
        title: Text(title, style: const TextStyle(fontSize: 18)),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
        onTap: () {
          // Handle the action when an account option is tapped (e.g., navigate to a new screen).
          print('$title tapped'); // Placeholder action
        },
      ),
    );
  }
}