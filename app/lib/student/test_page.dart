import 'package:flutter/material.dart';
import 'package:career_nest/student/common/list.dart';
import 'package:career_nest/student/quiz_pages/quiz_model.dart';
import 'package:career_nest/student/hr/hr_model.dart';
import 'package:career_nest/student/programing/programming_model.dart';
import 'package:career_nest/student/techinical/technical_model.dart';

class TestPage extends StatelessWidget {
  const TestPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Tests')),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _buildTestButton(
              context,
              label: 'Quiz',
              color: Colors.blue,
              page: AssignmentListPage<QuizList, QuizQuestion>(
                type: "quiz",
                fromJson: QuizList.fromJson,
                getTitle: (quiz) => quiz.title,
                getUploadDate: (quiz) => quiz.uploadDate,
                getDueDate: (quiz) => quiz.dueDate,
                getId: (quiz) => quiz.id,
                getTotalMarks: (quiz) => quiz.totalMarks,
                getQuestions: (quiz) => quiz.questions,
                attemptButtonText: "Attempt Quiz",
                questionBuilder: (question, idx, selected, onChanged) {
                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('${question.qno}) ${question.question}',
                          style: const TextStyle(fontWeight: FontWeight.bold)),
                      ...question.options.map((option) => RadioListTile<String>(
                            value: option,
                            groupValue: selected,
                            onChanged: onChanged,
                            title: Text(option),
                          )),
                    ],
                  );
                },
                questionResultBuilder: (question, result) {
                  final isCorrect = result['is_correct'] == 1;
                  final selectedAns = result['selected_ans'] ?? '';
                  return Card(
                    color: isCorrect ? Colors.green[50] : Colors.red[50],
                    margin: const EdgeInsets.symmetric(vertical: 8),
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Q${question.qno}: ${question.question}',
                              style:
                                  const TextStyle(fontWeight: FontWeight.bold)),
                          ...question.options.map((option) {
                            final isSelected = option == selectedAns;
                            final isCorrectOption = option == question.answer;
                            return Row(
                              children: [
                                Icon(
                                  isCorrectOption
                                      ? Icons.check_circle
                                      : isSelected
                                          ? Icons.cancel
                                          : Icons.radio_button_unchecked,
                                  color: isCorrectOption
                                      ? Colors.green
                                      : isSelected
                                          ? Colors.red
                                          : Colors.grey,
                                  size: 18,
                                ),
                                const SizedBox(width: 6),
                                Text(option),
                                if (isCorrectOption)
                                  const Padding(
                                    padding: EdgeInsets.only(left: 8.0),
                                    child: Text('Correct',
                                        style: TextStyle(
                                            color: Colors.green,
                                            fontWeight: FontWeight.bold)),
                                  ),
                                if (isSelected && !isCorrectOption)
                                  const Padding(
                                    padding: EdgeInsets.only(left: 8.0),
                                    child: Text('Your Answer',
                                        style: TextStyle(
                                            color: Colors.red,
                                            fontWeight: FontWeight.bold)),
                                  ),
                              ],
                            );
                          }).toList(),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 24),
            _buildTestButton(
              context,
              label: 'HR',
              color: Colors.orange,
              page: AssignmentListPage<HrModel, Question>(
                type: "hr",
                fromJson: HrModel.fromJson,
                getTitle: (hr) => hr.title,
                getUploadDate: (hr) => hr.uploadDate,
                getDueDate: (hr) => hr.dueDate,
                getId: (hr) => int.tryParse(hr.id) ?? 0,
                getTotalMarks: (hr) => hr.totalMarks,
                getQuestions: (hr) => hr.questions,
                attemptButtonText: "Attempt HR",
                questionBuilder: (question, idx, selected, onChanged) {
                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('${question.qno}) ${question.question}',
                          style: const TextStyle(fontWeight: FontWeight.bold)),
                      TextField(
                        onChanged: onChanged,
                        decoration:
                            const InputDecoration(labelText: 'Your Answer'),
                      ),
                    ],
                  );
                },
                questionResultBuilder: (question, result) {
                  final answer = result['answer'] ?? '';
                  final marksAwarded = result['marks_awarded'] ?? 0;
                  return Card(
                    margin: const EdgeInsets.symmetric(vertical: 8),
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Q${question.qno}: ${question.question}',
                              style:
                                  const TextStyle(fontWeight: FontWeight.bold)),
                          Text('Your Answer: $answer'),
                          Text('Marks Awarded: $marksAwarded'),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 24),
            _buildTestButton(
              context,
              label: 'Programming',
              color: Colors.green,
              page: AssignmentListPage<ProgramingList, ProgrammingQuestion>(
                type: "programming",
                fromJson: ProgramingList.fromJson,
                getTitle: (prog) => prog.title,
                getUploadDate: (prog) => prog.uploadDate,
                getDueDate: (prog) => prog.dueDate,
                getId: (prog) => prog.id,
                getTotalMarks: (prog) => prog.totalMarks,
                getQuestions: (prog) => prog.questions,
                attemptButtonText: "Attempt Programming",
                questionBuilder: (question, idx, selected, onChanged) {
                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('${question.qno}) ${question.question}',
                          style: const TextStyle(fontWeight: FontWeight.bold)),
                      TextField(
                        onChanged: onChanged,
                        decoration:
                            const InputDecoration(labelText: 'Your Code'),
                      ),
                    ],
                  );
                },
                questionResultBuilder: (question, result) {
                  final answer = result['answer'] ?? '';
                  final marksAwarded = result['marks_awarded'] ?? 0;
                  return Card(
                    margin: const EdgeInsets.symmetric(vertical: 8),
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Q${question.qno}: ${question.question}',
                              style:
                                  const TextStyle(fontWeight: FontWeight.bold)),
                          Text('Your Code: $answer'),
                          Text('Marks Awarded: $marksAwarded'),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 24),
            _buildTestButton(
              context,
              label: 'Technical',
              color: Colors.purple,
              page: AssignmentListPage<TechnicalItem, TechnicalQuestion>(
                type: "technical",
                fromJson: TechnicalItem.fromJson,
                getTitle: (tech) => tech.title,
                getUploadDate: (tech) => tech.uploadDate,
                getDueDate: (tech) => tech.dueDate,
                getId: (tech) => tech.id,
                getTotalMarks: (tech) => 0, // Or tech.totalMarks if available
                getQuestions: (tech) => tech.questions,
                attemptButtonText: "Attempt Technical",
                questionBuilder: (question, idx, selected, onChanged) {
                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('${question.qno}) ${question.question}',
                          style: const TextStyle(fontWeight: FontWeight.bold)),
                      TextField(
                        onChanged: onChanged,
                        decoration:
                            const InputDecoration(labelText: 'Your Answer'),
                      ),
                    ],
                  );
                },
                questionResultBuilder: (question, result) {
                  final answer = result['answer'] ?? '';
                  final marksAwarded = result['marks_awarded'] ?? 0;
                  return Card(
                    margin: const EdgeInsets.symmetric(vertical: 8),
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Q${question.qno}: ${question.question}',
                              style:
                                  const TextStyle(fontWeight: FontWeight.bold)),
                          Text('Your Answer: $answer'),
                          Text('Marks Awarded: $marksAwarded'),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTestButton(BuildContext context,
      {required String label, required Color color, required Widget page}) {
    return SizedBox(
      width: double.infinity,
      height: 60,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: color,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        ),
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => page),
          );
        },
        child: Text(
          label,
          style: const TextStyle(
              fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white),
        ),
      ),
    );
  }
}
