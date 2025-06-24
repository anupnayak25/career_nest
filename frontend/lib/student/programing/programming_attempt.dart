import 'package:flutter/material.dart';
import 'programming_model.dart';
import 'programming_service.dart';
import '../common_page/success_screen.dart'; // Reuse if same
import 'package:flutter/services.dart';

class ProgrammingAttemptPage extends StatefulWidget {
  final ProgramingList program;

  const ProgrammingAttemptPage({super.key, required this.program});

  @override
  State<ProgrammingAttemptPage> createState() => _ProgrammingAttemptPageState();
}

class _ProgrammingAttemptPageState extends State<ProgrammingAttemptPage> {
  Map<int, TextEditingController> codeControllers = {};

  @override
  void initState() {
    super.initState();
    for (var q in widget.program.questions) {
      codeControllers[q.qno] = TextEditingController();
    }
  }

  @override
  void dispose() {
    for (var controller in codeControllers.values) {
      controller.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.program.title)),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(widget.program.description, style: const TextStyle(fontSize: 16)),
            const SizedBox(height: 20),
            const Text('Programming Questions:', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),

            const SizedBox(height: 10),

            ...widget.program.questions.map((question) {
              return Container(
                margin: const EdgeInsets.symmetric(vertical: 12),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFFECEFF1),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('${question.qno}) ${question.question}',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    const SizedBox(height: 10),
                    Text("Code Snippet: \n${question.programSnippet}", style: const TextStyle(fontStyle: FontStyle.italic)),
                    const SizedBox(height: 10),
                    TextField(
                      controller: codeControllers[question.qno],
                      decoration: InputDecoration(
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                        hintText: "Write your code here...",
                        fillColor: Colors.white,
                        filled: true,
                      ),
                      maxLines: 10,
                      inputFormatters: [FilteringTextInputFormatter.singleLineFormatter],
                    ),
                  ],
                ),
              );
            }).toList(),

            const SizedBox(height: 20),
            Center(
              child: ElevatedButton(
                onPressed: () async {
                  // Check if all code fields are filled
                  final incomplete = widget.program.questions.any((q) =>
                      codeControllers[q.qno]?.text.trim().isEmpty ?? true);

                  if (incomplete) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Please submit code for all questions')),
                    );
                    return;
                  }

                  final answerList = widget.program.questions.map((q) {
                    final submittedCode = codeControllers[q.qno]?.text.trim();
                    return {
                      "qno": q.qno,
                      "submitted_code": submittedCode,
                    };
                  }).toList();

                  final success = await ProgrammingApiService.submitProgramingAnswers(
                    programmingId: widget.program.id,
                    answers: answerList,
                  );

                  if (success) {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (_) => const SuccessScreen()),
                    );
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Submission failed. Try again.')),
                    );
                  }
                },
                child: const Text("Submit"),
              ),
            )
          ],
        ),
      ),
    );
  }
}
