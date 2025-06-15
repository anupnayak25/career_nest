import 'package:flutter/material.dart';
import 'quiz_service.dart';
import 'quiz_model.dart';
import 'quiz_attempt.dart';

class QuizListPage extends StatelessWidget {
  const QuizListPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Quiz")),
      body: FutureBuilder<List<Quiz>>(
        future: ApiService.fetchQuizzes(),
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            return ListView.builder(
              padding: const EdgeInsets.all(12),
              itemCount: snapshot.data!.length,
              itemBuilder: (context, index) {
                final quiz = snapshot.data![index];
                final isDone = quiz.status == 'Done';

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
                        Text(quiz.title,
                            style: const TextStyle(
                                fontSize: 18, fontWeight: FontWeight.bold)),
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
                                Text("Status: ${quiz.status}"),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: () async {
                              if (!isDone) {
                                final questions =
                                    await ApiService.fetchQuestionsForQuiz(
                                        quiz.id);
                                if (questions.isNotEmpty) {
                                  final fullQuiz = Quiz(
                                    id: quiz.id,
                                    title: quiz.title,
                                    description: quiz.description,
                                    uploadDate: quiz.uploadDate,
                                    dueDate: quiz.dueDate,
                                    userId: quiz.userId,
                                    displayResult: quiz.displayResult,
                                    status: quiz.status,
                                    totalMarks: quiz.totalMarks,
                                    questions: questions,
                                  );

                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (_) =>
                                          QuizDetailPage(quiz: fullQuiz),
                                    ),
                                  );
                                } else {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                        content: Text(
                                            'Failed to load quiz questions')),
                                  );
                                }
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
                              quiz.status == "Pending"
                                  ? 'Attempt Quiz'
                                  : 'Result',
                              style:
                                  const TextStyle(fontWeight: FontWeight.bold),
                            ),
                          ),
                        )
                      ],
                    ),
                  ),
                );
              },
            );
          } else if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error}"));
          } else {
            return const Center(child: CircularProgressIndicator());
          }
        },
      ),
    );
  }
}
