import 'package:career_nest/student/common_page/service.dart';
import 'package:career_nest/student/techinical/technical_result.dart';
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
                          child: !isDone
                                ? ElevatedButton(
                                    onPressed: () {
                                      if (!isDone) {
                                        Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                            builder: (_) =>
                                              TechnicalAnswerPage(
                                                questions: technical.questions,
                                                QID: technical.id,
                                      ),
                                          ),
                                        );
                                      } else {
                                        // Navigate to result or do nothing
                                        ScaffoldMessenger.of(context)
                                            .showSnackBar(
                                          const SnackBar(
                                              content: Text(
                                                  "You have already attempted this quiz.")),
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
                                    child: Text(
                                      isDone ? 'Result' : 'Attempt Quiz',
                                      style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          color: Colors.white),
                                    ),
                                  )
                                : ElevatedButton.icon(
                                    onPressed: (technical.displayResult == true)
                                        ? () {
                                            Navigator.of(context).push(
                                              MaterialPageRoute(
                                                builder: (context) =>
                                                   TechnicalResultPage(technicalList: technical),
                                              ),
                                            );
                                          }
                                        : null, // disables the button if conditions not met
                                    icon: const Icon(Icons.bar_chart),
                                    label: const Text('Display Result'),
                                    style: ElevatedButton.styleFrom(
                                      padding: const EdgeInsets.symmetric(
                                          vertical: 12),
                                      backgroundColor: Colors.blue,
                                      foregroundColor: Colors.white,
                                      disabledBackgroundColor:
                                          Colors.grey.shade400,
                                      disabledForegroundColor: Colors.black38,
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

