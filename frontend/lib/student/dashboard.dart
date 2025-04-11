import 'package:flutter/material.dart';
import './programing/answer_page.dart';
import './programing/programming_model.dart';
import './programing/programming_service.dart';
import './programing/result_page.dart';
import './quiz/quiz_main.dart';
import './hr/hr_page.dart';
import '../models/hr_model.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});
  @override
  _DashboardPageState createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  int _selectedIndex = 0;

  final List<Widget> _pages = [
    const HomePage(),
    const TestsPage(),
    const NotificationsPage(),
    const AccountPage(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
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
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.assignment), label: 'Tests'),
          BottomNavigationBarItem(
              icon: Icon(Icons.notifications), label: 'Notification'),
          BottomNavigationBarItem(
              icon: Icon(Icons.account_circle), label: 'Account'),
        ],
      ),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Hi, Kristin',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          backgroundColor: Colors.blue,
        ),
        body: Column(
          children: [
            Container(
              color: Colors.white,
              child: const TabBar(
                indicatorColor: Colors.black,
                labelColor: Colors.black,
                unselectedLabelColor: Colors.grey,
                tabs: [
                  Tab(text: 'Events'),
                  Tab(text: 'Placements'),
                ],
              ),
            ),
            const Expanded(
              child: TabBarView(
                children: [
                  VideoList(),
                  VideoList(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class VideoList extends StatelessWidget {
  const VideoList({super.key});

  final List<Map<String, String>> videos = const [
    {'title': 'What do you want to learn today?', 'date': 'Date Added'},
    {'title': 'New Learning Topic', 'date': 'Yesterday'},
  ];

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.all(16.0),
      itemCount: videos.length,
      itemBuilder: (context, index) {
        return Card(
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          child: Padding(
            padding: const EdgeInsets.all(12.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(videos[index]['title']!,
                    style: const TextStyle(
                        fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 5),
                Text(videos[index]['date']!,
                    style: const TextStyle(color: Colors.grey)),
              ],
            ),
          ),
        );
      },
    );
  }
}

class TestsPage extends StatelessWidget {
  const TestsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tests',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.blue,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Choose your Test',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
           

            _buildTestCard(context, 'QUIZ', const QuizListPage()),

            
            



            _buildTestCard(context, 'Programming', AnswerPage()),
            _buildTestCard(context, 'HR', const HrPage()),
          ],
        ),
      ),
    );
  }

  Widget _buildTestCard(BuildContext context, String title, Widget page) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      child: ListTile(
        title: Text(title, style: const TextStyle(fontSize: 18)),
        leading: const Icon(Icons.assignment),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => page),
          );
        },
      ),
    );
  }
}

class NotificationsPage extends StatelessWidget {
  const NotificationsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notification',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.blue,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16.0),
        children: const [
          NotificationCard(
              'Congratulations on completing the test!', 'Just now'),
          NotificationCard('Your course has been updated', 'Just now'),
          NotificationCard('You have a new message', 'Just now'),
        ],
      ),
    );
  }
}

class NotificationCard extends StatelessWidget {
  final String title;
  final String time;

  const NotificationCard(this.title, this.time, {super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      child: ListTile(
        leading: const Icon(Icons.notifications, color: Colors.blue),
        title: Text(title),
        subtitle: Text(time, style: const TextStyle(color: Colors.grey)),
      ),
    );
  }
}

class AccountPage extends StatelessWidget {
  const AccountPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Your Profile',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.blue,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Column(
                children: const [
                  CircleAvatar(radius: 40, backgroundColor: Colors.blue),
                  SizedBox(height: 10),
                  Text('Kristin',
                      style:
                          TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                ],
              ),
            ),
            const SizedBox(height: 20),
            _buildAccountOption('Favourite'),
            _buildAccountOption('Edit Account'),
            _buildAccountOption('Settings and Privacy'),
            _buildAccountOption('Help'),
          ],
        ),
      ),
    );
  }

  static Widget _buildAccountOption(String title) {
    return ListTile(
      title: Text(title, style: const TextStyle(fontSize: 18)),
      trailing: const Icon(Icons.arrow_forward_ios, size: 16),
    );
  }
}
