import 'package:career_nest/common/splash_screen.dart';
import 'package:career_nest/notification_service.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:career_nest/common/theme.dart';
import 'dart:ui';
import 'package:flutter/services.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    await dotenv.load(fileName: ".env");

    //firebase setup
    WidgetsFlutterBinding.ensureInitialized();
    await Firebase.initializeApp();

    final notificationService = NotificationService();
    await notificationService.init();

    // Restore status bar behavior
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
      statusBarColor: Colors.transparent, // Makes the status bar transparent
      statusBarIconBrightness: Brightness.light, // Adjust icon brightness
    ));

    runApp(const MyApp());
  } catch (e, stack) {
    // print("Error loading app: $e\n$stack");
    Fluttertoast.showToast(
        msg: "Error loading app: $e  $stack", toastLength: Toast.LENGTH_LONG);
  }
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // Future<Widget> _getInitialScreen() async {
  //   SharedPreferences prefs = await SharedPreferences.getInstance();
  //   bool isLoggedIn = prefs.getBool('isLoggedIn') ?? false;
  //   String userType = prefs.getString('userType') ?? '';

  //   if (isLoggedIn) {
  //     if (userType == 'student') {
  //       return DashboardPage();
  //     } else if (userType == 'teacher') {
  //       return AdminDashboardPage();
  //     }
  //   }
  //   return const LoginPage();
  // return DashboardPage();
  // }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Career Nest',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
            seedColor: AppColors.primary, brightness: Brightness.light),
        useMaterial3: true,
        scaffoldBackgroundColor: AppColors.background,
        cardColor: AppColors.card,
        textTheme: const TextTheme(
          headlineLarge: AppTextStyles.headlineLegacy,
          titleMedium: AppTextStyles.subtitleLegacy,
          bodyMedium: AppTextStyles.body,
          labelLarge: AppTextStyles.buttonLegacy,
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: AppButtonStyles.elevated,
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: Colors.white,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(color: AppColors.border),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(color: AppColors.border),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(color: AppColors.primary, width: 2),
          ),
          errorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(color: AppColors.error, width: 1),
          ),
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 15, vertical: 18),
        ),
      ),
      debugShowCheckedModeBanner: false,
      builder: (context, child) {
        // Constrain text scaling to prevent UI breaking
        return MediaQuery(
          data: MediaQuery.of(context).copyWith(
            textScaler: MediaQuery.of(context).textScaler.clamp(
                  minScaleFactor: 0.8, // Minimum 80% of default
                  maxScaleFactor: 1.5, // Maximum 150% of default
                ),
          ),
          child: Builder(
            builder: (context) {
              ErrorWidget.builder = (FlutterErrorDetails details) {
                return Center(child: Text(details.exceptionAsString()));
              };
              return child!;
            },
          ),
        );
      },
      home: SplashScreen(),
    );
  }
}
