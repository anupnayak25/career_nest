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

              if (assignments.isEmpty) {
                return Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.inbox,
                          size: 64, color: Colors.blueGrey.shade200),
                      const SizedBox(height: 16),
                      Text(
                        'No assignments available',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: Colors.blueGrey.shade400,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Check back later or contact your instructor.',
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.blueGrey.shade300,
                        ),
                      ),
                    ],
                  ),
                );
              }

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
                    elevation: 4,
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Text(
                                  widget.getTitle(assignment),
                                  style: const TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.black,
                                  ),
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 12, vertical: 6),
                                decoration: BoxDecoration(
                                  color: isDone
                                      ? Colors.red[100]
                                      : Colors.blue[100],
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: Text(
                                  isDone
                                      ? 'Done'
                                      : 'Take ${widget.type[0].toUpperCase()}${widget.type.substring(1)}',
                                  style: TextStyle(
                                    color: isDone ? Colors.red : Colors.blue,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Upload: ' +
                                        (widget
                                                    .getUploadDate(assignment)
                                                    .length >=
                                                10
                                            ? widget
                                                .getUploadDate(assignment)
                                                .substring(0, 10)
                                            : widget.getUploadDate(assignment)),
                                    style: TextStyle(
                                        color: Colors.grey[700], fontSize: 13),
                                  ),
                                  Text(
                                    'Marks: ' +
                                        widget
                                            .getTotalMarks(assignment)
                                            .toString(),
                                    style: TextStyle(
                                        color: Colors.grey[700], fontSize: 13),
                                  ),
                                ],
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text(
                                    'Due: ' +
                                        (widget.getDueDate(assignment).length >=
                                                10
                                            ? widget
                                                .getDueDate(assignment)
                                                .substring(0, 10)
                                            : widget.getDueDate(assignment)),
                                    style: TextStyle(
                                        color: Colors.grey[700], fontSize: 13),
                                  ),
                                  Text(
                                    'Status: ' +
                                        (isDone
                                            ? 'Attempted'
                                            : 'Not Attempted'),
                                    style: TextStyle(
                                        color: isDone
                                            ? Colors.green
                                            : Colors.orange,
                                        fontWeight: FontWeight.w600,
                                        fontSize: 13),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
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
                                            type: widget.type,
                                          ),
                                        ),
                                      );
                                      if (result == true) setState(() {});
                                    },
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor:
                                          isDone ? Colors.red : Colors.blue,
                                      foregroundColor: Colors.white,
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(30),
                                      ),
                                      padding: const EdgeInsets.symmetric(
                                          vertical: 14),
                                      textStyle: const TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold),
                                    ),
                                    child: Text(isDone ? 'Done' : 'Attempt'),
                                  )
                                : ElevatedButton(
                                    onPressed: () async {
                                      final results =
                                          await AssignmentService.fetchResults(
                                        type: widget.type,
                                        id: widget.getId(assignment),
                                      );
                                      int obtainedMarks = 0;
                                      num totalMarks = 0;
                                      for (final question in questions) {
                                        if (question is dynamic &&
                                            question.marks != null) {
                                          totalMarks += question.marks is int
                                              ? question.marks
                                              : (question.marks as num).toInt();
                                        }
                                        final match = results.firstWhere(
                                          (ans) =>
                                              ans['qno'] ==
                                              (((question as dynamic).qno) ??
                                                  0),
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
                                            obtainedMarks: obtainedMarks is int
                                                ? obtainedMarks
                                                : (obtainedMarks as num)
                                                    .toInt(),
                                            totalMarks: totalMarks is int
                                                ? totalMarks
                                                : (totalMarks as num).toInt(),
                                            percentage: percentage,
                                          ),
                                        ),
                                      );
                                    },
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.red,
                                      foregroundColor: Colors.white,
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(30),
                                      ),
                                      padding: const EdgeInsets.symmetric(
                                          vertical: 14),
                                      textStyle: const TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold),
                                    ),
                                    child: const Text('Display Result'),
                                  ),
                          ),
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
