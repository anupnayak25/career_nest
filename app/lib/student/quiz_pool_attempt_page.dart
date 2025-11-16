import 'dart:convert';

import 'package:career_nest/common/theme.dart';
import 'package:career_nest/student/common/attempt.dart';
import 'package:career_nest/student/common/service.dart';
import 'package:career_nest/student/models/quiz_model.dart';
import 'package:flutter/material.dart';

class QuizPoolAttemptPage extends StatefulWidget {
  const QuizPoolAttemptPage({super.key});

  @override
  State<QuizPoolAttemptPage> createState() => _QuizPoolAttemptPageState();
}

class _QuizPoolAttemptPageState extends State<QuizPoolAttemptPage> {
  final TextEditingController _countController =
      TextEditingController(text: '10');
  bool _loading = false;
  List<QuizQuestion> _questions = [];
  int _totalMarks = 0;

  Future<void> _loadQuestions({bool showPromptOnError = true}) async {
    final count = int.tryParse(_countController.text.trim());
    if (count == null || count <= 0) {
      if (showPromptOnError && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
              content: Text('Please enter a valid number of questions.')),
        );
      }
      return;
    }

    // For now, pick the most recent quiz id from backend list, or 0 if none.
    // You can change this to a specific quiz id if required.
    setState(() => _loading = true);
    try {
      // Fetch available quizzes to pick one expired quiz id
      final quizzes = await AssignmentService.fetchList<QuizList>(
        'quiz',
        (json) => QuizList.fromJson(json),
      );

      // Filter to quizzes whose due date has passed on client side as a fallback
      final now = DateTime.now();
      final expiredQuizzes = quizzes.where((q) {
        try {
          final parsedDue = DateTime.parse(q.dueDate);
          return parsedDue.isBefore(now);
        } catch (_) {
          return false;
        }
      }).toList();

      if (expiredQuizzes.isEmpty) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('No expired quizzes available yet.')),
          );
        }
        setState(() => _loading = false);
        return;
      }

      // Choose the last expired quiz (you can randomize if needed)
      final selectedQuiz = expiredQuizzes.last;

      final rawQuestions = await AssignmentService.fetchQuizPool(
        quizId: selectedQuiz.id,
        limit: count,
      );

      final questions = rawQuestions.map((json) {
        // Normalise options: may be comma string or JSON array string
        final rawOptions = json['options'];
        List<String> options;
        if (rawOptions is String) {
          if (rawOptions.contains('[') && rawOptions.contains(']')) {
            try {
              final decoded = jsonDecode(rawOptions);
              options = List<String>.from(decoded.map((e) => e.toString()));
            } catch (_) {
              options = rawOptions.split(',').map((e) => e.trim()).toList();
            }
          } else {
            options = rawOptions.split(',').map((e) => e.trim()).toList();
          }
        } else if (rawOptions is List) {
          options = rawOptions.map((e) => e.toString()).toList();
        } else {
          options = [];
        }

        return QuizQuestion(
          id: json['id'] as int,
          qno: json['qno'] as int,
          question: json['question'] as String,
          options: options,
          answer: json['correct_answer'] as String,
          marks: json['marks'] as int,
        );
      }).toList();

      final totalMarks = questions.fold<int>(0, (sum, q) => sum + q.marks);

      if (mounted) {
        setState(() {
          _questions = questions;
          _totalMarks = totalMarks;
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load quiz pool: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  void _startAttempt() {
    if (_questions.isEmpty) {
      _loadQuestions();
      return;
    }

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => AttemptPage<QuizQuestion>(
          title: 'Quiz Pool',
          questions: _questions,
          type: 'quiz',
          questionBuilder: (question, idx, answer, onChanged) {
            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: question.options.map((opt) {
                return RadioListTile<String>(
                  title: Text(opt),
                  value: opt,
                  groupValue: answer,
                  onChanged: onChanged,
                );
              }).toList(),
            );
          },
          onSubmit: (answers) async {
            // Local scoring: no persistence for practice pool
            int obtained = 0;
            for (final entry in answers) {
              final idx = entry['id'] as int;
              final selected = entry['answer']?.toString() ?? '';
              if (idx >= 0 && idx < _questions.length) {
                final q = _questions[idx];
                if (selected.trim().toLowerCase() ==
                    q.answer.trim().toLowerCase()) {
                  obtained += q.marks;
                }
              }
            }

            if (mounted) {
              await showDialog(
                context: context,
                builder: (context) => AlertDialog(
                  title: const Text('Quiz Pool Result'),
                  content: Text('You scored $obtained / $_totalMarks'),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(context),
                      child: const Text('Close'),
                    ),
                    TextButton(
                      onPressed: () {
                        Navigator.pop(context); // close dialog
                        // Retry: fetch new questions
                        _loadQuestions(showPromptOnError: false);
                      },
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              );
            }

            // Do not hit backend submit for pool; treat as success to show success screen
            return true;
          },
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Quiz Pool'),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Practice with random questions from expired quizzes.',
              style: theme.textTheme.bodyMedium?.copyWith(
                color: AppColors.primary,
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _countController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Number of questions',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _loading
                    ? null
                    : () async {
                        await _loadQuestions();
                        if (mounted && _questions.isNotEmpty) {
                          _startAttempt();
                        }
                      },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                ),
                child: _loading
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor:
                              AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      )
                    : const Text('Start Practice'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
