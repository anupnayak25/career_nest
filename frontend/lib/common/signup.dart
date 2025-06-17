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

class _SignUpPageState extends State<SignUpPage> {
  final _formKey = GlobalKey<FormState>();
  final emailController = TextEditingController();
  final nameController = TextEditingController();
  final passwordController = TextEditingController();
  final confirmPasswordController = TextEditingController();
  bool isPasswordHidden = true;
  bool isConfirmPasswordHidden = true;
  bool isLoading = false;
  var userType = "";
  final TextEditingController _otpController = TextEditingController();
  int _secondsRemaining = 0;
  Timer? _timer;
  
  // Add the boolean for OTP verification status
  bool isOtpVerified = false;

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

  void _submit() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    
    // Check if OTP is verified before allowing signup
    if (!isOtpVerified) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please verify your email with OTP first')),
      );
      return;
    }
    
    if (_formKey.currentState!.validate()) {
      setState(() {
        isLoading = true;
      });

      // Simulate network request
      await Future.delayed(const Duration(seconds: 2));

      final apiUrl = dotenv.get('API_URL');
      final response =
          await http.post(Uri.parse('$apiUrl/api/auth/signup'), body: {
        'name': nameController.text,
        'email': emailController.text,
        'password': passwordController.text,
        'userType': userType,
      });

      print(response.body);

      if (response.statusCode == 201) {
        final responseData = json.decode(response.body);
        await prefs.setString('auth_token', responseData['auth_token']);
        await prefs.setString('userType', userType);
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
    }
  }

  void _getOtp() async {
    if (!_isValidEmail(emailController.text, context)) {
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
      _startOtpTimer();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to send OTP: ${response.body}')),
      );
      print(response.body);
      _timer?.cancel();
      setState(() {
        _secondsRemaining = 0;
      });
    }
  }

  _verifyOtp() async {
    if (_otpController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter OTP')),
      );
      return;
    }

    setState(() {
      isLoading = true;
    });

    try {
      final apiUrl = dotenv.get('API_URL');
      final response = await http.post(
        Uri.parse('$apiUrl/api/auth/verify-otp'),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: {
          'email': emailController.text,
          'otp': _otpController.text,
        },
      );

      setState(() {
        isLoading = false;
      });

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);
        
        // Set OTP as verified and stop timer
        setState(() {
          isOtpVerified = true;
        });
        _timer?.cancel();
        
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(responseData['message'] ?? 'Email verified successfully! ✅'),
            backgroundColor: Colors.green,
          ),
        );
      } else {
        final responseData = jsonDecode(response.body);
        String errorMsg = 'Verification failed';
        
        if (responseData['error'] != null) {
          errorMsg = responseData['error'];
        } else if (responseData['errors'] != null) {
          errorMsg = responseData['errors'][0]['message'];
        }
        
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(errorMsg)),
        );
      }
    } catch (e) {
      setState(() {
        isLoading = false;
      });
      print('Exception: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Network error occurred')),
      );
    }
  }

  bool _isValidEmail(String email, BuildContext context) {
    final emailRegex = RegExp(r"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$");
    if (!emailRegex.hasMatch(email)) {
      return false;
    }

    try {
      final domain = email.split('@')[1].split('.')[0].toLowerCase();

      if (domain != "nmamit" && domain != "nitte") {
        showDialog(
          context: context,
          builder: (ctx) => AlertDialog(
            title: Text("Invalid Email"),
            content: Text(
                "Please use an email provided by your college (nmamit or nitte)."),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(ctx).pop(),
                child: Text("OK"),
              ),
            ],
          ),
        );
        return false;
      }
      if(domain !="nitte"){
          userType = "student";
      }else{
          userType = "admin";
      }

      return true;
    } catch (e) {
      return false;
    }
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
                  
                  // Email field - disabled after verification
                  TextFormField(
                    controller: emailController,
                    enabled: !isOtpVerified, // Disable when OTP is verified
                    decoration: InputDecoration(
                      labelText: "Your Email",
                      border: const OutlineInputBorder(),
                      // Show verification status
                      suffixIcon: isOtpVerified 
                        ? const Icon(Icons.check_circle, color: Colors.green)
                        : null,
                      // Change colors when disabled
                      fillColor: isOtpVerified ? Colors.green[50] : null,
                      filled: isOtpVerified,
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter email';
                      } else if (!_isValidEmail(value, context)) {
                        return 'Please enter a valid email';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 24),
                  
                  // Show OTP section only if not verified
                  if (!isOtpVerified) ...[
                    TextField(
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
                    const SizedBox(height: 20),
                    
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        ElevatedButton(
                          // Disable when: invalid email, loading, or timer is running
                          onPressed: (
                                     isLoading || 
                                     _secondsRemaining > 0) ? null : _getOtp,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.blue[700],
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
                        ElevatedButton(
                          onPressed: isLoading ? null : () {
                            if (_otpController.text.isEmpty) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                    content: Text('Please enter OTP')),
                              );
                            } else {
                              _verifyOtp();
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.blue[900],
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: isLoading 
                            ? const SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(
                                  color: Colors.white,
                                  strokeWidth: 2,
                                ),
                              )
                            : const Text(
                                "Verify OTP",
                                style: TextStyle(color: Colors.white),
                              ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                  ],
                  
                  // Show verification success message
                  if (isOtpVerified) ...[
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(12),
                      margin: const EdgeInsets.only(bottom: 24),
                      decoration: BoxDecoration(
                        color: Colors.green[50],
                        border: Border.all(color: Colors.green),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        children: [
                          Icon(Icons.check_circle, color: Colors.green),
                          const SizedBox(width: 8),
                          Text(
                            "Email verified successfully!",
                            style: TextStyle(
                              color: Colors.green[700],
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],

                  TextFormField(
                    controller: nameController,
                    decoration: InputDecoration(
                      labelText: "Name",
                      border: const OutlineInputBorder(),
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter your name';
                      }
                      return null;
                    },
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