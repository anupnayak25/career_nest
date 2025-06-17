import 'dart:convert';
import 'package:career_nest/student/techinical/technical_model.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';

class TechnicalService {
  static Future<List<TechnicalItem>> fetchTechnicalList() async {
    final prefs = await SharedPreferences.getInstance();
     final token = prefs.getString('AUTH_TOKEN');
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
}