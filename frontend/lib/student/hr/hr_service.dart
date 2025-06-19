import 'dart:convert';
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
}
