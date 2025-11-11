import 'package:career_nest/common/login.dart';
import 'package:career_nest/common/theme.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
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
    'Logout'
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: Drawer(
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: AppColors.mainGradient,
            ),
          ),
          child: ListView(
            padding: const EdgeInsets.all(20),
            children: [
              const DrawerHeader(
                child: Text(
                  'Admin Panel',
                  style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold),
                ),
              ),
              ...menuItems.map(
                (item) => ListTile(
                  title:
                      Text(item, style: const TextStyle(color: Colors.white)),
                  onTap: () async {
                    Navigator.pop(context);
                    if (item == 'Home') {
                      // Already on Home - do nothing or add logic to refresh
                    } else if (item == 'Logout') {
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
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        leading: Builder(
          builder: (context) => IconButton(
            icon: const Icon(Icons.menu),
            onPressed: () => Scaffold.of(context).openDrawer(),
          ),
        ),
        actions: [
          Padding(
            padding: EdgeInsets.only(right: 16.0),
            child: CircleAvatar(
              backgroundColor: Colors.white,
              child: Icon(Icons.admin_panel_settings, color: AppColors.primary),
            ),
          ),
        ],
      ),
      body: const HomePage(userName: "Admin"),
    );
  }
}
