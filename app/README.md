# Career Nest - Flutter Mobile App

A cross-platform mobile application for the Career Nest platform, built with Flutter. This app provides students and administrators with a native mobile experience for managing quizzes, video interviews, and assessments.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Running the App](#running-the-app)
- [Building for Production](#building-for-production)
- [Key Screens](#key-screens)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🌟 Overview

The Career Nest mobile app provides a seamless mobile experience for:
- Students to take quizzes and record video interviews
- Administrators to manage questions and view student progress
- Real-time synchronization with the backend API
- Offline support for viewing attempted quizzes

## ✨ Features

### For Students
- 📝 **Quiz Module**
  - Attempt Technical, HR, and Programming quizzes
  - View quiz instructions and time limits
  - Submit answers and view immediate feedback
  - Review previously attempted quizzes

- 🎥 **Video Interview Module**
  - Record video responses using device camera
  - Upload video answers to server
  - View video questions
  - Track submission status

- 📊 **Dashboard**
  - View all available quizzes and assignments
  - Track completion progress
  - View scores and performance metrics
  - Quick access to pending tasks

- 👤 **Profile Management**
  - Update user information
  - View activity history
  - Manage account settings

### For Administrators
- ➕ **Question Management**
  - Create new quiz questions
  - Edit existing questions
  - Set quiz parameters
  - Manage question sets

- 📹 **Video Management**
  - Upload video interview questions
  - Organize video question sets
  - Monitor student submissions

- 📈 **Analytics**
  - View student performance
  - Generate reports
  - Track completion rates

### General Features
- 🔐 Secure JWT-based authentication
- 📱 Native iOS and Android support
- 🎨 Material Design UI
- ⚡ Fast and responsive interface
- 🔄 Auto-login for returning users
- 📶 Offline mode support
- 🔔 Push notifications (planned)

## 🛠️ Tech Stack

- **Framework**: Flutter 3.6+
- **Language**: Dart 3.6+
- **State Management**: Provider
- **HTTP Client**: http package
- **Video**: video_player, camera
- **File Picking**: file_picker
- **UI**: Material Design Components
- **Notifications**: fluttertoast

### Dependencies

```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.4.0              # HTTP requests
  intl: ^0.18.1             # Internationalization
  provider: ^6.0.0          # State management
  file_picker: ^10.2.0      # File selection
  video_player: ^2.10.0     # Video playback
  fluttertoast: ^8.2.4      # Toast notifications
```

## 🚀 Getting Started

### Prerequisites

1. **Flutter SDK** (3.6.1 or higher)
   - Download from https://flutter.dev/docs/get-started/install

2. **Development Tools**
   - Android Studio (for Android development)
   - Xcode (for iOS development - macOS only)
   - VS Code or Android Studio with Flutter plugin

3. **Backend API**
   - Ensure the backend server is running
   - See [backend README](../backend/README.md)

### Installation

1. **Install Flutter**
   ```bash
   # Verify Flutter installation
   flutter doctor
   ```

2. **Clone the repository** (if not already done)
   ```bash
   git clone https://github.com/anupnayak25/career_nest.git
   cd career_nest/app
   ```

3. **Install dependencies**
   ```bash
   flutter pub get
   ```

4. **Configure environment**
   ```bash
   # Create .env file
   touch .env
   
   # Add API URL
   echo "API_BASE_URL=http://localhost:5000" > .env
   ```

   **Note**: For Android emulator, use `http://10.0.2.2:5000` to access localhost
   For physical devices, use your computer's IP address.

## 📁 Project Structure

```
app/
├── android/              # Android-specific code
│   ├── app/
│   │   ├── build.gradle  # App-level build config
│   │   └── src/          # Android source code
│   └── build.gradle      # Project-level build config
├── ios/                  # iOS-specific code
│   ├── Runner/
│   └── Runner.xcworkspace
├── lib/                  # Main Dart code
│   ├── admin/           # Admin screens
│   │   ├── admin_dashboard.dart
│   │   ├── dashboard.dart
│   │   ├── upload_video_page.dart
│   │   └── video_manager_page.dart
│   ├── student/         # Student screens
│   │   ├── dashboard.dart
│   │   ├── models/      # Data models
│   │   │   ├── hr_model.dart
│   │   │   ├── technical_model.dart
│   │   │   ├── programming_model.dart
│   │   │   └── quiz_model.dart
│   │   └── screens/     # Student screens
│   ├── auth/            # Authentication screens
│   ├── services/        # API services
│   ├── widgets/         # Reusable widgets
│   └── main.dart        # App entry point
├── assets/              # Images, fonts, etc.
├── test/                # Unit and widget tests
├── pubspec.yaml         # Dependencies
└── README.md           # This file
```

## ⚙️ Configuration

### Update API Base URL

Edit the API configuration in your Dart code:

```dart
// lib/services/api_config.dart
class ApiConfig {
  static const String baseUrl = 'http://10.0.2.2:5000'; // Android emulator
  // static const String baseUrl = 'http://localhost:5000'; // iOS simulator
  // static const String baseUrl = 'https://api.yourdomain.com'; // Production
}
```

### Android Configuration

Update `android/app/src/main/AndroidManifest.xml` for permissions:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

### iOS Configuration

Update `ios/Runner/Info.plist` for permissions:

```xml
<key>NSCameraUsageDescription</key>
<string>Camera access is required for video interviews</string>
<key>NSMicrophoneUsageDescription</key>
<string>Microphone access is required for video interviews</string>
```

## 🏃 Running the App

### Development Mode

```bash
# List available devices
flutter devices

# Run on connected device/emulator
flutter run

# Run on specific device
flutter run -d <device_id>

# Run in debug mode
flutter run --debug

# Run in profile mode (better performance)
flutter run --profile
```

### Hot Reload

While the app is running:
- Press `r` to hot reload
- Press `R` to hot restart
- Press `q` to quit

## 📦 Building for Production

### Android APK

```bash
# Build APK
flutter build apk

# Build APK for specific architecture
flutter build apk --split-per-abi

# Output: build/app/outputs/flutter-apk/app-release.apk
```

### Android App Bundle (for Google Play)

```bash
# Build App Bundle
flutter build appbundle

# Output: build/app/outputs/bundle/release/app-release.aab
```

### iOS App

```bash
# Build iOS app
flutter build ios

# Build for release
flutter build ios --release
```

**Note**: iOS builds require macOS with Xcode installed.

## 📱 Key Screens

### Main Entry Point
```dart
// lib/main.dart
void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Career Nest',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: LoginScreen(),
    );
  }
}
```

### Student Dashboard
- Displays available quizzes
- Shows completion status
- Quick access to video interviews
- Performance metrics

### Admin Dashboard
- Question management interface
- Student progress overview
- Video question management
- Analytics and reports

### Quiz Screen
- Question display
- Answer input
- Timer (if applicable)
- Submit functionality

### Video Interview Screen
- Camera preview
- Recording controls
- Upload functionality
- Submission status

## 🔄 State Management

The app uses Provider for state management:

```dart
import 'package:provider/provider.dart';

// Define a provider
class UserProvider extends ChangeNotifier {
  User? _user;
  
  User? get user => _user;
  
  void setUser(User user) {
    _user = user;
    notifyListeners();
  }
}

// Use in app
MultiProvider(
  providers: [
    ChangeNotifierProvider(create: (_) => UserProvider()),
  ],
  child: MyApp(),
);

// Consume in widgets
Consumer<UserProvider>(
  builder: (context, userProvider, child) {
    return Text(userProvider.user?.name ?? 'Guest');
  },
);
```

## 🔌 API Integration

### HTTP Service Example

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class ApiService {
  static const String baseUrl = 'http://10.0.2.2:5000';
  
  static Future<dynamic> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'email': email,
        'password': password,
      }),
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to login');
    }
  }
  
  static Future<dynamic> getQuizzes(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/quiz/questions'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load quizzes');
    }
  }
}
```

## 🐛 Troubleshooting

### Common Issues

#### 1. API Connection Failed
```
Error: SocketException: Failed to connect
```
**Solution**: 
- For Android emulator, use `http://10.0.2.2:5000` instead of `localhost`
- For iOS simulator, use `http://localhost:5000`
- For physical devices, use your computer's IP address

