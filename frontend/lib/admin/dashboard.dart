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

class AdminDashboardPage extends StatefulWidget {
  final List<String> menuItems = [
     'Upload video',
     'Quiz',
     'Programming',
     'Technical',
     'HR',
   ];
  @override
  _AdminDashboardPageState createState() => _AdminDashboardPageState();
}

class _AdminDashboardPageState extends State<AdminDashboardPage> {
  final List<String> menuItems = [
    'Manage Quizzes',
    'Manage Programming Tests',
    'Manage Technical Tests',
    'Manage HR Tests',
    'Add New Video',
  ];

  List<Video> eventsVideos = [
    Video(
      title: 'Admin Event Video 1',
      description: 'Admin Description 1',
      category: 'events',
      date: 'April 21, 2025',
      image: 'assets/admin_video1.png',
    ),
  ];

  List<Video> placementsVideos = [
    Video(
      title: 'Admin Placement Video 1',
      description: 'Admin Description 2',
      category: 'placement',
      date: 'April 22, 2025',
      image: 'assets/admin_video2.png',
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
                    'Admin Panel',
                    style: TextStyle(color: Colors.white, fontSize: 24),
                  ),
                ),
                ...menuItems.map(
                  (item) => ListTile(
                    title: Text(item, style: TextStyle(color: Colors.white)),
                    onTap: () {
                      Navigator.pop(context);
                      // Add navigation for admin here based on the item
                      print('Admin tapped: $item');
                      // Example navigation (replace with your actual routes)
                      if (item == 'Add New Video') {
                        // Navigator.push(context, MaterialPageRoute(builder: (context) => AddNewVideoScreen()));
                      }
                    },
                  ),
                ),
              ],
            ),
          ),
        ),
        appBar: AppBar(
          title: const Text('Admin Dashboard'),
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
                backgroundColor: Colors.white,
                child: Icon(Icons.admin_panel_settings, color: Colors.blue),
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
          description: video.description, // Pass description for admin view
        );
      },
    );
  }

  Widget _buildVideoCard({
    required String image,
    required String title,
    required String date,
    String? description, // Description is optional for the card
  }) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 4,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 150,
            width: double.infinity,
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
                Text(title, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                SizedBox(height: 6),
                Text('Date Added: $date', style: TextStyle(color: Colors.grey)),
                if (description != null) ...[
                  SizedBox(height: 6),
                  Text(description, style: TextStyle(color: Colors.black87)),
                ],
                SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    IconButton(
                      icon: Icon(Icons.edit, color: Colors.blue),
                      onPressed: () {
                        // Implement edit functionality
                        print('Edit: $title');
                      },
                    ),
                    IconButton(
                      icon: Icon(Icons.delete, color: Colors.red),
                      onPressed: () {
                        // Implement delete functionality
                        print('Delete: $title');
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
