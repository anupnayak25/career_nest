import 'package:career_nest/student/common_page/service.dart';
import 'package:flutter/material.dart';
import 'technical_model.dart';
import 'technical_service.dart';
import 'technical_attempt.dart'; // Create or reuse AnswerPage for technical

class TechnicalListPage extends StatelessWidget {
  const TechnicalListPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
       final combinedFuture = Future.wait([
      ApiService.fetchAttempted("technical"),
      TechnicalService.fetchTechnicalList()]);
    return Scaffold(
      appBar: AppBar(title: const Text("Technical Assignments")),
      body: FutureBuilder<List<dynamic>>(
        future: combinedFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error}"));
          }

          final attemptedList = snapshot.data![0] as List<int>;
          final technicalList = snapshot.data![1] as List<TechnicalItem>;
            return ListView.builder(
              padding: const EdgeInsets.all(12),
              itemCount: snapshot.data!.length,
              itemBuilder: (context, index) {
                final technical = technicalList[index];
                final isDone = attemptedList.contains(technical.id); // TODO: Replace with actual status logic

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
                          technical.title,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(technical.description),
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text("Upload: ${technical.uploadDate}"),
                                Text("Questions: ${technical.questions.length}"),
                              ],
                            ),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                Text("Due: ${technical.dueDate}"),
                                Text("Status: Pending"),
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
                                    builder: (_) => TechnicalAnswerPage(
                                        questions: technical.questions,QID: int.parse(technical.id.toString())),
                                  ),
                                );
                              }
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: isDone
                                  ? Colors.red
                                  : Colors.blue.shade700,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(30),
                              ),
                            ),
                            child: const Text(
                              'Attempt',
                              style: TextStyle(fontWeight: FontWeight.bold,color: Colors.white),
                            ),
                          ),
                        )
                      ],
                    ),
                  ),
                );
              },
            );
          }
      ),
    );
  }
}

