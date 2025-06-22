import 'dart:convert';
import 'dart:math';
import 'package:http/http.dart' as http;
import 'package:career_nest/student/hr/hr_model.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';

class HrService {
  static Future<List<HrModel>> fetchHrList() async {
    try {
    final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final apiUrl= dotenv.get('API_URL');
      final response = await http.get(
        Uri.parse('$apiUrl/api/hr'),
        headers: {
          'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
        },
      );
      if (response.statusCode == 200) {
        final List<dynamic> jsonData = json.decode(response.body);
        return jsonData.map((e) => HrModel.fromJson(e)).toList();
      } else {
        throw Exception('Failed to load HR data: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching HR data: $e');
    }
  }

   static Future<bool> submitHRAnswers({
    required int hrQId,
    required List<Map<String, dynamic>> answers,
  }) async {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final apiUrl = dotenv.get('API_URL');
      String userId = prefs.getString('userId') ?? '';

      final url = Uri.parse('$apiUrl/api/hr/answers');
      final body = jsonEncode({
        'hr_question_id': hrQId,
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
