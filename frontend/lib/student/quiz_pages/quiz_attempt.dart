import './quiz_service.dart';
import 'package:flutter/material.dart';
import 'quiz_model.dart';
import '../common_page/success_screen.dart'; // Adjust the path based on your project structure

class QuizDetailPage extends StatefulWidget {
  final QuizList quiz;
  const QuizDetailPage({super.key, required this.quiz});

  @override
  State<QuizDetailPage> createState() => _QuizDetailPageState();
}

class _QuizDetailPageState extends State<QuizDetailPage> {
  // Stores selected answers: question number => selected option
  Map<int, String> selectedAnswers = {};

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.quiz.title)),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.quiz.description,
              style: const TextStyle(fontSize: 16.0),
            ),
            const SizedBox(height: 16.0),
            const Text(
              'Questions:',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8.0),

            // Display each question
            ...widget.quiz.questions.map((question) {
              return Container(
                margin: const EdgeInsets.symmetric(vertical: 10.0),
                padding: const EdgeInsets.all(16.0),
                decoration: BoxDecoration(
                  color: const Color(0xFFF1EDF8),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${question.qno}) ${question.question}',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.blue,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        children: question.options.map<Widget>((option) {
                          return RadioListTile<String>(
                            value: option,
                            groupValue: selectedAnswers[question.qno],
                            onChanged: (value) {
                              setState(() {
                                selectedAnswers[question.qno] = value!;
                              });
                            },
                            title: Text(
                              option,
                              style: const TextStyle(color: Colors.white),
                            ),
                            activeColor: Colors.white,
                            controlAffinity: ListTileControlAffinity.leading,
                          );
                        }).toList(),
                      ),
                    ),
                  ],
                ),
              );
            }),

            const SizedBox(height: 16.0),
            Center(
              child: ElevatedButton(
                child: const Text('Submit'),
                onPressed: () async {
                  if (selectedAnswers.length != widget.quiz.questions.length) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                          content: Text('Please answer all questions.')),
                    );
                    return;
                  }

                  final answerList = widget.quiz.questions.map((question) {
                    final selected = selectedAnswers[question.qno];
                    final isCorrect = selected == question.answer;

                    return {
                      "qno": question.qno,
                      "selected_ans": selected,
                      "is_correct": isCorrect,
                      "marks_awarded": isCorrect ? question.marks : 0,
                    };
                  }).toList();

                  final success = await QuizApiService.submitQuizAnswers(
                    quizId: widget.quiz.id,
                    answers: answerList,
                  );

                  if (success) {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (_) => const SuccessScreen()),
                    );
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                          content: Text('Failed to submit answers.')),
                    );
                  }
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
