import 'package:flutter/material.dart';
import 'quiz_model.dart'; // make sure quiz_model.dart is imported

class QuizReviewPage extends StatelessWidget {
  final QuizList quiz;
  final Map<int, String> selectedAnswers;

  const QuizReviewPage({
    Key? key,
    required this.quiz,
    required this.selectedAnswers,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    int correctCount = 0;

    for (var question in quiz.questions) {
      if (selectedAnswers[question.qno] == question.answer) {
        correctCount++;
      }
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Quiz Review'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Text(
                'You scored $correctCount out of ${quiz.questions.length}',
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(height: 24),
            ListView.builder(
              physics: const NeverScrollableScrollPhysics(),
              shrinkWrap: true,
              itemCount: quiz.questions.length,
              itemBuilder: (context, index) {
                final question = quiz.questions[index];
                final selected = selectedAnswers[question.qno];
                final correct = question.answer;
                bool isCorrect = selected == correct;

                return Card(
                  color: isCorrect ? Colors.green[100] : Colors.red[100],
                  margin: const EdgeInsets.symmetric(vertical: 8),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Q${question.qno}: ${question.question}',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: question.options.map((option) {
                            bool isSelected = option == selected;
                            bool isCorrectOption = option == correct;

                            Color? optionColor;
                            if (isSelected && isCorrectOption) {
                              optionColor =
                                  Colors.green[300]; // selected and correct
                            } else if (isSelected && !isCorrectOption) {
                              optionColor =
                                  Colors.red[300]; // selected and wrong
                            } else if (!isSelected && isCorrectOption) {
                              optionColor =
                                  Colors.green[100]; // correct but not selected
                            }

                            return Container(
                              margin: const EdgeInsets.symmetric(vertical: 4),
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: optionColor,
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: Colors.grey),
                              ),
                              child: Text(option),
                            );
                          }).toList(),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
