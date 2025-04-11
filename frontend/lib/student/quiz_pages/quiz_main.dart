import 'package:flutter/material.dart';
import 'quiz_model.dart';
import 'quiz_detail.dart';
import 'quiz_result.dart';
import 'quiz_service.dart';
import 'package:career_nest/student/dashboard.dart';
import 'package:career_nest/main.dart';






void main() {
  runApp(QuizApp());
}

class QuizApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: QuizListPage(),
    );
  }
}

class QuizListPage extends StatelessWidget {
  final List<Map<String, dynamic>> quizzes = [
    {'title': 'Title of the quiz', 'status': 'Take Quiz'},
    {'title': 'Title of the quiz', 'status': 'Take Quiz'},
    {'title': 'Title of the quiz', 'status': 'Take Quiz'},
    {'title': 'Title of the quiz', 'status': 'Done'},
    {'title': 'Title of the quiz', 'status': 'Done'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        leading: Icon(Icons.arrow_back, color: Colors.black),
        title: Text(
          'Quiz',
          style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        backgroundColor: Colors.white,
        elevation: 0,
      ),
      body: ListView.builder(
        padding: EdgeInsets.all(12),
        itemCount: quizzes.length,
        itemBuilder: (context, index) {
          final quiz = quizzes[index];
          final isDone = quiz['status'] == 'Done';

          return Card(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
              side: BorderSide(color: Colors.blue, width: 2),
            ),
            margin: EdgeInsets.symmetric(vertical: 10),
            elevation: 5,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    quiz['title'],
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Upload date'),
                          Text('Total marks'),
                        ],
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text('Due date'),
                          Text('Status'),
                        ],
                      ),
                    ],
                  ),
                  SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {
                        // if (!isDone) {
                        //   Navigator.push(
                        //     context,
                        //     MaterialPageRoute(builder: (_) => QuizDetailPage(quiz: Quiz.fromMap(quiz))),
                        //   );
                        // }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor:
                            isDone ? Colors.red : Colors.blue.shade700,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                      ),
                      child: Text(
                        quiz['status'],
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
