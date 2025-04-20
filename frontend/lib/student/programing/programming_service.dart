import 'dart:convert';
import 'package:career_nest/student/programing/programming_model.dart';
import 'package:http/http.dart' as http;

class ApiService {
  static Future<List<ProgramingList>> fetchProgramingList() async {
    final response = await http.get(Uri.parse("https://career-nest.onrender.com/api/programming"));

    if (response.statusCode == 200) {
      final List jsonData = json.decode(response.body);
      return jsonData.map((item) => ProgramingList.fromJson(item)).toList();
    } else {
      throw Exception("Failed to load quizzes");
    }
  }
}