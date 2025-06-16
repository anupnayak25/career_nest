import 'package:flutter/material.dart';
import 'package:career_nest/student/hr/hr_list.dart';
import 'package:career_nest/student/techinical/technical_list.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'programing/programming_list.dart';
import 'quiz_pages/quiz_list.dart';
import '../common/home_page.dart';
import 'package:career_nest/common/login.dart';

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
      // appBar: AppBar(
      //   automaticallyImplyLeading: false,
      //   title: const Text('Career Nest',
      //       style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
      //   backgroundColor: Colors.blue,
      // ),
      body: _pages[
          _selectedIndex], // Display the widget corresponding to the selected index.
      bottomNavigationBar: BottomNavigationBar(
        currentIndex:
            _selectedIndex, // Set the current index of the bottom navigation bar.
        selectedItemColor: Colors.blue, // Color for the selected item.
        unselectedItemColor: Colors.grey, // Color for unselected items.
        onTap: _onItemTapped, // Call _onItemTapped when an item is pressed.
        type: BottomNavigationBarType
            .fixed, // Ensures all labels are always visible.
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

// ---------------- TESTS SCREEN ----------------

// StatelessWidget for the Tests screen, as it displays static content and navigates to other test-related screens.
class TestsPage extends StatelessWidget {
  const TestsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tests',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold,color: Colors.white)),
        backgroundColor: Colors.blue,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: [
            const Text('Choose your Test',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
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
        onTap: () => Navigator.push(
            context, MaterialPageRoute(builder: (context) => page)),
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
        title: const Text('Notifications',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold,color: Colors.white)),
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
      'Logout'
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold,color: Colors.white)),
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
                  Text(userName,
                      style: const TextStyle(
                          fontSize: 22, fontWeight: FontWeight.bold)),
                ],
              ),
            ),
            const SizedBox(height: 30),
            // Build a list of account option cards.
            ...options.map((option) => _buildAccountOption(context, option)).toList(),
          ],
        ),
      ),
    );
  }

  // Helper function to build a reusable account option card.
  Widget _buildAccountOption(BuildContext context, String title) {
  return Card(
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
    margin: const EdgeInsets.only(bottom: 10),
    child: ListTile(
      title: Text(title, style: const TextStyle(fontSize: 18)),
      trailing: const Icon(Icons.arrow_forward_ios, size: 16),
      onTap: () async {
        if (title == "Logout") {
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('auth_token', "");
          await prefs.setString('userType', "");
          await prefs.setString('userName', "");
          await prefs.setString('userEmail', "");
          await prefs.setBool('isLoggedIn', false);
          Navigator.pushAndRemoveUntil(
            context,
            MaterialPageRoute(builder: (_) => const LoginPage()),
            (Route<dynamic> route) => false,
          );
        }
        else
        print('$title tapped');
      },
    ),
  );
}


}
