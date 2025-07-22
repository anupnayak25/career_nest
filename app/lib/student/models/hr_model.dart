class HrModel {
  final String id;
  final String title;
  final String description;
  final String uploadDate;
  final String dueDate;
  final List<Question> questions;
  final int totalMarks;
  final bool displayResult;

  HrModel({
    required this.id,
    required this.title,
    required this.description,
    required this.uploadDate,
    required this.dueDate,
    required this.questions,
    required this.displayResult,
    required this.totalMarks,
  });

  factory HrModel.fromJson(Map<String, dynamic> json) {
    print('HrModel.fromJson received: ' + json.toString());
    return HrModel(
      id: json['id']?.toString() ?? '', // fallback if not using Mongo _id
      title: json['title']?.toString() ?? 'No Title',
      description: json['description']?.toString() ?? 'No Description',
      uploadDate:
          json['publish_date']?.toString() ?? '', // changed from upload_date
      dueDate: json['due_date']?.toString() ?? '',
      displayResult: json['display_result'] == 1,
      questions: (json['questions'] as List<dynamic>?)
              ?.map((e) => Question.fromJson(e))
              .toList() ??
          [],
      totalMarks: json['total_marks'] ?? 0, // changed from totalMarks
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
    print('Question.fromJson received: ' + json.toString());
    return Question(
      qno: json['qno'] ?? 0,
      question: json['question']?.toString() ?? 'No question',
      marks: json['marks'] ?? 0,
    );
  }
}

class HrResultSummary {
  final int obtainedMarks;
  final int totalMarks;
  final double percentage;

  HrResultSummary({
    required this.obtainedMarks,
    required this.totalMarks,
    required this.percentage,
  });
}
