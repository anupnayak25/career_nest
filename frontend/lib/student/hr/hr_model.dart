class HrModel {
  final String id;
  final String title;
  final List<Question> questions;
  final String dueDate;

  HrModel({
    required this.id,
    required this.title,
    required this.questions,
    required this.dueDate,
  });

factory HrModel.fromJson(Map<String, dynamic> json) {
  return HrModel(
    id: json['_id']?.toString() ?? '',  // null-safe with fallback
    title: json['title']?.toString() ?? 'No Title',
    dueDate: json['due_date']?.toString() ?? '',
    questions: (json['questions'] as List<dynamic>?)
            ?.map((e) => Question.fromJson(e))
            .toList() ??
        [],
  );
}

}

class Question {
  final int qno;
  final String question;
  final int marks;

  Question({
    required this.qno,
    required this.question,
    required this.marks,
  });

 factory Question.fromJson(Map<String, dynamic> json) {
  return Question(
    qno: json['qno'] ?? 0,
    question: json['question']?.toString() ?? 'No question',
    marks: json['marks'] ?? 0,
  );
}

}
