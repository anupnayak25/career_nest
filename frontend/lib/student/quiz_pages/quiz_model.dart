import 'dart:convert';
class QuizList {
   final int id;
  final String title;
  final String description;
  final String uploadDate;
  final String dueDate;
  final String userId;
  final bool displayResult;
  final String status; // Now assigned in constructor
  final int totalMarks; 
  final List<QuizQuestion> questions;

  QuizList({
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

  factory QuizList.fromJson(Map<String, dynamic> json) {
    return QuizList(
     id: json['id'] as int,
      title: json['title'] as String,
      description: json['description'] as String,
      uploadDate: json['upload_date'] as String,
      dueDate: json['due_date'] as String,
      userId: json['user_id'] as String,
      displayResult: json['display_result'] == 1,
      questions: (json['questions'] as List<dynamic>?)
              ?.map((e) => QuizQuestion.fromJson(e))
              .toList() ?? [],
    );
  }
}

class QuizQuestion {
  final int id;
  final int qno;
  final String question;
  final List<String> options;
  final String answer;
  final int marks;

  QuizQuestion({
    required this.id,
   required this.qno,
    required this.question,
    required this.options,
    required this.answer,
    required this.marks,
  });

  factory QuizQuestion.fromJson(Map<String, dynamic> json) {
    return QuizQuestion(
      id: json['id'],
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

  class QuestionResult {
  final int qno;
  final String selectedAns;
  final bool isCorrect;
  final int marksAwarded;

  QuestionResult({
    required this.qno,
    required this.selectedAns,
    required this.isCorrect,
    required this.marksAwarded,
  });
}

class QuizResultSummary {
  final int correctAnswers;
  final int wrongAnswers;
  final int obtainedMarks;
  final int totalMarks;
  final double percentage;
  final List<QuestionResult> results;

  QuizResultSummary({
    required this.correctAnswers,
    required this.wrongAnswers,
    required this.obtainedMarks,
    required this.totalMarks,
    required this.percentage,
    required this.results,
  });
}
