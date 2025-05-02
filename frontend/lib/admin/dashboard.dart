import 'package:flutter/material.dart';
import '../common/home_page.dart'; // Adjust the import path as needed

class AdminDashboardPage extends StatelessWidget {
  const AdminDashboardPage({super.key});

  final List<String> menuItems = const [
    'Home',
    'Manage Quizzes',
    'Manage Programming Tests',
    'Manage Technical Tests',
    'Manage HR Tests',
    'Add New Video',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: Drawer(
        child: Container(
          color: Colors.blue,
          child: ListView(
            padding: const EdgeInsets.all(20),
            children: [
              const DrawerHeader(
                child: Text(
                  'Admin Panel',
                  style: TextStyle(color: Colors.white, fontSize: 24),
                ),
              ),
              ...menuItems.map(
                (item) => ListTile(
                  title: Text(item, style: const TextStyle(color: Colors.white)),
                  onTap: () {
                    Navigator.pop(context);
                    if (item == 'Home') {
                      // Already on Home - do nothing or add logic to refresh
                    } else {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Tapped on "$item"')),
                      );
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
            icon: const Icon(Icons.menu),
            onPressed: () => Scaffold.of(context).openDrawer(),
          ),
        ),
        actions: const [
          Padding(
            padding: EdgeInsets.only(right: 16.0),
            child: CircleAvatar(
              backgroundColor: Colors.white,
              child: Icon(Icons.admin_panel_settings, color: Colors.blue),
            ),
          ),
        ],
      ),
      // 👇 Display HomePage inside the body
      body: const HomePage(userName: "Admin"),
    );
  }
}
