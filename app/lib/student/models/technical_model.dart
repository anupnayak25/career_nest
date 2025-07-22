class TechnicalItem {
  final int id;
  final String title;
  final String description;
  final String uploadDate;
  final String dueDate;
  final List<TechnicalQuestion> questions;
  final bool displayResult;
  final int totalMarks;

  TechnicalItem({
    required this.id,
    required this.title,
    required this.description,
    required this.uploadDate,
    required this.dueDate,
    required this.questions,
    required this.displayResult,
    required this.totalMarks,
  });

  factory TechnicalItem.fromJson(Map<String, dynamic> json) {
    print('TechnicalItem.fromJson received: ' + json.toString());
    return TechnicalItem(
      id: json['id'] as int,
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      uploadDate: json['publish_date'] ?? '',
      dueDate: json['due_date'] ?? '',
      totalMarks: json['total_marks'] ?? 0,
      displayResult: json['display_result'] == 1,
      questions: (json['questions'] as List<dynamic>?)
              ?.map((q) => TechnicalQuestion.fromJson(q))
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'upload_date': uploadDate,
      'due_date': dueDate,
      'questions': questions.map((q) => q.toJson()).toList(),
    };
  }
}

class TechnicalQuestion {
  final int qno;
  final String question;
  final int marks;

  TechnicalQuestion({
    required this.qno,
    required this.question,
    required this.marks,
  });

  factory TechnicalQuestion.fromJson(Map<String, dynamic> json) {
    print('TechnicalQuestion.fromJson received: ' + json.toString());
    return TechnicalQuestion(
      qno: json['qno'] ?? 0,
      question: json['question'] ?? '',
      marks: json['marks'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'qno': qno,
      'question': question,
      'marks': marks,
    };
  }
}

class TechnicalResultSummary {
  final int obtainedMarks;
  final int totalMarks;
  final double percentage;

  TechnicalResultSummary({
    required this.obtainedMarks,
    required this.totalMarks,
    required this.percentage,
  });
}
