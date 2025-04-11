
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../quiz_pages/quiz_model.dart';

class ApiService {
  static Future<List<Quiz>> fetchQuizzes() async {
    final response = await http.get(Uri.parse("https://career-nest.onrender.com/api/quiz"));

    if (response.statusCode == 200) {
      final List jsonData = json.decode(response.body);
      return jsonData.map((item) => Quiz.fromJson(item)).toList();
    } else {
      throw Exception("Failed to load quizzes");
    }
  }
}
