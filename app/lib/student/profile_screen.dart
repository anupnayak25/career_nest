// StatelessWidget for the Account screen, displaying user profile information and options.
import 'package:career_nest/common/animated_appbar.dart';
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
    final theme = Theme.of(context);
    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: Text('Profile', style: theme.textTheme.titleLarge),
        backgroundColor: theme.primaryColor,
        foregroundColor: Colors.white,
        elevation: 2,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Card(
          color: theme.cardColor,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          elevation: 4,
          child: Padding(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Name: User', style: theme.textTheme.titleMedium),
                const SizedBox(height: 12),
                Text('Email: user@example.com',
                    style: theme.textTheme.bodyMedium),
                // Add more profile fields as needed
              ],
            ),
          ),
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
