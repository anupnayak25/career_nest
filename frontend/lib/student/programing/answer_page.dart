import 'package:flutter/material.dart';
import 'programming_model.dart';
import 'programming_service.dart';

class AnswerPage extends StatefulWidget {
  const AnswerPage({super.key});

  @override
  State<AnswerPage> createState() => _AnswerPageState();
}

class _AnswerPageState extends State<AnswerPage> {
  final ProgrammingService _service = ProgrammingService();
  List<ProgrammingQuestion> questions = [];
  Map<int, String> selectedAnswers = {};

  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadQuestions();
  }

  Future<void> _loadQuestions() async {
    final data = await _service.fetchQuestions();
    setState(() {
      questions = data;
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : SafeArea(
              child: Padding(
                padding: EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Programming',
                        style: TextStyle(
                            fontSize: 28, fontWeight: FontWeight.bold)),
                    SizedBox(height: 4),
                    Text('Total Questions: ${questions.length}',
                        style: TextStyle(fontSize: 16)),
                    SizedBox(height: 16),
                    Expanded(
                      child: ListView.builder(
                        itemCount: questions.length,
                        itemBuilder: (context, index) {
                          final q = questions[index];
                          return Container(
                            margin: EdgeInsets.symmetric(vertical: 8),
                            decoration: BoxDecoration(
                              color: Colors.blue.shade700,
                              borderRadius: BorderRadius.circular(16),
                            ),
                            padding: EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('${q.qno}) Question',
                                    style: TextStyle(
                                        color: Colors.white, fontSize: 16)),
                                SizedBox(height: 8),
                                Text(q.question,
                                    style: TextStyle(
                                        color: Colors.white,
                                        fontFamily: 'monospace')),
                                SizedBox(height: 12),
                                ...q.options.map((option) {
                                  return RadioListTile<String>(
                                    value: option,
                                    groupValue: selectedAnswers[q.qno],
                                    onChanged: (value) {
                                      setState(() {
                                        selectedAnswers[q.qno] = value!;
                                      });
                                    },
                                    activeColor: Colors.white,
                                    title: Text(option,
                                        style: TextStyle(color: Colors.white)),
                                    contentPadding: EdgeInsets.zero,
                                  );
                                }).toList(),
                              ],
                            ),
                          );
                        },
                      ),
                    ),
                    Center(
                      child: ElevatedButton(
                        onPressed: () {
                          Navigator.pushNamed(context, '/result');
                        },
                        child: Padding(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 32.0, vertical: 12),
                          child: Text("Submit", style: TextStyle(fontSize: 16)),
                        ),
                        style: ElevatedButton.styleFrom(
                          shape: StadiumBorder(),
                          backgroundColor: Colors.blue.shade700,
                        ),
                      ),
                    )
                  ],
                ),
              ),
            ),
    );
  }
}
