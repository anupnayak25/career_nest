import 'package:career_nest/student/common_page/service.dart';
import 'package:career_nest/student/techinical/technical_model.dart';
import 'package:flutter/material.dart';

class TechnicalResultPage extends StatefulWidget {
  final TechnicalItem technicalList;

  const TechnicalResultPage({
    Key? key,
    required this.technicalList,
  }) : super(key: key);

  @override
  State<TechnicalResultPage> createState() => _TechnicalResultPageState();
}

class _TechnicalResultPageState extends State<TechnicalResultPage> {
  late Future<TechnicalResultSummary> resultSummaryFuture;
  List<Map<String, dynamic>> results = [];

  @override
  void initState() {
    super.initState();
    resultSummaryFuture = loadResults();
  }

  Future<TechnicalResultSummary> loadResults() async {
    results = await ApiService.fetchResults(
      id: widget.technicalList.id,
      type: 'technical',
    );

    int totalMarks = 0;
    int obtainedMarks = 0;

    for (final question in widget.technicalList.questions) {
      totalMarks += question.marks;
      final match = results.firstWhere(
        (ans) => ans['qno'] == question.qno,
        orElse: () => <String, dynamic>{},
      );

      final awarded =
          int.tryParse(match['marks_awarded']?.toString() ?? '0') ?? 0;
      obtainedMarks += awarded;
    }

    double percentage =
        totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0.0;

    return TechnicalResultSummary(
      obtainedMarks: obtainedMarks,
      totalMarks: totalMarks,
      percentage: percentage,
    );
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<TechnicalResultSummary>(
      future: resultSummaryFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        } else if (snapshot.hasError) {
          return Scaffold(
            body: Center(child: Text('Error: ${snapshot.error}')),
          );
        }

        final resultSummary = snapshot.data!;
        return _buildResultUI(resultSummary);
      },
    );
  }

  Widget _buildResultUI(TechnicalResultSummary resultSummary) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${widget.technicalList.title} - Results'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Score Summary Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20.0),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.blue.shade400, Colors.blue.shade600],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(15),
                boxShadow: [
                  BoxShadow(
                    blurRadius: 10,
                    offset: const Offset(0, 5),
                  ),
                ],
              ),
              child: Column(
                children: [
                  const Text(
                    'Attempt Completed!',
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
                        'Score',
                        '${resultSummary.obtainedMarks}/${resultSummary.totalMarks}',
                        Icons.star,
                      ),
                      _buildScoreItem(
                        'Percentage',
                        '${resultSummary.percentage.toStringAsFixed(1)}%',
                        Icons.percent,
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Performance Badge
            Center(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                decoration: BoxDecoration(
                  color: _getPerformanceColor(resultSummary.percentage),
                  borderRadius: BorderRadius.circular(25),
                ),
                child: Text(
                  _getPerformanceText(resultSummary.percentage),
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
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

            // Questions List
            ...widget.technicalList.questions.map((question) {
              final res = results.firstWhere(
                (r) => r['qno'] == question.qno,
                orElse: () => <String, dynamic>{},
              );

              final marksAwarded = res['marks_awarded']?.toString() ?? '0';

              return Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(10),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withOpacity(0.1),
                      blurRadius: 4,
                      offset: const Offset(0, 2),
                    ),
                  ],
                  border: Border.all(color: Colors.blueAccent),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Q${question.qno}. ${question.question}',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Marks Awarded: $marksAwarded / ${question.marks}',
                      style: const TextStyle(
                        fontSize: 14,
                        color: Colors.black87,
                      ),
                    ),
                  ],
                ),
              );
            }).toList(),

            const SizedBox(height: 24),

            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.of(context).popUntil((route) => route.isFirst);
                    },
                    icon: const Icon(Icons.home),
                    label: const Text('Back to Home'),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      backgroundColor: Colors.grey.shade600,
                      foregroundColor: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
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
          value,
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        Text(
          label,
          style: const TextStyle(
            fontSize: 14,
            color: Colors.white70,
          ),
        ),
      ],
    );
  }

  Color _getPerformanceColor(double percentage) {
    if (percentage >= 80) return Colors.green;
    if (percentage >= 60) return Colors.orange;
    return Colors.red;
  }

  String _getPerformanceText(double percentage) {
    if (percentage >= 80) return 'Excellent!';
    if (percentage >= 60) return 'Good Job!';
    if (percentage >= 40) return 'Fair';
    return 'Needs Improvement';
  }
}
