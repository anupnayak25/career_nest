import 'package:flutter/material.dart';
import 'quiz_model.dart';
//import 'quiz_result.dart';


class QuizDetailPage extends StatelessWidget {
  final Quiz quiz;
  const QuizDetailPage({super.key, required this.quiz});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(quiz.title)),
      body: Column(
        children: [
          Text(quiz.description),
          ElevatedButton(
            child: Text('Submit'),
            onPressed: () {
              // Navigator.push(
              //   context,
              //   MaterialPageRoute(builder: (_) => const ResultPage()),
              // );
            },
          ),
        ],
      ),
    );
  }
}

