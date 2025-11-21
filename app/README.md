# Career Nest Mobile App 📱

> Cross-platform Flutter mobile application for students and faculty

## 📖 Overview

The Career Nest mobile app is a comprehensive assessment platform built with Flutter, providing students with a seamless
interface to attempt various types of assessments including HR interviews, technical questions, programming challenges,
and quizzes. Faculty can manage assessments and upload instructional videos.

## ✨ Features

### For Students

- 📝 **Multi-Format Assessments**: Attempt HR, Technical, Programming, and Quiz modules
- 🎥 **Video Interview Recording**: Built-in camera integration for recording video responses
- 📊 **Progress Tracking**: View attempted assessments and scores
- 🎲 **Quiz Pool Practice**: Random questions from expired quizzes for practice
- 🔔 **Push Notifications**: Firebase Cloud Messaging for assignment updates
- 👤 **Profile Management**: Update personal information
- 📈 **Result Viewing**: View detailed scores once published

### For Faculty/Admin

- 📋 **Assessment Management**: Create and manage all assessment types
- 📹 **Video Upload**: Upload reference videos with categorization
- 👥 **Student Monitoring**: View submissions and evaluate answers
- ✏️ **Mark Assignment**: Assign marks to student submissions

### Technical Features

- 🌐 **Cross-Platform**: Single codebase for Android, iOS, Web, Windows, Linux, macOS
- 🎨 **Material Design**: Beautiful, responsive UI
- 🔐 **Secure Authentication**: JWT-based auth with encrypted storage
- 📱 **Offline Support**: SharedPreferences for session persistence
- 🎬 **Lottie Animations**: Smooth loading and success animations

## 🏗️ Architecture

```
┌────────────────────────────────────────────────┐
│              Flutter Application               │
├────────────────────────────────────────────────┤
│  Presentation Layer (Screens)                  │
│  ├─ Student Module                             │
│  │  ├─ Dashboard                               │
│  │  ├─ Test Attempt Pages                      │
│  │  ├─ Profile & Notifications                 │
│  │  └─ Video Recording                         │
│  ├─ Admin Module                               │
│  │  ├─ Admin Dashboard                         │
│  │  ├─ Video Upload                            │
│  │  └─ Video Manager                           │
│  └─ Common (Login, Signup, Splash)             │
├────────────────────────────────────────────────┤
│  Business Logic Layer                          │
│  ├─ Models (HR, Technical, Quiz, Programming)  │
│  ├─ Services (API, Video, Notification)        │
│  └─ State Management (Provider)                │
├────────────────────────────────────────────────┤
│  Data Layer                                    │
│  ├─ HTTP Client (API Communication)            │
│  ├─ Local Storage (SharedPreferences)          │
│  ├─ Firebase (Push Notifications)              │
│  └─ Camera/Video Services                      │
└────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Flutter SDK**: 3.6.1 or higher
- **Dart SDK**: 3.6.1 or higher
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)
- **VS Code** with Flutter extension (recommended)

### Installation

1. **Install Flutter**

   Follow official guide: https://docs.flutter.dev/get-started/install

2. **Verify installation**

   ```bash
   flutter doctor
   ```

3. **Clone and setup**

   ```bash
   cd career_nest/app
   flutter pub get
   ```

4. **Configure environment**

   Create `.env` file in `app/` directory:

   ```env
   API_BASE_URL=http://10.0.2.2:5000/api  # Android emulator
   # API_BASE_URL=http://localhost:5000/api  # iOS simulator
   # API_BASE_URL=http://your-server-ip:5000/api  # Physical device
   ```

5. **Run the app**

   Android:

   ```bash
   flutter run
   ```

   iOS:

   ```bash
   flutter run -d ios
   ```

   Web:

   ```bash
   flutter run -d chrome
   ```

## 📁 Project Structure

```
app/
├── lib/
│   ├── main.dart                    # App entry point
│   ├── notification_service.dart    # FCM setup
│   │
│   ├── student/                     # Student module
│   │   ├── dashboard.dart           # Student dashboard
│   │   ├── profile_screen.dart      # User profile
│   │   ├── notification_screen.dart # Notifications list
│   │   ├── test_page.dart           # Attempt assessments
│   │   ├── quiz_pool_attempt_page.dart # Quiz pool
│   │   │
│   │   ├── models/                  # Data models
│   │   │   ├── hr_model.dart
│   │   │   ├── technical_model.dart
│   │   │   ├── quiz_model.dart
│   │   │   └── programming_model.dart
│   │   │
│   │   └── common/                  # Student utilities
│   │       └── carrer_nest_new.sql  # Database schema
│   │
│   ├── admin/                       # Faculty module
│   │   ├── admin_dashboard.dart     # Admin home
│   │   ├── dashboard.dart           # Admin navigation
│   │   ├── upload_video_page.dart   # Upload videos
│   │   └── video_manager_page.dart  # Manage videos
│   │
│   ├── common/                      # Shared components
│   │   ├── login.dart               # Login screen
│   │   ├── signup.dart              # Registration
│   │   ├── splash_screen.dart       # Splash animation
│   │   ├── home_page.dart           # Landing page
│   │   ├── theme.dart               # App theme config
│   │   ├── animated_appbar.dart     # Custom app bar
│   │   ├── video_recoredr_screen.dart # Video recording
│   │   ├── video_service.dart       # Video utilities
│   │   ├── display_video.dart       # Video player
│   │   └── responsive_text.dart     # Responsive text
│   │
│   └── widgets/                     # Reusable widgets
│       └── video_list.dart          # Video list widget
│
├── assets/
│   ├── animations/                  # Lottie JSON files
│   ├── logo.png                     # App logo
│   └── icon.png                     # App icon
│
├── android/                         # Android-specific files
├── ios/                             # iOS-specific files
├── web/                             # Web build files
├── windows/                         # Windows desktop files
├── linux/                           # Linux desktop files
├── macos/                           # macOS desktop files
│
├── pubspec.yaml                     # Dependencies
├── analysis_options.yaml            # Dart analyzer config
└── README.md                        # This file
```

## 📦 Dependencies

### Core Packages

```yaml
dependencies:
  flutter:
    sdk: flutter

  # State Management
  provider: ^6.0.0

  # HTTP & API
  http: ^1.4.0

  # Environment Variables
  flutter_dotenv: ^5.0.2

  # Local Storage
  shared_preferences: ^2.5.3
  path_provider: ^2.1.5

  # Firebase
  firebase_core: ^3.15.2
  firebase_messaging: ^15.2.10

  # Video & Camera
  camera: ^0.10.5+9
  video_player: ^2.10.0
  video_thumbnail: ^0.5.6

  # File Handling
  file_picker: ^10.2.0
  path: ^1.9.0

  # UI Components
  fluttertoast: ^8.2.4
  lottie: ^3.1.2
  font_awesome_flutter: ^10.7.0

  # Utilities
  intl: ^0.18.1
  url_launcher: ^6.1.7
  permission_handler: ^11.3.0
  focus_detector: ^2.0.1
  cupertino_icons: ^1.0.8
