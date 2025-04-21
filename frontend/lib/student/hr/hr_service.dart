import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:career_nest/student/hr/hr_model.dart';

class HrService {
  static const String _apiUrl = 'https://career-nest.onrender.com/api/hr';

  Future<List<HrModel>> fetchHrList() async {
    try {
      final response = await http.get(Uri.parse(_apiUrl));
       //print('Response status: ${response.statusCode}');
      //print('Response body: ${response.body}');
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
