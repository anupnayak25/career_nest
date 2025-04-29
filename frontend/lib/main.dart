import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import './screens/splash_screen.dart';
import './screens/admin/dashboard.dart';
import './screens/student/dashboard.dart';
import './screens/login.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  Future<Widget> _getInitialScreen() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    bool isLoggedIn = prefs.getBool('isLoggedIn') ?? false;
    String userType = prefs.getString('userType') ?? '';

    if (isLoggedIn) {
      if (userType == 'student') {
        return const HomePage();
      } else if (userType == 'teacher') {
        return AdminDashboardPage();
      }
    }
    return const LoginPage(); // Login/signup screen
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Career Nest',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      debugShowCheckedModeBanner: false,
      home: FutureBuilder<Widget>(
        future: _getInitialScreen(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const SplashScreen();
          } else {
            return snapshot.data!;
          }
        },
      ),
    );
  }
}
