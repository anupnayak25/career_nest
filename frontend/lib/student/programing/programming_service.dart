import 'programming_model.dart';

class ProgrammingService {
  // This would normally fetch from MongoDB
  Future<List<ProgrammingQuestion>> fetchQuestions() async {
    // Simulated sample data
    await Future.delayed(Duration(seconds: 1)); // mimic delay

    return [
      ProgrammingQuestion(
        qno: 1,
        question: '#include<stdio.h>\nvoid main() {\n  printf("hello world");\n}',
        options: ['hello world', 'Hello World', 'HELLO WORLD', 'Error'],
        correctAnswer: 'hello world',
        marks: 5,
      ),
      ProgrammingQuestion(
        qno: 2,
        question: 'void main() {\n  printf("hello world");\n}',
        options: ['Compilation error', 'hello world', 'Nothing', 'Runtime error'],
        correctAnswer: 'hello world',
        marks: 5,
      ),
    ];
  }
}
