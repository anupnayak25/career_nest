import 'package:flutter/material.dart';

class AdminDashboardPage extends StatelessWidget {
  final List<String> menuItems = [
    'Upload video',
    'Quiz',
    'Programming',
    'Technical',
    'HR',
  ];

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        drawer: Drawer(
          child: Container(
            color: Colors.blue,
            child: ListView(
              padding: EdgeInsets.all(20),
              children: [
                const DrawerHeader(
                  child: Text(
                    'Admin',
                    style: TextStyle(color: Colors.white, fontSize: 24),
                  ),
                ),
                ...menuItems.map(
                  (item) => ListTile(
                    title: Text(item, style: TextStyle(color: Colors.white)),
                    onTap: () {
                      Navigator.pop(context);
                    },
                  ),
                ),
              ],
            ),
          ),
        ),
        appBar: AppBar(
          title: const Text('Dashboard'),
          backgroundColor: Colors.blue,
          leading: Builder(
            builder: (context) => IconButton(
              icon: Icon(Icons.menu),
              onPressed: () => Scaffold.of(context).openDrawer(),
            ),
          ),
          actions: [
            Padding(
              padding: const EdgeInsets.only(right: 16.0),
              child: CircleAvatar(
                backgroundImage: AssetImage('assets/avatar.png'), // Replace with your image
              ),
            ),
          ],
          bottom: const TabBar(
            tabs: [
              Tab(text: 'Events'),
              Tab(text: 'Placements'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _buildVideoList(),
            _buildVideoList(),
          ],
        ),
      ),
    );
  }

  Widget _buildVideoList() {
    return ListView(
      padding: EdgeInsets.all(16),
      children: [
        _buildVideoCard(
          image: 'assets/video1.png',
          title: 'What do you want to learn today?',
          date: 'April 20, 2025',
        ),
        SizedBox(height: 16),
        _buildVideoCard(
          image: 'assets/video2.png',
          title: 'Second video title',
          date: 'April 19, 2025',
        ),
      ],
    );
  }

  Widget _buildVideoCard({required String image, required String title, required String date}) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 4,
      child: Column(
        children: [
          Container(
            height: 150,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.vertical(top: Radius.circular(12)),
              image: DecorationImage(
                image: AssetImage(image),
                fit: BoxFit.cover,
              ),
            ),
          ),
          Padding(
            padding: EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: TextStyle(fontWeight: FontWeight.bold)),
                SizedBox(height: 6),
                Text('Date Added: $date', style: TextStyle(color: Colors.grey)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
