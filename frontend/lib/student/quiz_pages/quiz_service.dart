
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../quiz_pages/quiz_model.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
class ApiService {
  static Future<List<Quiz>> fetchQuizzes() async {
     final token = dotenv.get('AUTH_TOKEN');
      final apiUrl= dotenv.get('API_URL');
      final response = await http.get(
        Uri.parse('$apiUrl/api/quiz'),
        headers: {
          'auth_token': token,
          'Content-Type': 'application/json',
        },
      );
    if (response.statusCode == 200) {
      final List jsonData = json.decode(response.body);
      return jsonData.map((item) => Quiz.fromJson(item)).toList();
    } else {
      throw Exception("Failed to load quizzes");
    }
  }
}
