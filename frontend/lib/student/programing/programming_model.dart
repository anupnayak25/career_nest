class ProgramingList {
  final int id;
  final String title;
  final String description;
  final String uploadDate;
  final String dueDate;
  final int totalMarks;
  final List<ProgrammingQuestion> questions;

  ProgramingList({
    required this.id,
    required this.title,
    required this.description,
    required this.uploadDate,
    required this.dueDate,
    required this.questions,
    required this.totalMarks,
  });

  factory ProgramingList.fromJson(Map<String, dynamic> json) {
    return ProgramingList(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      uploadDate: json['upload_date'],
      dueDate: json['due_date'],
      questions: (json['questions'] as List)
          .map((q) => ProgrammingQuestion.fromJson(q))
          .toList(),
      totalMarks: json['total_marks'] ?? 0, // Default to 0 if not present
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'description': description,
        'upload_date': uploadDate,
        'due_date': dueDate,
        'questions': questions.map((q) => q.toJson()).toList(),
      };
}

class ProgrammingQuestion {
  final int qno;
  final String question;
  final String programSnippet;
  final int marks;

  ProgrammingQuestion({
    required this.qno,
    required this.question,
    required this.programSnippet,
    required this.marks,
  });

  factory ProgrammingQuestion.fromJson(Map<String, dynamic> json) {
    return ProgrammingQuestion(
      qno: json['qno'],
      question: json['question'],
      programSnippet: json['programm_snippet'],
      marks: json['marks'],
    );
  }

  Map<String, dynamic> toJson() => {
        'qno': qno,
        'question': question,
        'programm_snippet': programSnippet,
        'marks': marks,
      };
}

