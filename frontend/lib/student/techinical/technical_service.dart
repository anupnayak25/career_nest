import 'dart:convert';
import 'package:career_nest/student/techinical/technical_model.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';

class TechnicalService {
  static Future<List<TechnicalItem>> fetchTechnicalList() async {
    final prefs = await SharedPreferences.getInstance();
     final token = prefs.getString('auth_token');
      final apiUrl= dotenv.get('API_URL');
      final response = await http.get(
        Uri.parse('$apiUrl/api/technical'),
        headers: {
          'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
        },
      );
    if (response.statusCode == 200) {
      final List jsonData = json.decode(response.body);
      return jsonData.map((item) => TechnicalItem.fromJson(item)).toList();
    } else {
      throw Exception("Failed to load quizzes");
    }
  }
   static Future<bool> submitTechnicalAnswers({
    required int qno,
    required List<Map<String, dynamic>> answers,
  }) async {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final apiUrl = dotenv.get('API_URL');
      String userId = prefs.getString('userId') ?? '';

      final url = Uri.parse('$apiUrl/api/technical/answers');
      final body = jsonEncode({
        'hr_question_id': qno,
        'user_id': userId,
        'answers': answers,
      });

      try {
        final response = await http.post(
          url,
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'application/json',
          },
          body: body,
        );
        if (response.statusCode == 201) {
          return true;
        } else {
          print("Failed to submit answers: ${response.body}");
          //print(response.body);
          return false;
        }
      } catch (e) {
        print("Error submitting answers: $e");
        return false;
      }
    //return true; // Placeholder return value
  }
}