#### 2. Gradle Build Failed
```
Error: Build failed with an exception
```
**Solution**:
```bash
cd android
./gradlew clean
cd ..
flutter clean
flutter pub get
flutter run
```

#### 3. CocoaPods Issues (iOS)
```
Error: CocoaPods not installed
```
**Solution**:
```bash
sudo gem install cocoapods
cd ios
pod install
cd ..
flutter run
```

#### 4. Video Player Not Working
**Solution**: 
- Check camera and microphone permissions
- Ensure permissions are added to AndroidManifest.xml and Info.plist

#### 5. Hot Reload Not Working
**Solution**: Press `R` for hot restart instead of `r`

### Debug Commands

```bash
# Clear build cache
flutter clean

# Update dependencies
flutter pub get

# Check for issues
flutter doctor -v

# Analyze code
flutter analyze

# Run tests
flutter test
```

## 📝 Development Tips

1. **Use Flutter DevTools** for debugging:
   ```bash
   flutter pub global activate devtools
   flutter pub global run devtools
   ```

2. **Format code** before committing:
   ```bash
   flutter format .
   ```

3. **Run analyzer** to catch issues:
   ```bash
   flutter analyze
   ```

4. **Use const constructors** when possible for better performance

5. **Organize imports** with:
   ```bash
   flutter pub run import_sorter:main
   ```

## 🧪 Testing

### Run Tests
```bash
# Run all tests
flutter test

# Run specific test file
flutter test test/widget_test.dart

# Run tests with coverage
flutter test --coverage
```

### Widget Testing Example
```dart
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('Login button test', (WidgetTester tester) async {
    await tester.pumpWidget(MyApp());
    
    expect(find.text('Login'), findsOneWidget);
    
    await tester.tap(find.text('Login'));
    await tester.pump();
  });
}
```

## 🤝 Contributing

See the main project [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

### Flutter-specific Guidelines

- Follow [Effective Dart](https://dart.dev/guides/language/effective-dart) guidelines
- Use meaningful widget names
- Keep widgets small and focused
- Use const constructors where possible
- Document complex logic
- Write tests for critical functionality

## 📚 Resources

### Flutter Resources
- [Flutter Documentation](https://docs.flutter.dev/)
- [Dart Language Tour](https://dart.dev/guides/language/language-tour)
- [Flutter Cookbook](https://docs.flutter.dev/cookbook)
- [API Reference](https://api.flutter.dev/)

### Related Documentation
- [Backend API](../backend/README.md)
- [Main Project README](../README.md)
- [Setup Guide](../SETUP.md)

## 📝 License

This project is for educational and demonstration purposes.

## 📞 Support

For issues or questions:
- Check the [main README](../README.md)
- Review Flutter [troubleshooting guide](https://docs.flutter.dev/testing/debugging)
- Open an issue on GitHub

---

Built with 💙 using Flutter
