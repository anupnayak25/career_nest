class ProgrammingQuestion {
  final int qno;
  final String question;
  final List<String> options;
  final String correctAnswer;
  final int marks;

  ProgrammingQuestion({
    required this.qno,
    required this.question,
    required this.options,
    required this.correctAnswer,
    required this.marks,
  });

  factory ProgrammingQuestion.fromJson(Map<String, dynamic> json) {
    return ProgrammingQuestion(
      qno: json['qno'],
      question: json['question'],
      options: List<String>.from(json['options']),
      correctAnswer: json['correctAnswer'],
      marks: json['marks'],
    );
  }

  Map<String, dynamic> toJson() => {
        'qno': qno,
        'question': question,
        'options': options,
        'correctAnswer': correctAnswer,
        'marks': marks,
      };
}
