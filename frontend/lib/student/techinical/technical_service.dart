import 'dart:convert';
import 'package:career_nest/student/techinical/technical_model.dart';
import 'package:http/http.dart' as http;

class TechnicalService {
  static Future<List<TechnicalItem>> fetchTechnicalList() async {
    final response = await http.get(Uri.parse("https://career-nest.onrender.com/api/technical"));

    if (response.statusCode == 200) {
      final List jsonData = json.decode(response.body);
      return jsonData.map((item) => TechnicalItem.fromJson(item)).toList();
    } else {
      throw Exception("Failed to load quizzes");
    }
  }
}