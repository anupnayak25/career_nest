  static Future<bool> checkServerHealth() async {
    final apiUrl = dotenv.get('API_URL');
    try {
      final response = await http.get(
        Uri.parse('$apiUrl/api/health'),
        headers: {
          'Content-Type': 'application/json',
        },
      );
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }
import 'dart:convert';
import 'dart:io';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:path/path.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AssignmentService {
  static Future<List<T>> fetchList<T>(
      String type, T Function(Map<String, dynamic>) fromJson) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    final apiUrl = dotenv.get('API_URL');
    // print('Fetching: ' + '$apiUrl/api/$type');
    final response = await http.get(
      Uri.parse('$apiUrl/api/$type'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );
    // print(
    //     'Response for $type: \nStatus: ${response.statusCode}\nBody: ${response.body}');
    if (response.statusCode == 200) {
      final List jsonData = json.decode(response.body);
      return jsonData.map((item) => fromJson(item)).toList();
    } else {
      throw Exception('Failed to load $type list: ${response.body}');
    }
  }

  static Future<bool> submitAnswers({
    required String type,
    required int assignmentId,
    required List<Map<String, dynamic>> answers,
  }) async {
    print('📤 [submitAnswers] Starting submission for type: $type');
    print('📤 [submitAnswers] Assignment ID: $assignmentId');
    print('📤 [submitAnswers] Answers count: ${answers.length}');
    print('📤 [submitAnswers] Answers: $answers');

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    final userId = prefs.getString('userId');
    final apiUrl = dotenv.get('API_URL');
    final url = Uri.parse('$apiUrl/api/$type/answers');

    print('📤 [submitAnswers] URL: $url');

    // For quiz, use quiz_id and selected_ans
    final isQuiz = type == 'quiz' || type == 'quizzes';
    final isHr = type == 'hr';
    final isTechnical = type == 'technical';
    final isProgramming = type == 'programming';

    print(
        '📤 [submitAnswers] Type flags - isQuiz: $isQuiz, isHr: $isHr, isTechnical: $isTechnical, isProgramming: $isProgramming');

    final body = jsonEncode({
      if (isHr || isTechnical) 'user_id': userId,
      if (isHr) 'hr_question_id': assignmentId,
      if (isTechnical) 'technical_question_id': assignmentId,
      if (isProgramming) 'programming_question_id': assignmentId,
      if (isQuiz) 'quiz_id': assignmentId,
      'answers': answers
          .map((answer) => {
                'qno': answer['id'],
                'answer': answer['answer'],
              })
          .toList(),
    });

    print('📤 [submitAnswers] Request body: $body');

    try {
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: body,
      );

      print('📤 [submitAnswers] Response status: ${response.statusCode}');
      print('📤 [submitAnswers] Response body: ${response.body}');

      if (response.statusCode == 201) {
        print('📤 [submitAnswers] ✅ SUCCESS for type: $type');
        return true;
      } else {
        print('📤 [submitAnswers] ❌ FAILURE for type: $type');
        return false;
      }
    } catch (e) {
      print('📤 [submitAnswers] ❌ ERROR: $e');
      return false;
    }
  }

  static Future<List<Map<String, dynamic>>> fetchResults({
    required String type,
    required int id,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    String userId = prefs.getString('userId') ?? '';
    final apiUrl = dotenv.get('API_URL');
    final response = await http.get(
      Uri.parse('$apiUrl/api/$type/answers/$id/$userId'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );
    if (response.statusCode == 200) {
      final List data = json.decode(response.body);
      return data.map((e) => e as Map<String, dynamic>).toList();
    } else {
      throw Exception('Failed to load $type answers: ${response.body}');
    }
  }

  static Future<List<int>> fetchAttempted(String type) async {
    return await ApiService.fetchAttempted(type);
  }
}

class ApiService {
  static Future<String?> uploadVideo(File videoFile) async {
    // print('[UPLOAD] Fetching auth token...');
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    // print('[UPLOAD] Auth token: $token');

    final apiUrl = dotenv.get('API_URL');
    // print('[UPLOAD] API URL: $apiUrl');

    final uri = Uri.parse('$apiUrl/api/videos/upload');
    final request = http.MultipartRequest('POST', uri);

    // print('[UPLOAD] Setting headers...');
    request.headers.addAll({
      'Authorization': 'Bearer $token',
      // Do not set Content-Type for MultipartRequest
    });

    // print('[UPLOAD] Preparing video file...');
    final videoStream = http.ByteStream(videoFile.openRead());
    final length = await videoFile.length();

    final multipartFile = http.MultipartFile(
      'video',
      videoStream,
      length,
      filename: basename(videoFile.path),
    );

    request.files.add(multipartFile);

    // print('[UPLOAD] Sending request...');
    final response = await request.send();

    if (response.statusCode == 200) {
      final res = await http.Response.fromStream(response);
      // print('[UPLOAD] Response: ${res.body}');
      final url =
          RegExp(r'"url"\s*:\s*"([^"]+)"').firstMatch(res.body)?.group(1);
      return url;
    } else {
      // print('[UPLOAD] Failed. Status code: ${response.statusCode}');
      return null;
    }
  }

  static Future<List<int>> fetchAttempted(type) async {
    print('🔍 [fetchAttempted] Starting fetch for type: $type');

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    final apiUrl = dotenv.get('API_URL');
    String userId = prefs.getString('userId') ?? '';
    final url = Uri.parse('$apiUrl/api/$type/attempted/$userId');

    print('🔍 [fetchAttempted] URL: $url');
    print('🔍 [fetchAttempted] User ID: $userId');
    print('🔍 [fetchAttempted] Token exists: ${token != null}');

    try {
      final response = await http.get(
        url,
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      print('🔍 [fetchAttempted] Response status: ${response.statusCode}');
      print('🔍 [fetchAttempted] Response body: ${response.body}');

      if (response.statusCode == 200) {
        if (response.body.trim().isEmpty) {
          print("⚠️ [fetchAttempted] Empty response body for type: $type");
          return [];
        }

        final decoded = json.decode(response.body);
        print('🔍 [fetchAttempted] Decoded response: $decoded');

        final attempted = decoded['attempted'];
        print(
            '🔍 [fetchAttempted] Attempted field: $attempted (type: ${attempted.runtimeType})');

        if (attempted is List) {
          final result =
              attempted.map((e) => int.tryParse(e.toString()) ?? 0).toList();
          print(
              '✅ [fetchAttempted] Successfully parsed attempted list for $type: $result');
          return result;
        } else {
          print(
              "⚠️ [fetchAttempted] Attempted field is not a List for type: $type. Got: ${attempted.runtimeType}");
          return [];
        }
      } else {
        print(
            "❌ [fetchAttempted] Failed to fetch attempted $type: Status ${response.statusCode}, Body: ${response.body}");
        return [];
      }
    } catch (e) {
      print("💥 [fetchAttempted] Error fetching attempted $type: $e");
      print("💥 [fetchAttempted] Stack trace: ${StackTrace.current}");
      return [];
    }
  }

  static Future<List<Map<String, dynamic>>> fetchResults(
      {required int id, required String type}) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    String userId = prefs.getString('userId') ?? '';
    if (token == null) {
      throw Exception("No authentication token found");
    }
    final apiUrl = dotenv.get('API_URL');
    // print('$apiUrl/api/$type/answers/$id/$userId');
    final response = await http.get(
      Uri.parse('$apiUrl/api/$type/answers/$id/$userId'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );
    // log("Response status: ${response.statusCode} , Response body: ${response.body}");
    // print(response.body);
    if (response.statusCode == 200) {
      final List data = json.decode(response.body);
      return data.map((e) => e as Map<String, dynamic>).toList();
    } else {
      throw Exception('Failed to load $type answers: ${response.body}');
    }
  }
}
