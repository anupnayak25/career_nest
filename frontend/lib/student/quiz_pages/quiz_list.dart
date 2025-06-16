import 'package:flutter/material.dart';
import 'quiz_service.dart';
import 'quiz_model.dart';
import 'quiz_attempt.dart'; // Assuming QuizDetailPage is here

class QuizListPage extends StatefulWidget {
  const QuizListPage({Key? key}) : super(key: key);

  @override
  State<QuizListPage> createState() => _QuizListPageState();
}

class _QuizListPageState extends State<QuizListPage> {
  late Future<List<QuizList>> quizzesFuture;
  late Future<List<int>> attemptedFuture;

  @override
  void initState() {
    super.initState();
    quizzesFuture = ApiService.fetchQuizList();
    attemptedFuture = ApiService.fetchAttempted();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Quiz")),
      body: FutureBuilder<List<int>>(
        future: attemptedFuture,
        builder: (context, attemptedSnapshot) {
          if (attemptedSnapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (attemptedSnapshot.hasError) {
            return Center(child: Text("Error: ${attemptedSnapshot.error}"));
          }

          final attemptedQuizzes = attemptedSnapshot.data ?? [];

          return FutureBuilder<List<QuizList>>(
            future: quizzesFuture,
            builder: (context, quizSnapshot) {
              if (quizSnapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              } else if (quizSnapshot.hasError) {
                return Center(child: Text("Error: ${quizSnapshot.error}"));
              }

              final quizzes = quizSnapshot.data ?? [];

              return ListView.builder(
                padding: const EdgeInsets.all(12),
                itemCount: quizzes.length,
                itemBuilder: (context, index) {
                  final quiz = quizzes[index];
                  final isDone = attemptedQuizzes.contains(quiz.id);

                  return Card(
                    margin: const EdgeInsets.symmetric(vertical: 10),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                      side: const BorderSide(color: Colors.blue, width: 2),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            quiz.title,
                            style: const TextStyle(
                                fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 8),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text("Upload: ${quiz.uploadDate}"),
                                  Text("Marks: ${quiz.totalMarks}"),
                                ],
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text("Due: ${quiz.dueDate}"),
                                  Text("Status: ${isDone ? 'Attempted' : 'Not Attempted'}"),
                                ],
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: () {
                                if (!isDone) {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (_) => QuizDetailPage(quiz: quiz),
                                    ),
                                  );
                                } else {
                                  // Navigate to result or do nothing
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(content: Text("You have already attempted this quiz.")),
                                  );
                                }
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor:
                                    isDone ? Colors.red : Colors.blue.shade700,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(30),
                                ),
                              ),
                              child: Text(
                                isDone ? 'Result' : 'Attempt Quiz',
                                style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white),
                              ),
                            ),
                          )
                        ],
                      ),
                    ),
                  );
                },
              );
            },
          );
        },
      ),
    );
  }
}
