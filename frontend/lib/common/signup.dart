import 'dart:async';

import 'package:flutter/material.dart';
import 'login.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../admin/dashboard.dart';
import '../student/dashboard.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'dart:convert';

class SignUpPage extends StatefulWidget {
  const SignUpPage({super.key});

  @override
  State<SignUpPage> createState() => _SignUpPageState();
}

class _SignUpPageState extends State<SignUpPage> {final _formKey = GlobalKey<FormState>();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final confirmPasswordController = TextEditingController();
  bool isPasswordHidden = true;
  bool isConfirmPasswordHidden = true;
  bool isLoading = false;
  final TextEditingController _otpController = TextEditingController();
  int _secondsRemaining = 0;
  Timer? _timer;
  void _startOtpTimer() {
    setState(() {
      _secondsRemaining = 60;
    });

    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_secondsRemaining == 0) {
        timer.cancel();
      } else {
        setState(() {
          _secondsRemaining--;
        });
      }
    });
  }

  @override
  void initState() {
    super.initState();
    emailController.addListener(() {
      setState(() {}); // Refreshes UI when email changes
    });
  }

  

  void _submit() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    if (_formKey.currentState!.validate()) {
      setState(() {
        isLoading = true;
      });

      // Simulate network request
      await Future.delayed(const Duration(seconds: 2));

      // final apiUrl = dotenv.get('API_URL');
      final apiUrl = dotenv.get('API_URL');
      final response =
          await http.post(Uri.parse('$apiUrl/api/auth/signup'), body: {
        'otp': _otpController.text,
        'email': emailController.text,
        'password': passwordController.text
      });

      print(response.body);

      if (response.statusCode == 201) {
        final responseData = json.decode(response.body);
        await prefs.setString('auth_token', responseData['auth_token']);
        await prefs.setString('userType', responseData['type']);
        await prefs.setString('userName', responseData['name']);
        await prefs.setString('userEmail', responseData['email']);
        await prefs.setString('userId', responseData['id']);
        await prefs.setBool('isLoggedIn', true);

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Account created! 🎉')),
        );

        if (responseData['type'] == 'student') {
          Navigator.pushReplacement(context,
              MaterialPageRoute(builder: (_) => const DashboardPage()));
        } else {
          Navigator.pushReplacement(context,
              MaterialPageRoute(builder: (_) => const AdminDashboardPage()));
        }
      } else if (response.statusCode == 401) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Invalid OTP.. Try again later..')),
        );
        print(response.body);
        _otpController.text = "";
      } else {
        print(response.body);
        print(response.statusCode);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
              content: Text('Something went wrong.. Try again later..')),
        );
      }

      setState(() {
        isLoading = false;
      });

      // Assume OTP is always correct for now
    }
  }

  void _getOtp() async {
    if (!_isValidEmail(emailController.text)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a valid email')),
      );
      setState(() {
        isLoading = false;
        _secondsRemaining = 0;
      });
      return;
    }

    setState(() {
      isLoading = true;
    });


    final apiUrl = dotenv.get('API_URL');
    final response = await http.post(
  Uri.parse('$apiUrl/api/auth/otp'),
  body: {
    'email': emailController.text,
  },
);


    setState(() {
      isLoading = false;
    });

    if (response.statusCode == 200) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('OTP sent successfully 🎉')),
      );
      _startOtpTimer(); // ← Start the countdown
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to send OTP: ${response.body}')),
      );
      print(response.body);
      _timer?.cancel(); // 🔴 Stop any existing timer if failed
      setState(() {
        _secondsRemaining = 0;
      });
    }
  }

  bool _isValidEmail(String email) {
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
                    "Sign Up",
                    style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    "Enter your details below & free sign up",
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
                  const SizedBox(height: 24),
                  Row(
                    children: [
                      Expanded(
                        flex: 3,
                        child: TextField(
                          controller: _otpController,
                          keyboardType: TextInputType.number,
                          maxLength: 6,
                          inputFormatters: [
                            FilteringTextInputFormatter.digitsOnly,
                            LengthLimitingTextInputFormatter(6),
                          ],
                          decoration: InputDecoration(
                            labelText: "OTP",
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            counterText: '',
                          ),
                        ),
                      ),
                      const SizedBox(width: 10), // add small gap between them
                      Expanded(
                        flex: 1,
                        child: ElevatedButton(
                          onPressed: (!_isValidEmail(emailController.text) ||
                                  isLoading)
                              ? null
                              : _getOtp,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green[400],
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: (_secondsRemaining > 0)
                              ? Text('Resend in $_secondsRemaining s',
                                  style: TextStyle(color: Colors.white))
                              : Text("Get OTP",
                                  style: TextStyle(color: Colors.white)),
                        ),
                      
                      ),
                      // Expanded(
                      //   flex:1,child: ElevatedButton(
                      //   onPressed: () {
                      //     if (_otpController.text.isEmpty) {
                      //       ScaffoldMessenger.of(context).showSnackBar(
                      //         const SnackBar(
                      //             content: Text('Please enter OTP')),
                      //       );
                      //     } else {
                      //       _submit();
                      //     }
                      //   },
                      //   style: ElevatedButton.styleFrom(
                      //     backgroundColor: Colors.blue,
                      //     padding: const EdgeInsets.symmetric(vertical: 16),
                      //     shape: RoundedRectangleBorder(
                      //       borderRadius: BorderRadius.circular(12),
                      //     ),
                      //   ),
                      //   child: const Text(
                      //     "Verify OTP",
                      //     style: TextStyle(color: Colors.white),
                      //   ),
                      // )),
                    ],
                  ),
                  const SizedBox(height: 24),
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
                        return 'Password must be at least 8 characters, should contain atleas one numeric, capital letter, small letter, special character, ';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 24),
                  TextFormField(
                    controller: confirmPasswordController,
                    obscureText: isConfirmPasswordHidden,
                    decoration: InputDecoration(
                      labelText: "Confirm Password",
                      border: const OutlineInputBorder(),
                      suffixIcon: IconButton(
                        icon: Icon(
                          isConfirmPasswordHidden
                              ? Icons.visibility_off
                              : Icons.visibility,
                        ),
                        onPressed: () {
                          setState(() {
                            isConfirmPasswordHidden = !isConfirmPasswordHidden;
                          });
                        },
                      ),
                    ),
                    validator: (value) {
                      if (value != passwordController.text) {
                        return 'Password didn\'t match';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: isLoading ? null : _submit,
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
                              "Create account",
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
                        const Text("Already have an account? "),
                        GestureDetector(
                          onTap: () {
                            Navigator.pushReplacement(
                              context,
                              MaterialPageRoute(
                                  builder: (_) => const LoginPage()),
                            );
                          },
                          child: const Text(
                            "Log in",
                            style: TextStyle(
                              color: Colors.blue,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        )
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

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}
