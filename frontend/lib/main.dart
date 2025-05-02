import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'common/splash_screen.dart';
import 'admin/dashboard.dart';
import 'student/dashboard.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart'; // For env variables

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Load environment variables
  await dotenv.load(fileName: ".env");

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // No login check — just go to DashboardPage directly
  Future<Widget> _getInitialScreen() async {
    return const DashboardPage(); // We'll define this below with navigation buttons
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

class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Career Nest - Select Role'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton.icon(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const DashboardPage()),
                );
              },
              icon: const Icon(Icons.school),
              label: const Text('Go to Student Dashboard'),
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) =>  AdminDashboardPage()),
                );
              },
              icon: const Icon(Icons.admin_panel_settings),
              label: const Text('Go to Admin Dashboard'),
            ),
          ],
        ),
      ),
    );
  }
}
