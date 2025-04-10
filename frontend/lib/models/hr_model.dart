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
      id: json['_id'],
      title: json['title'],
      dueDate: json['dueDate'],
      questions: (json['questions'] as List)
          .map((e) => Question.fromJson(e))
          .toList(),
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
      qno: json['qno'],
      question: json['question'],
      marks: json['marks'],
    );
  }
}
