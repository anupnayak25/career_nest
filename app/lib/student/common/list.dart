import 'package:flutter/material.dart';
import 'package:career_nest/common/theme.dart';
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

  DateTime? _parseDateLoose(String raw) {
    if (raw.isEmpty) return null;
    // Try full parse first
    // Normalize common MySQL "YYYY-MM-DD HH:MM:SS" format to ISO by inserting 'T'
    final normalized = (raw.contains(' ') && !raw.contains('T'))
        ? raw.replaceFirst(' ', 'T')
        : raw;
    final direct = DateTime.tryParse(normalized);
    if (direct != null) return direct;
    // Fallback: parse just the date part if present
    if (raw.length >= 10) {
      final dateOnly = raw.substring(0, 10);
      final date = DateTime.tryParse(dateOnly);
      if (date != null) {
        // Consider due at end of day if time not provided
        return DateTime(date.year, date.month, date.day, 23, 59, 59);
      }
    }
    return null;
  }

  bool _isOverdue(String dueRaw) {
    final dueAt = _parseDateLoose(dueRaw);
    if (dueAt == null) return false; // if unknown, don't block attempts
    return DateTime.now().isAfter(dueAt);
  }

  @override
  void initState() {
    super.initState();
    assignmentsFuture =
        AssignmentService.fetchList<T>(widget.type, widget.fromJson);
    attemptedFuture = AssignmentService.fetchAttempted(widget.type);
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
                          size: 64, color: AppColors.textSecondary),
                      const SizedBox(height: 16),
                      Text(
                        'No assignments available',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textSecondary,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Check back later or contact your instructor.',
                        style: TextStyle(
                          fontSize: 16,
                          color: AppColors.textSecondary,
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
                  final displayResult =
                      (assignment as dynamic).displayResult == true ||
                          (assignment as dynamic).displayResult == 1;
                  final dueRaw = widget.getDueDate(assignment);
                  final overdue = !isDone && _isOverdue(dueRaw);
                  return Card(
                    margin: const EdgeInsets.symmetric(vertical: 10),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                      side: BorderSide(color: AppColors.primary, width: 2),
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
                              // Container(
                              //   padding: const EdgeInsets.symmetric(
                              //       horizontal: 12, vertical: 6),
                              //   decoration: BoxDecoration(
                              //     color: isDone
                              //         ? Colors.red[100]
                              //         : Colors.blue[100],
                              //     borderRadius: BorderRadius.circular(20),
                              //   ),
                              //   child: Text(
                              //     isDone
                              //         ? 'Done'
                              //         : 'Take ${widget.type[0].toUpperCase()}${widget.type.substring(1)}',
                              //     style: TextStyle(
                              //       color: isDone ? Colors.red : Colors.blue,
                              //       fontWeight: FontWeight.bold,
                              //     ),
                              //   ),
                              // ),
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
                                            : (overdue
                                                ? 'Not Attempted (Overdue)'
                                                : 'Not Attempted')),
                                    style: TextStyle(
                                        color: isDone
                                            ? AppColors.secondary
                                            : (overdue
                                                ? Colors.red
                                                : AppColors.secondary),
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
                                    onPressed: overdue
                                        ? null
                                        : () async {
                                            final result = await Navigator.push(
                                              context,
                                              MaterialPageRoute(
                                                builder: (_) => AttemptPage<Q>(
                                                  title: widget
                                                      .getTitle(assignment),
                                                  questions: questions,
                                                  questionBuilder:
                                                      widget.questionBuilder,
                                                  onSubmit: (answers) async {
                                                    return AssignmentService
                                                        .submitAnswers(
                                                      type: widget.type,
                                                      assignmentId: widget
                                                          .getId(assignment),
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
                                      backgroundColor: overdue
                                          ? Colors.grey
                                          : AppColors.primary,
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
                                    child: const Text('Attempt'),
                                  )
                                : ElevatedButton(
                                    onPressed: displayResult
                                        ? () async {
                                            final results =
                                                await AssignmentService
                                                    .fetchResults(
                                              type: widget.type,
                                              id: widget.getId(assignment),
                                            );
                                            int obtainedMarks = 0;
                                            num totalMarks = 0;
                                            for (final question in questions) {
                                              final dynamic q = question;
                                              if (q.marks != null) {
                                                final m = q.marks;
                                                if (m is int) {
                                                  totalMarks += m;
                                                } else if (m is num) {
                                                  totalMarks += m.toInt();
                                                }
                                              }
                                              final match = results.firstWhere(
                                                (ans) =>
                                                    ans['qno'] ==
                                                    (((question as dynamic)
                                                            .qno) ??
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
                                                ? (obtainedMarks / totalMarks) *
                                                    100
                                                : 0.0;
                                            Navigator.push(
                                              context,
                                              MaterialPageRoute(
                                                builder: (_) => ResultPage<Q>(
                                                  title: widget
                                                      .getTitle(assignment),
                                                  questions: questions,
                                                  results: results,
                                                  questionResultBuilder: widget
                                                      .questionResultBuilder,
                                                  obtainedMarks: obtainedMarks,
                                                  totalMarks:
                                                      totalMarks.toInt(),
                                                  percentage: percentage,
                                                ),
                                              ),
                                            );
                                          }
                                        : null,
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: displayResult
                                          ? AppColors.secondary
                                          : Colors.grey,
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
