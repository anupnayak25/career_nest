import 'dart:convert';
import 'package:career_nest/student/programing/programming_model.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class ApiService {
  static Future<List<ProgramingList>> fetchProgramingList() async {
    final token = dotenv.get('AUTH_TOKEN');
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
}
