import 'package:career_nest/student/common_page/service.dart';
import 'package:career_nest/student/hr/hr_attempt.dart';
import 'package:career_nest/student/hr/hr_model.dart';
import 'package:career_nest/student/hr/hr_result.dart';
import 'package:flutter/material.dart';
import 'hr_service.dart';

class HRListPage extends StatelessWidget {
  const HRListPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Combine both futures
    final combinedFuture = Future.wait([
      ApiService.fetchAttempted("hr"),  // ✅ Adjusted from "quiz" to "hr" if needed
      HrService.fetchHrList(),
    ]);

    return Scaffold(
      appBar: AppBar(title: const Text("HR")),
      body: FutureBuilder<List<dynamic>>(
        future: combinedFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error}"));
          }

          final attemptedList = snapshot.data![0] as List<int>;
          final hrList = snapshot.data![1] as List<HrModel>;

          return ListView.builder(
            padding: const EdgeInsets.all(12),
            itemCount: hrList.length,
            itemBuilder: (context, index) {
              final hR = hrList[index];
              final isDone = attemptedList.contains(int.parse(hR.id));

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
                      Text(hR.title,
                          style: const TextStyle(
                              fontSize: 18, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text("Upload: ${hR.uploadDate}"),
                              Text("Marks: ${hR.totalMarks}"),
                            ],
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text("Due: ${hR.dueDate}"),
                              Text("Status: ${isDone ? "Done" : "Pending"}"),
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
                                              HRAnswerPage(
                                        questions: hR.questions,
                                        HRQId: int.parse(hR.id.toString()),
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
                                    onPressed: (hR.displayResult == true)
                                        ? () {
                                            Navigator.of(context).push(
                                              MaterialPageRoute(
                                                builder: (context) =>
                                                   HrResultPage(hrList: hR),
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
        },
      ),
    );
  }
}
