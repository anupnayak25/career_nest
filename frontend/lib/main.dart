import 'package:career_nest/admin/dashboard.dart';
import 'package:career_nest/common/home_page.dart';
import 'package:career_nest/common/login.dart';
import 'package:career_nest/common/splash_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    await dotenv.load(fileName: ".env");
    runApp(const MyApp());
  } catch (e, stack) {
    print("Error loading app: $e\n$stack");
  }
}


class MyApp extends StatelessWidget {
  const MyApp({super.key});

  Future<Widget> _getInitialScreen() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    bool isLoggedIn = prefs.getBool('isLoggedIn') ?? false;
    String userType = prefs.getString('userType') ?? '';

    if (isLoggedIn) {
      if (userType == 'student') {
        return const HomePage(userName: '',); 
      } else if (userType == 'teacher') {
        return const AdminDashboardPage();
      }
    }
    return const LoginPage();
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
