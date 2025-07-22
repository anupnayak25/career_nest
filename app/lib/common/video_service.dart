import 'dart:io';
import 'package:http/http.dart' as http;
import 'dart:convert';

class VideoService {
  // static const String baseUrl = 'https://career-nest-backend.vercel.app';
  static const String baseUrl = 'http://localhost:5000';

  static Future<List<Map<String, dynamic>>> getUserVideos() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/videos/user-videos'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return List<Map<String, dynamic>>.from(data['videos'] ?? []);
      } else {
        throw Exception('Failed to load videos: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching videos: $e');
    }
  }

  static Future<String?> uploadVideoFile(File videoFile) async {
    try {
      var request = http.MultipartRequest(
        'POST',
        Uri.parse('$baseUrl/api/videos/upload-single'),
      );

      request.files.add(
        await http.MultipartFile.fromPath('video', videoFile.path),
      );

      var response = await request.send();

      if (response.statusCode == 200) {
        final responseData = await response.stream.bytesToString();
        final data = json.decode(responseData);
        return data['filename'];
      } else {
        return null;
      }
    } catch (e) {
      print('Upload error: $e');
      return null;
    }
  }

  static Future<bool> addVideo(Map<String, dynamic> videoData) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/videos/add'),
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
