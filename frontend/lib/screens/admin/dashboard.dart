import 'package:flutter/material.dart';

class Video {
  final String title;
  final String description;
  final String category;
  final String date;
  final String image;

  Video({
    required this.title,
    required this.description,
    required this.category,
    required this.date,
    required this.image,
  });
}

class StudentDashboardPage extends StatefulWidget {
  @override
  _StudentDashboardPageState createState() => _StudentDashboardPageState();
}

class _StudentDashboardPageState extends State<StudentDashboardPage> {
  final List<String> menuItems = [
    'Quiz',
    'Programming',
    'Technical',
    'HR',
  ];

  List<Video> eventsVideos = [
    Video(
      title: 'What do you want to learn today?',
      description: 'Description 1',
      category: 'events',
      date: 'April 20, 2025',
      image: 'assets/video1.png',
    ),
  ];

  List<Video> placementsVideos = [
    Video(
      title: 'Second video title',
      description: 'Description 2',
      category: 'placement',
      date: 'April 19, 2025',
      image: 'assets/video2.png',
    ),
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
                    'Student',
                    style: TextStyle(color: Colors.white, fontSize: 24),
                  ),
                ),
                ...menuItems.map(
                  (item) => ListTile(
                    title: Text(item, style: TextStyle(color: Colors.white)),
                    onTap: () {
                      Navigator.pop(context);
                      // Add navigation for students here if needed
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
                backgroundImage: AssetImage('assets/avatar.png'),
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
            _buildVideoList(eventsVideos),
            _buildVideoList(placementsVideos),
          ],
        ),
      ),
    );
  }

  Widget _buildVideoList(List<Video> videos) {
    return ListView.builder(
      padding: EdgeInsets.all(16),
      itemCount: videos.length,
      itemBuilder: (context, index) {
        final video = videos[index];
        return _buildVideoCard(
          image: video.image,
          title: video.title,
          date: video.date,
        );
      },
    );
  }

  Widget _buildVideoCard({
    required String image,
    required String title,
    required String date,
  }) {
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
