// StatelessWidget for the Account screen, displaying user profile information and options.
import 'package:career_nest/common/login.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AccountPage extends StatefulWidget {
  final String userName;
  const AccountPage({super.key, required this.userName});

  @override
  State<AccountPage> createState() => _AccountPageState();
}

class _AccountPageState extends State<AccountPage> {
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
            style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.white)),
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
                  Text(widget.userName,
                      style: const TextStyle(
                          fontSize: 22, fontWeight: FontWeight.bold)),
                ],
              ),
            ),
            const SizedBox(height: 30),
            // Build a list of account option cards.
            ...options.map((option) => _buildAccountOption(context, option)),
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
          } else
            print('$title tapped');
        },
      ),
    );
  }
}
