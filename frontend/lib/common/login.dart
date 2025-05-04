import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
<<<<<<< HEAD:frontend/lib/screens/login.dart
import 'admin/admin_dashboard.dart';
import './student/dashboard.dart';
=======
import '../admin/dashboard.dart';
import '../student/dashboard.dart';
>>>>>>> e9beca76bcc4bce8b1fd4ad35dc4b0416819cb0f:frontend/lib/common/login.dart
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'dart:convert';
import 'signup.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  bool isPasswordHidden = true;
  bool isLoading = false;
  String userType = "";
  bool _isValidUser = true;
  final _formKey = GlobalKey<FormState>();

  void _login() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();

    if (_formKey.currentState!.validate()) {
      setState(() {
        isLoading = true;
      });

      final apiUrl = dotenv.get('API_URL');
      try {
        final response = await http.post(
          Uri.parse('$apiUrl/api/auth/signin'),
          body: {
            'email': emailController.text,
            'password': passwordController.text,
          },
        );

<<<<<<< HEAD:frontend/lib/screens/login.dart
        setState(() {
          isLoading = false;
        });

        if (response.statusCode == 200) {
          final responseData = json.decode(response.body);
          String userType = responseData['userType'];
          await prefs.setString('auth_token', responseData['auth_token']);
          await prefs.setString('userType', userType);
          await prefs.setString('userName', responseData['userName']);
          await prefs.setString('userEmail', responseData['userEmail']);
          await prefs.setBool('isLoggedIn', true);

          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Logged in successfully! 🎉')),
          );

          if (userType == 'student') {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                  builder: (_) => HomePage(userName: responseData['userName'])),
            );
          } else {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                  builder: (_) =>
                      AdminDashboard(userName: responseData['userName'])),
            );
          }
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
                content: Text('Something went wrong.. Try again later..')),
          );
=======
        if (userType == 'student') {
          Navigator.pushReplacement(
              context, MaterialPageRoute(builder: (_) => DashboardPage())); //userName: json.decode(response.body)['userName']
        } else {
          Navigator.pushReplacement(
              context, MaterialPageRoute(builder: (_) => AdminDashboardPage())); //userName: json.decode(response.body)['userName']
>>>>>>> e9beca76bcc4bce8b1fd4ad35dc4b0416819cb0f:frontend/lib/common/login.dart
        }
      } catch (error) {
        setState(() {
          isLoading = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
              content: Text('Failed to connect to the server.')),
        );
<<<<<<< HEAD:frontend/lib/screens/login.dart
        print('Login error: $error');
=======
      }

      if (_isValidUser) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Login Successful ✅')),
        );
      } else {}

      await prefs.setString('userType', userType);

      await prefs.setBool('isLoggedIn', true);
      if (userType == 'student') {
        Navigator.pushReplacement(
            context, MaterialPageRoute(builder: (_) => DashboardPage()));//userName: json.decode(response.body)['userName']
      } else {
        Navigator.pushReplacement(
            context, MaterialPageRoute(builder: (_) => AdminDashboardPage()));//userName: json.decode(response.body)['userName']
>>>>>>> e9beca76bcc4bce8b1fd4ad35dc4b0416819cb0f:frontend/lib/common/login.dart
      }
    }
  }

  bool _isValidEmail(String email) {
    // Simple email validation
    return RegExp(r"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$").hasMatch(email);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      body: Center(
        child: SingleChildScrollView(
          child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 24),
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Form(
              key: _formKey,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Log In",
                    style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    "Enter your credentials below to access",
                    style: TextStyle(color: Colors.grey),
                  ),
                  const SizedBox(height: 24),
                  TextFormField(
                    controller: emailController,
                    decoration: const InputDecoration(
                      labelText: "Your Email",
                      border: OutlineInputBorder(),
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter email';
                      } else if (!_isValidEmail(value)) {
                        return 'Please enter a valid email';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: passwordController,
                    obscureText: isPasswordHidden,
                    decoration: InputDecoration(
                      labelText: "Password",
                      border: const OutlineInputBorder(),
                      suffixIcon: IconButton(
                        icon: Icon(
                          isPasswordHidden
                              ? Icons.visibility_off
                              : Icons.visibility,
                        ),
                        onPressed: () {
                          setState(() {
                            isPasswordHidden = !isPasswordHidden;
                          });
                        },
                      ),
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter password';
                      } else if (value.length < 8) {
                        return 'Password must be at least 8 characters';
                      }
                      // You might want to add more complex password validation here
                      return null;
                    },
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: isLoading ? null : _login,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: isLoading
                          ? const CircularProgressIndicator(
                              color: Colors.white,
                              strokeWidth: 2,
                            )
                          : const Text(
                              "Log In",
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 16,
                              ),
                            ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Center(
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text("Don't have an account? "),
                        GestureDetector(
                          onTap: () {
                            Navigator.pushReplacement(
                              context,
                              MaterialPageRoute(
                                  builder: (_) => const SignUpPage()),
                            );
                          },
                          child: const Text(
                            "Sign Up",
                            style: TextStyle(
                              color: Colors.blue,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                  )
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}