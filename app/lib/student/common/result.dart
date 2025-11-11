import 'package:flutter/material.dart';
import 'package:career_nest/common/theme.dart';

class ResultPage<T> extends StatelessWidget {
  final String title;
  final List<T> questions;
  final List<Map<String, dynamic>> results;
  final Widget Function(T, Map<String, dynamic>) questionResultBuilder;
  final int obtainedMarks;
  final int totalMarks;
  final double percentage;

  const ResultPage({
    Key? key,
    required this.title,
    required this.questions,
    required this.results,
    required this.questionResultBuilder,
    required this.obtainedMarks,
    required this.totalMarks,
    required this.percentage,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('$title - Results'),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20.0),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: AppColors.mainGradient,
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(15),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.primary.withOpacity(0.3),
                    blurRadius: 10,
                    offset: const Offset(0, 5),
                  ),
                ],
              ),
              child: Column(
                children: [
                  const Text(
                    'Assignment Completed!',
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
                          'Score', '$obtainedMarks/$totalMarks', Icons.star),
                      _buildScoreItem('Percentage',
                          '${percentage.toStringAsFixed(1)}%', Icons.percent),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'Questions Review:',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
            const SizedBox(height: 16),
            ...questions.asMap().entries.map((entry) {
              final idx = entry.key;
              final question = entry.value;
              final result =
                  results.length > idx ? results[idx] : <String, dynamic>{};
              return questionResultBuilder(question, result);
            }),
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
          label,
          style:
              const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        Text(
          value,
          style: const TextStyle(color: Colors.white, fontSize: 16),
        ),
      ],
    );
  }
}
