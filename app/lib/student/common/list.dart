import 'package:flutter/material.dart';
import 'package:career_nest/student/common/attempt.dart';
import 'package:career_nest/student/common/result.dart';
import 'package:career_nest/student/common/service.dart';

class AssignmentListPage<T, Q> extends StatefulWidget {
  final String type;
  final T Function(Map<String, dynamic>) fromJson;
  final String Function(T) getTitle;
  final String Function(T) getUploadDate;
  final String Function(T) getDueDate;
  final int Function(T) getId;
  final int Function(T) getTotalMarks;
  final List<Q> Function(T) getQuestions;
  final Widget Function(Q, int, dynamic, void Function(dynamic))
      questionBuilder;
  final Widget Function(Q, Map<String, dynamic>) questionResultBuilder;
  final String attemptButtonText;

  const AssignmentListPage({
    Key? key,
    required this.type,
    required this.fromJson,
    required this.getTitle,
    required this.getUploadDate,
    required this.getDueDate,
    required this.getId,
    required this.getTotalMarks,
    required this.getQuestions,
    required this.questionBuilder,
    required this.questionResultBuilder,
    required this.attemptButtonText,
  }) : super(key: key);

  @override
  State<AssignmentListPage<T, Q>> createState() =>
      _AssignmentListPageState<T, Q>();
}

class _AssignmentListPageState<T, Q> extends State<AssignmentListPage<T, Q>> {
  late Future<List<T>> assignmentsFuture;
  late Future<List<int>> attemptedFuture;

  @override
  void initState() {
    super.initState();
    assignmentsFuture =
        AssignmentService.fetchList<T>(widget.type, widget.fromJson);
    attemptedFuture =
        Future.value([]); // Replace with your attempted fetch logic if needed
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          title: Text(
              "${widget.type[0].toUpperCase()}${widget.type.substring(1)} Assignments")),
      body: FutureBuilder<List<int>>(
        future: attemptedFuture,
        builder: (context, attemptedSnapshot) {
          if (attemptedSnapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (attemptedSnapshot.hasError) {
            return Center(child: Text("Error: \\${attemptedSnapshot.error}"));
          }

          final attemptedList = attemptedSnapshot.data ?? [];

          return FutureBuilder<List<T>>(
            future: assignmentsFuture,
            builder: (context, assignmentSnapshot) {
              if (assignmentSnapshot.connectionState ==
                  ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              } else if (assignmentSnapshot.hasError) {
                return Center(
                    child: Text("Error: \\${assignmentSnapshot.error}"));
              }

              final assignments = assignmentSnapshot.data ?? [];

              return ListView.builder(
                padding: const EdgeInsets.all(12),
                itemCount: assignments.length,
                itemBuilder: (context, index) {
                  final assignment = assignments[index];
                  final isDone =
                      attemptedList.contains(widget.getId(assignment));
                  final questions = widget.getQuestions(assignment);
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
                            widget.getTitle(assignment),
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
                                  Text("Upload: " +
                                      (widget
                                                  .getUploadDate(assignment)
                                                  .length >=
                                              10
                                          ? widget
                                              .getUploadDate(assignment)
                                              .substring(0, 10)
                                          : widget.getUploadDate(assignment))),
                                  Text("Marks: " +
                                      widget
                                          .getTotalMarks(assignment)
                                          .toString()),
                                ],
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text("Due: " +
                                      (widget.getDueDate(assignment).length >=
                                              10
                                          ? widget
                                              .getDueDate(assignment)
                                              .substring(0, 10)
                                          : widget.getDueDate(assignment))),
                                  Text("Status: " +
                                      (isDone ? 'Attempted' : 'Not Attempted')),
                                ],
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          SizedBox(
                            width: double.infinity,
                            child: !isDone
                                ? ElevatedButton(
                                    onPressed: () async {
                                      final result = await Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (_) => AttemptPage<Q>(
                                            title: widget.getTitle(assignment),
                                            questions: questions,
                                            questionBuilder:
                                                widget.questionBuilder,
                                            onSubmit: (answers) async {
                                              return AssignmentService
                                                  .submitAnswers(
                                                type: widget.type,
                                                assignmentId:
                                                    widget.getId(assignment),
                                                answers: answers,
                                              );
                                            },
                                          ),
                                        ),
                                      );
                                      if (result == true) setState(() {});
                                    },
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.blue.shade700,
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(30),
                                      ),
                                    ),
                                    child: Text(
                                      widget.attemptButtonText,
                                      style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          color: Colors.white),
                                    ),
                                  )
                                : ElevatedButton(
                                    onPressed: () async {
                                      final results =
                                          await AssignmentService.fetchResults(
                                        type: widget.type,
                                        id: widget.getId(assignment),
                                      );
                                      int obtainedMarks = 0;
                                      int totalMarks = 0;
                                      for (final question in questions) {
                                        if (question is dynamic &&
                                            question.marks != null) {
                                          totalMarks += question.marks;
                                        }
                                        final match = results.firstWhere(
                                          (ans) =>
                                              ans['qno'] == (question.qno ?? 0),
                                          orElse: () => {},
                                        );
                                        obtainedMarks += int.tryParse(
                                                match['marks_awarded']
                                                        ?.toString() ??
                                                    '0') ??
                                            0;
                                      }
                                      double percentage = totalMarks > 0
                                          ? (obtainedMarks / totalMarks) * 100
                                          : 0.0;
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (_) => ResultPage<Q>(
                                            title: widget.getTitle(assignment),
                                            questions: questions,
                                            results: results,
                                            questionResultBuilder:
                                                widget.questionResultBuilder,
                                            obtainedMarks: obtainedMarks,
                                            totalMarks: totalMarks,
                                            percentage: percentage,
                                          ),
                                        ),
                                      );
                                    },
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.blue,
                                      foregroundColor: Colors.white,
                                      disabledBackgroundColor:
                                          Colors.grey.shade400,
                                      disabledForegroundColor: Colors.black38,
                                    ),
                                    child: const Text('Display Result'),
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
