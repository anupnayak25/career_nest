import 'dart:convert';
import 'package:http/http.dart' as http;
import 'quiz_model.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class ApiService {
 static Future<List<QuizList>> fetchQuizList() async {
  final token = dotenv.get('AUTH_TOKEN');
  final apiUrl = dotenv.get('API_URL');
  final response = await http.get(
    Uri.parse('$apiUrl/api/quiz'),
    headers: {
      'Authorization': 'Bearer $token',
      'Content-Type': 'application/json',
    },
  );

  if (response.statusCode == 200) {
    final List jsonData = json.decode(response.body);
    return jsonData.map((item) => QuizList.fromJson(item)).toList();
  } else {
    throw Exception("Failed to load quizzes"+response.body);
  }
}


//   static Future<List<Question>> fetchQuestionsForQuiz(int quizId) async {
//   final token = dotenv.get('AUTH_TOKEN');
//   final apiUrl = dotenv.get('API_URL');

//   final response = await http.get(
//     Uri.parse('$apiUrl/api/quiz/$quizId'),
//     headers: {
//       'Authorization': 'Bearer $token',
//       'Content-Type': 'application/json',
//     },
//   );

//   if (response.statusCode == 200) {
//     final body = json.decode(response.body);

//     if (body is List) {
//       return body.map((q) => Question.fromJson(q)).toList();
//     } else {
//       print('Unexpected response format: ${response.body}');
//       return [];
//     }
//   } else {
//     throw Exception("Failed to load questions (status: ${response.statusCode})");
//   }
// }
}
