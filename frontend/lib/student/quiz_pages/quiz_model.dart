class Quiz {
  final int id;  // Changed from String to int
  final String title;
  final String description;
  final String uploadDate;  // Will map from 'upload_date'
  final String dueDate;    // Will map from 'due_date'
  final int totalMarks;
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
    // Calculate total marks by summing all question marks
    final totalMarks = (json['questions'] as List)
        .fold(0, (sum, question) => sum + (question['marks'] as int));

    return Quiz(
      id: json['id'] as int,
      title: json['title'] as String,
      description: json['description'] as String,
      uploadDate: json['upload_date'] as String,  // Matches API
      dueDate: json['due_date'] as String,        // Matches API
      totalMarks: totalMarks,
      status: json['status'] ?? 'Pending',        // Default value if null
      questions: (json['questions'] as List)
          .map((q) => Question.fromJson(q))
          .toList(),
    );
  }
}

class Question {
  final int qno;           // Added question number
  final String question;
  final List<String> options;
  final String answer;     // Matches 'correct_ans' in API
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
      options: List<String>.from(json['options']),
      answer: json['correct_ans'] as String,  // Matches API
      marks: json['marks'] as int,
    );
  }
}