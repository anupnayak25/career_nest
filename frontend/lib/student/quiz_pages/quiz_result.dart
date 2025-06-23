// quiz_result_page.dart
import 'package:flutter/material.dart';
import 'quiz_model.dart';

class QuizResultPage extends StatelessWidget {
  final QuizList quiz;
 // final QuizResultSummary resultSummary;

  const QuizResultPage({
    super.key,
    required this.quiz,
  //  required this.resultSummary,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${quiz.title} - Results'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Score Summary Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20.0),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.blue.shade400, Colors.blue.shade600],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(15),
                boxShadow: [
                  BoxShadow(
                   // color: Colors.blue.withValues(opacity: 0.2),
                    blurRadius: 10,
                    offset: const Offset(0, 5),
                  ),
                ],
              ),
              child: Column(
                children: [
                  const Text(
                    'Quiz Completed!',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      _buildScoreItem(
                        'Score',
                        '${resultSummary.obtainedMarks}/${resultSummary.totalMarks}',
                        Icons.star,
                      ),
                      _buildScoreItem(
                        'Percentage',
                        '${resultSummary.percentage.toStringAsFixed(1)}%',
                        Icons.percent,
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      _buildScoreItem(
                        'Correct',
                        '${resultSummary.correctAnswers}',
                        Icons.check_circle,
                      ),
                      _buildScoreItem(
                        'Wrong',
                        '${resultSummary.wrongAnswers}',
                        Icons.cancel,
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Performance Badge
            Center(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                decoration: BoxDecoration(
                  color: _getPerformanceColor(resultSummary.percentage),
                  borderRadius: BorderRadius.circular(25),
                ),
                child: Text(
                  _getPerformanceText(resultSummary.percentage),
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Questions Review Header
            const Text(
              'Questions Review:',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
            const SizedBox(height: 16),

            // Questions List
            ...quiz.questions.map((question) {
              final result = resultSummary.results.firstWhere(
                (r) => r.qno == question.qno,
              );
              
              return Container(
                margin: const EdgeInsets.only(bottom: 16.0),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withOpacity(0.1),
                      blurRadius: 5,
                      offset: const Offset(0, 2),
                    ),
                  ],
                  border: Border.all(
                    color: result.isCorrect ? Colors.green : Colors.red,
                    width: 2,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Question Header
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16.0),
                      decoration: BoxDecoration(
                        color: result.isCorrect 
                            ? Colors.green.withOpacity(0.1)
                            : Colors.red.withOpacity(0.1),
                        borderRadius: const BorderRadius.only(
                          topLeft: Radius.circular(10),
                          topRight: Radius.circular(10),
                        ),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            result.isCorrect ? Icons.check_circle : Icons.cancel,
                            color: result.isCorrect ? Colors.green : Colors.red,
                            size: 24,
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              'Q${question.qno}. ${question.question}',
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: result.isCorrect ? Colors.green : Colors.red,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              '${result.marksAwarded}/${question.marks}',
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Answer Options
                    Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          ...question.options.map((option) {
                            final isCorrectAnswer = option == question.answer;
                            final isSelectedAnswer = option == result.selectedAns;
                            
                            Color backgroundColor = Colors.transparent;
                            Color textColor = Colors.black87;
                            IconData? icon;
                            
                            if (isCorrectAnswer) {
                              backgroundColor = Colors.green.withOpacity(0.1);
                              textColor = Colors.green.shade700;
                              icon = Icons.check_circle;
                            } else if (isSelectedAnswer && !isCorrectAnswer) {
                              backgroundColor = Colors.red.withOpacity(0.1);
                              textColor = Colors.red.shade700;
                              icon = Icons.cancel;
                            }
                            
                            return Container(
                              margin: const EdgeInsets.only(bottom: 8),
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: backgroundColor,
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(
                                  color: isCorrectAnswer 
                                      ? Colors.green 
                                      : (isSelectedAnswer && !isCorrectAnswer)
                                          ? Colors.red
                                          : Colors.grey.shade300,
                                  width: isCorrectAnswer || (isSelectedAnswer && !isCorrectAnswer) ? 1.5 : 1,
                                ),
                              ),
                              child: Row(
                                children: [
                                  if (icon != null) ...[
                                    Icon(
                                      icon,
                                      color: isCorrectAnswer ? Colors.green : Colors.red,
                                      size: 20,
                                    ),
                                    const SizedBox(width: 8),
                                  ],
                                  Expanded(
                                    child: Text(
                                      option,
                                      style: TextStyle(
                                        color: textColor,
                                        fontWeight: (isCorrectAnswer || isSelectedAnswer) 
                                            ? FontWeight.w600 
                                            : FontWeight.normal,
                                      ),
                                    ),
                                  ),
                                  if (isCorrectAnswer && !isSelectedAnswer)
                                    const Text(
                                      'Correct Answer',
                                      style: TextStyle(
                                        color: Colors.green,
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  if (isSelectedAnswer && !isCorrectAnswer)
                                    const Text(
                                      'Your Answer',
                                      style: TextStyle(
                                        color: Colors.red,
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                ],
                              ),
                            );
                          }).toList(),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            }).toList(),

            const SizedBox(height: 24),

            // Action Buttons
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.of(context).popUntil((route) => route.isFirst);
                    },
                    icon: const Icon(Icons.home),
                    label: const Text('Back to Home'),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      backgroundColor: Colors.grey.shade600,
                      foregroundColor: Colors.white,
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.of(context).pop();
                    },
                    icon: const Icon(Icons.refresh),
                    label: const Text('Retake Quiz'),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      backgroundColor: Colors.blue,
                      foregroundColor: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildScoreItem(String label, String value, IconData icon) {
    return Column(
      children: [
        Icon(icon, color: Colors.white, size: 28),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        Text(
          label,
          style: const TextStyle(
            fontSize: 14,
            color: Colors.white70,
          ),
        ),
      ],
    );
  }

  Color _getPerformanceColor(double percentage) {
    if (percentage >= 80) return Colors.green;
    if (percentage >= 60) return Colors.orange;
    return Colors.red;
  }

  String _getPerformanceText(double percentage) {
    if (percentage >= 80) return 'Excellent!';
    if (percentage >= 60) return 'Good Job!';
    if (percentage >= 40) return 'Fair';
    return 'Needs Improvement';
  }
}