import 'package:career_nest/common/splash_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:fluttertoast/fluttertoast.dart';


Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    await dotenv.load(fileName: ".env");
    runApp(const MyApp());
  } catch (e, stack) {
    // print("Error loading app: $e\n$stack");
     Fluttertoast.showToast(msg:"Error loading app: $e  $stack", toastLength: Toast.LENGTH_LONG);
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
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      debugShowCheckedModeBanner: false,
      // 
      home: SplashScreen(),
    );
  }
}
