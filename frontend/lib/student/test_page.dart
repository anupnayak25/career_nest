import 'package:flutter/material.dart';
import './programing/programming_list.dart';
import './quiz_pages/quiz_list.dart';
import 'package:career_nest/student/hr/hr_list.dart';
import 'package:career_nest/student/techinical/technical_list.dart';
import 'package:permission_handler/permission_handler.dart';

class TestsPage extends StatelessWidget {
  const TestsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tests',
            style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.white)),
        backgroundColor: Colors.blue,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: [
            const Text('Choose your Test',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            // Build cards for different test categories, navigating to their respective screens on tap.
            _buildTestCard(context, 'QUIZ', const QuizListPage()),
            _buildTestCard(context, 'Programming', const ProgramingListPage()),
            _buildTestCard(context, 'HR', const HRListPage()),
            _buildTestCard(context, 'Technical', const TechnicalListPage()),
          ],
        ),
      ),
    );
  }

  // Helper function to build a reusable test category card.
  Widget _buildTestCard(BuildContext context, String title, Widget page) {
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      elevation: 3,
      child: ListTile(
        title: Text(title, style: const TextStyle(fontSize: 18)),
        leading: const Icon(Icons.assignment, color: Colors.blue),
        trailing: const Icon(Icons.arrow_forward_ios),
        // Navigate to the specified page when the card is tapped.
        onTap: () async {
          bool granted = await checkPermissions();
          if (granted) {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => page),
            );
          } else {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                  content:
                      Text('Camera and Microphone permissions are required.')),
            );
          }
        },
      ),
    );
  }
  Future<bool> checkPermissions() async {
    if (await Permission.camera.isGranted &&
        await Permission.microphone.isGranted) {
      return true;
    } else {
      return requestCameraAndMicPermissions();
    }
  }

  Future<bool> requestCameraAndMicPermissions() async {
    final statuses = await [
      Permission.camera,
      Permission.microphone,
    ].request();

    return statuses.values.every((status) => status.isGranted);
  }
}