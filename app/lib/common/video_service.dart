import 'dart:io';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http_parser/http_parser.dart';

class VideoService {
  // static const String baseUrl = 'https://career-nest-backend.vercel.app';
  static String baseUrl = dotenv.get('API_URL');

  static Future<List<Map<String, dynamic>>> getUserVideos() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/videos'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return List<Map<String, dynamic>>.from(data['data'] ?? []);
      } else {
        throw Exception('Failed to load videos: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching videos: $e');
    }
  }

  static Future<String?> uploadVideoFile(File videoFile) async {
    try {
      print("Starting video upload. File path: ${videoFile.path}");

      // Retrieve the token from SharedPreferences
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      if (token == null) {
        print("Error: No authentication token found.");
        return null;
      }

      var request = http.MultipartRequest(
        'POST',
        Uri.parse('$baseUrl/api/videos/upload'),
      );

      // Add Authorization header
      request.headers['Authorization'] = 'Bearer $token';

      request.files.add(
        await http.MultipartFile.fromPath(
          'video',
          videoFile.path,
          contentType: MediaType('video', 'mp4'), // Explicitly set MIME type
        ),
      );

      print("Sending video upload request to: ${request.url}");

      var response = await request.send();

      print("Video upload response status: \\${response.statusCode}");

      if (response.statusCode == 200) {
        final responseData = await response.stream.bytesToString();
        final data = json.decode(responseData);
        print("Video upload successful. Response data: \\${data}");
        return data['filename'];
      } else {
        final errorResponse = await response.stream.bytesToString();
        print(
            "Video upload failed. Status code: \\${response.statusCode}, Response body: \\${errorResponse}");
        return null;
      }
    } catch (e) {
      print("Error during video upload: $e");
      return null;
    }
  }

  static Future<bool> addVideo(Map<String, dynamic> videoData) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/videos'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(videoData),
      );

      return response.statusCode == 201;
    } catch (e) {
      print('Add video error: $e');
      return false;
    }
  }

  static Future<bool> deleteVideo(int videoId) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl/api/videos/$videoId'),
        headers: {'Content-Type': 'application/json'},
      );

      return response.statusCode == 200;
    } catch (e) {
      print('Delete video error: $e');
      return false;
    }
  }

  static Future<bool> updateVideo(
    int videoId,
    Map<String, dynamic> videoData,
  ) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/api/videos/$videoId'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(videoData),
      );

      return response.statusCode == 200;
    } catch (e) {
      print('Update video error: $e');
      return false;
    }
  }

  static Future<List<Map<String, dynamic>>> getVideosByCategory(
    String category,
  ) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/videos/category/$category'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return List<Map<String, dynamic>>.from(data['videos'] ?? []);
      } else {
        throw Exception(
          'Failed to load videos by category: ${response.statusCode}',
        );
      }
    } catch (e) {
      throw Exception('Error fetching videos by category: $e');
    }
  }
}
