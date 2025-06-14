import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../admin/dashboard.dart';
import '../student/dashboard.dart';

class AuthService {
  static Future<void> login(
      String email, String password, BuildContext context) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();

    // Mock validation
    if (email == "student@example.com" && password == "password") {
      await prefs.setBool('isLoggedIn', true);
      await prefs.setString('userType', 'student');
      Navigator.pushReplacement(context,
          MaterialPageRoute(builder: (_) => DashboardPage()));
    } else if (email == "teacher@example.com" && password == "password") {
      await prefs.setBool('isLoggedIn', true);
      await prefs.setString('userType', 'teacher');
      Navigator.pushReplacement(context,
          MaterialPageRoute(builder: (_) => AdminDashboardPage()));
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Invalid login credentials')),
      );
    }
  }

  static Future<void> signup(String email, String otp, String password,
      String userType, BuildContext context) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();

    // Assume OTP is always correct for now
    await prefs.setBool('isLoggedIn', true);
    await prefs.setString('userType', userType);

    if (userType == 'student') {
      Navigator.pushReplacement(context,
          MaterialPageRoute(builder: (_) => DashboardPage()));
    } else {
      Navigator.pushReplacement(context,
          MaterialPageRoute(builder: (_) => AdminDashboardPage()));
    }
  }
}
