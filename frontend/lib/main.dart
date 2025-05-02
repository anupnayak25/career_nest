import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'common/splash_screen.dart';
import 'admin/dashboard.dart';
import 'student/dashboard.dart';
import 'common/login.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Load environment variables
  await dotenv.load(fileName: ".env");

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
        return const StudentDashboardPage(); // or HomePage() if that's the actual student home
      } else if (userType == 'teacher') {
        return const AdminDashboardPage();
      }
    }

    return const LoginPage(); // Default to login if not logged in
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
          } else if (snapshot.hasData) {
            return snapshot.data!;
          } else {
            return const LoginPage();
          }
        },
      ),
    );
  }
}
