import 'dart:convert';
class Quiz {
  final int id;
  final String title;
  final String description;
  final String uploadDate;
  final String dueDate;
  final String userId;
  final bool displayResult;
  final String status; // Now assigned in constructor
  final int totalMarks; // Use int type and assign in constructor
  final List<Question> questions;

  Quiz({
    required this.id,
    required this.title,
    required this.description,
    required this.uploadDate,
    required this.dueDate,
    required this.userId,
    required this.displayResult,
    this.status = "na",
    this.totalMarks = 0,
    required this.questions,
  });

  factory Quiz.fromJson(Map<String, dynamic> json) {
    return Quiz(
      id: json['id'] as int,
      title: json['title'] as String,
      description: json['description'] as String,
      uploadDate: json['upload_date'] as String,
      dueDate: json['due_date'] as String,
      userId: json['user_id'] as String,
      displayResult: json['display_result'] == 1,
      questions: (json['questions'] as List<dynamic>?)
              ?.map((e) => Question.fromJson(e))
              .toList() ?? [],
    );
  }
}


class Question {
  final int qno;
  final String question;
  final List<String> options;
  final String answer;
  final int marks;

  Question({
    required this.qno,
    required this.question,
    required this.options,
    required this.answer,
    required this.marks,
  });

factory Question.fromJson(Map<String, dynamic> json) {
  return Question(
    qno: json['qno'] as int,
    question: json['question'] as String,
    options: json['options'] is String
        ? List<String>.from(jsonDecode(json['options']))
        : (json['options'] as List<dynamic>).map((e) => e.toString()).toList(),
    answer: json['correct_ans'] as String,
    marks: json['marks'] as int,
  );
}

}