```

## 🎨 Theming

The app uses a custom theme defined in `lib/common/theme.dart`:

```dart
// Primary colors
AppColors.primary      // Main brand color
AppColors.secondary    // Accent color
AppColors.background   // Background
AppColors.card         // Card backgrounds

// Text styles
AppTextStyles.headlineLegacy
AppTextStyles.subtitleLegacy
AppTextStyles.body
AppTextStyles.buttonLegacy

// Button styles
AppButtonStyles.elevated
```

## 🔐 Authentication Flow

```
1. User opens app
   ├─ Check SharedPreferences for session
   └─ If logged in → Dashboard, else → Login

2. User signs up
   ├─ Enter details (name, email, password, userType)
   ├─ Request OTP via POST /api/auth/otp
   ├─ Verify OTP via POST /api/auth/verify-otp
   └─ Complete signup via POST /api/auth/signup
       └─ Receive JWT token
       └─ Store in SharedPreferences
       └─ Navigate to Dashboard

3. User logs in
   ├─ POST /api/auth/signin
   └─ Receive JWT token
       └─ Store token, userId, userName, userType
       └─ Navigate to Dashboard

4. Authenticated requests
   ├─ Read token from SharedPreferences
   └─ Add to headers: Authorization: Bearer <token>
```

## 🎥 Video Recording

```dart
// lib/common/video_recoredr_screen.dart

1. Request camera permissions
2. Initialize camera controller
3. Record video on button press
4. Save video to temporary directory
5. Upload via HTTP multipart request
6. Receive video filename from server
7. Store filename for answer submission
```

## 🔔 Push Notifications

Firebase Cloud Messaging integration:

```dart
// lib/notification_service.dart

class NotificationService {
  Future<void> init() async {
    // Request notification permissions
    await FirebaseMessaging.instance.requestPermission();

    // Get FCM token
    String? token = await FirebaseMessaging.instance.getToken();

    // Register token with backend
    registerToken(token);

    // Handle foreground messages
    FirebaseMessaging.onMessage.listen((message) {
      showNotification(message);
    });

    // Handle background messages
    FirebaseMessaging.onBackgroundMessage(handleBackgroundMessage);
  }
}
```

## 🏗️ Building

### Development Build

```bash
flutter run --debug
```

### Release Build

**Android APK:**

```bash
flutter build apk --release
# Output: build/app/outputs/flutter-apk/app-release.apk
```

**Android App Bundle (for Play Store):**

```bash
flutter build appbundle --release
```

**iOS:**

```bash
flutter build ios --release
# Open build/ios/iphoneos/Runner.app in Xcode for distribution
```

**Web:**

```bash
flutter build web --release
# Output: build/web/
```

## 🧪 Testing

### Run Tests

```bash
flutter test
```

### Widget Tests

```dart
// test/widget_test.dart
testWidgets('Login button exists', (WidgetTester tester) async {
  await tester.pumpWidget(MyApp());
  expect(find.text('Login'), findsOneWidget);
});
```

## 📞 Support

- 📧 Email: nnm24mc014@nmamit.in
- 🐛 Issues: [GitHub Issues](https://github.com/anupnayak25/career_nest/issues)

---

Built with ❤️ using Flutter
