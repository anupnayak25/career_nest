import 'package:career_nest/student/programing/programming_service.dart';
import 'package:flutter/material.dart';
import 'programming_model.dart'; // Contains ProgrammingQuestion
import '../common_page/success_screen.dart'; // Adjust the path
import '../hr/hr_service.dart'; // Assuming this has submitHRAnswers

class AnswerPage extends StatefulWidget {
  final List<ProgrammingQuestion> programming;
  final int QID;

  const AnswerPage({
    super.key,
    required this.programming,
    required this.QID,
  });

  @override
  State<AnswerPage> createState() => _AnswerPageState();
}

class _AnswerPageState extends State<AnswerPage> {
  final Map<int, TextEditingController> _controllers = {};
  bool isSubmitting = false;

  @override
  void initState() {
    super.initState();
    for (var q in widget.programming) {
      _controllers[q.qno] = TextEditingController(
        text: q.programSnippet ?? '//write your code here',
      );
    }
  }

  @override
  void dispose() {
    for (var controller in _controllers.values) {
      controller.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Programming"),
        centerTitle: true,
        elevation: 0,
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
        child: Column(
          children: [
            Align(
              alignment: Alignment.topRight,
              child: Text(
                "Total Questions: ${widget.programming.length}",
                style: const TextStyle(fontWeight: FontWeight.w500),
              ),
            ),
            const SizedBox(height: 10),
            ...widget.programming.map((q) => _buildQuestionCard(q)).toList(),
            const SizedBox(height: 20),
            Center(
              child: ElevatedButton(
                onPressed: isSubmitting ? null : _handleSubmit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  padding: const EdgeInsets.symmetric(
                      horizontal: 50, vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                ),
                child: isSubmitting
                    ? const CircularProgressIndicator(
                        color: Colors.white,
                        strokeWidth: 2,
                      )
                    : const Text(
                        'Submit',
                        style: TextStyle(fontSize: 16, color: Colors.white),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _handleSubmit() async {
    final answers = _controllers.entries
        .where((entry) => entry.value.text.trim().isNotEmpty)
        .map((entry) => {
              'qno': entry.key,
              'answer': entry.value.text.trim(),
            })
        .toList();

    if (answers.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please write at least one answer')),
      );
      return;
    }

    setState(() => isSubmitting = true);

    final success = await ProgrammingApiService.submitProgramingAnswers(
      programmingId: widget.QID,
      answers: answers,
    );

    setState(() => isSubmitting = false);

    if (success) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const SuccessScreen()),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to submit answers')),
      );
    }
  }

  Widget _buildQuestionCard(ProgrammingQuestion q) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16.0),
      decoration: BoxDecoration(
        color: Colors.blue,
        borderRadius: BorderRadius.circular(20),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Question row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  '${q.qno}) ${q.question}',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Text(
                '${q.marks} marks',
                style: const TextStyle(
                  color: Colors.white70,
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),

          // Answer text field
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
            ),
            width: double.infinity,
            child: ConstrainedBox(
              constraints: const BoxConstraints(minHeight: 100),
              child: TextField(
                controller: _controllers[q.qno],
                maxLines: null,
                keyboardType: TextInputType.multiline,
                style:
                    const TextStyle(fontFamily: 'monospace', fontSize: 14),
                decoration: const InputDecoration.collapsed(
                  hintText: 'Write your code here...',
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
