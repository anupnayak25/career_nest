import 'package:flutter/material.dart';

class AttemptPage<T> extends StatefulWidget {
  final String title;
  final List<T> questions;
  final Widget Function(T, int, dynamic, void Function(dynamic))
      questionBuilder;
  final Future<bool> Function(List<Map<String, dynamic>>) onSubmit;
  final Map<int, dynamic> Function()? initialAnswers;

  const AttemptPage({
    Key? key,
    required this.title,
    required this.questions,
    required this.questionBuilder,
    required this.onSubmit,
    this.initialAnswers,
  }) : super(key: key);

  @override
  State<AttemptPage<T>> createState() => _AttemptPageState<T>();
}

class _AttemptPageState<T> extends State<AttemptPage<T>> {
  late Map<int, dynamic> answers;
  bool isSubmitting = false;

  @override
  void initState() {
    super.initState();
    answers = widget.initialAnswers?.call() ?? {};
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.title)),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (widget.questions.isEmpty)
              const Text(
                'No questions available.',
                style:
                    TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
              )
            else
              ...widget.questions.asMap().entries.map((entry) {
                final idx = entry.key;
                final question = entry.value;
                return widget.questionBuilder(
                  question,
                  idx,
                  answers[idx],
                  (val) => setState(() => answers[idx] = val),
                );
              }),
            const SizedBox(height: 16.0),
            Center(
              child: ElevatedButton(
                child: isSubmitting
                    ? const CircularProgressIndicator()
                    : const Text('Submit'),
                onPressed: isSubmitting
                    ? null
                    : () async {
                        if (answers.length != widget.questions.length) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                                content: Text('Please answer all questions.')),
                          );
                          return;
                        }
                        setState(() => isSubmitting = true);
                        final answerList =
                            widget.questions.asMap().entries.map((entry) {
                          final idx = entry.key;
                          final question = entry.value;
                          return {
                            'qno': idx + 1,
                            'answer': answers[idx],
                          };
                        }).toList();
                        final success = await widget.onSubmit(answerList);
                        setState(() => isSubmitting = false);
                        if (success) {
                          Navigator.pop(context, true);
                        } else {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                                content: Text('Failed to submit answers.')),
                          );
                        }
                      },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
