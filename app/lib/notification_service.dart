import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class NotificationService {
  final FirebaseMessaging _messaging = FirebaseMessaging.instance;

  void sendTokenToBackend(String token, String userToken) async {

    final apiUrl = dotenv.get('API_URL');
    
    final response = await http.post(
      //TODO
      Uri.parse('$apiUrl/api/notification/save-token'),
      headers: {
        'Authorization': 'Bearer $userToken', // if using JWT
        'Content-Type': 'application/json',
      },
      body: '{"fcmToken": "$token"}',
    );

    if (response.statusCode == 200) {
      print("FCM token saved successfully.");
    } else {
      print("Failed to save FCM token: ${response.body}");
    }
  }

  Future<void> init() async {
    await _messaging.requestPermission();

    final prefs = await SharedPreferences.getInstance();
    final userToken = prefs.getString('auth_token');

    String? token = await _messaging.getToken();
    print('FCM Token: $token');

    // Foreground messages
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      print('📩 Foreground Notification');
      print('Title: ${message.notification?.title}');
      print('Body: ${message.notification?.body}');
    });

    // App opened from terminated state
    FirebaseMessaging.instance.getInitialMessage().then((message) {
      if (message != null) {
        print('App launched from terminated by notification');
      }
    });

    // App opened from background
    FirebaseMessaging.onMessageOpenedApp.listen((message) {
      print('App opened from background via notification');
    });

    FirebaseMessaging.instance.onTokenRefresh.listen((newToken) {
      sendTokenToBackend(newToken, userToken!);
    });
  }
}
