import 'dart:convert';
import 'package:career_nest/student/programing/programming_model.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ProgrammingApiService {
  static Future<List<ProgramingList>> fetchProgramingList() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    final apiUrl = dotenv.get('API_URL');
    final response = await http.get(
      Uri.parse('$apiUrl/api/programming'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );
    if (response.statusCode == 200) {
      final List jsonData = json.decode(response.body);
      return jsonData.map((item) => ProgramingList.fromJson(item)).toList();
    } else {
      throw Exception("Failed to load programs");
    }
  }
  static Future<bool> submitProgramingAnswers({
  required int programmingId,
  required List<Map<String, dynamic>> answers,
}) async {
  final prefs = await SharedPreferences.getInstance();
  final token = prefs.getString('auth_token');
  final apiUrl = dotenv.get('API_URL');
  final String userId = prefs.getString('userId') ?? '';

  final url = Uri.parse('$apiUrl/api/programming/answers');
  final body = jsonEncode({
    'programming_id': programmingId,
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
      print("Failed to submit programming answers: ${response.body}");
      return false;
    }
  } catch (e) {
    print("Error submitting programming answers: $e");
    return false;
  }
}

}
