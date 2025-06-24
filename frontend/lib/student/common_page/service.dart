import 'dart:convert';
import 'dart:io';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:path/path.dart';
import 'package:shared_preferences/shared_preferences.dart';

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
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    final apiUrl = dotenv.get('API_URL');
    String userId = prefs.getString('userId') ?? '';
    final url = Uri.parse('$apiUrl/api/$type/attempted/$userId');

    try {
      final response = await http.get(
        url,
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        if (response.body.trim().isEmpty) {
          print("Empty response body");
          return [];
        }

        final decoded = json.decode(response.body);
        final attempted = decoded['attempted'];

        if (attempted is List) {
          return attempted.map((e) => int.tryParse(e.toString()) ?? 0).toList();
        } else {
          return [];
        }
      } else {
        print("Failed to fetch attempted $type: ${response.body}");
        return [];
      }
    } catch (e) {
      print("Error fetching attempted $type: $e");
      return [];
    }
  }


  static Future<List<Map<String, dynamic>>> fetchResults({required int id,required String type}) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    String userId = prefs.getString('userId') ?? '';
    if (token == null) {
      throw Exception("No authentication token found");
    }
    final apiUrl = dotenv.get('API_URL');
    print('$apiUrl/api/$type/answers/$id/$userId');
    final response = await http.get(
      
      Uri.parse('$apiUrl/api/$type/answers/$id/$userId'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );
    //log("Response status: ${response.statusCode} , Response body: ${response.body}");
    print(response.body);
    if (response.statusCode == 200) {
    final List data = json.decode(response.body);
    return data.map((e) => e as Map<String, dynamic>).toList();
  } else {
    throw Exception('Failed to load $type answers: ${response.body}');
  }
  }
}
