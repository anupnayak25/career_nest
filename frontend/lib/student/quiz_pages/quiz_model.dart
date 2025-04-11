class Quiz {
  final String id;
  final String title;
  final String uploadDate;
  final String dueDate;
  final int totalMarks;
  final String description;
  final String status;
  final List<Question> questions;

  Quiz({
    required this.id,
    required this.title,
    required this.description,
    required this.uploadDate,
    required this.dueDate,
    required this.totalMarks,
    required this.status,
    required this.questions,
  });

  factory Quiz.fromJson(Map<String, dynamic> json) {
    return Quiz(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      uploadDate: json['uploadDate'],
      dueDate: json['dueDate'],
      totalMarks: json['totalMarks'],
      status: json['status'],
      questions: (json['questions'] as List)
          .map((q) => Question.fromJson(q))
          .toList(),
    );
  }
}

class Question {
  final String question;
  final List<String> options;
  final String answer;

  Question({
    required this.question,
    required this.options,
    required this.answer,
  });

  factory Question.fromJson(Map<String, dynamic> json) {
    return Question(
      question: json['question'],
      options: List<String>.from(json['options']),
      answer: json['answer'],
    );
  }
}


