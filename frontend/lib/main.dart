import 'package:flutter/material.dart';
import './student/dashboard.dart';
import 'student/quiz_pages/quiz_main.dart';
import 'package:career_nest/student/quiz_pages/quiz_detail.dart';




void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Career Nest',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      debugShowCheckedModeBanner: false,
      home: const SplashScreen(),
    );
  }
}

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}


class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Future.delayed(Duration(seconds: 2), () {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const DashboardPage()),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: GestureDetector(
          onTap: () {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) =>  DashboardPage()),
            );
          },
          child: const Text(
            'Tap to Enter Career Nest',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
        ),
      ),
    );
  }
}
