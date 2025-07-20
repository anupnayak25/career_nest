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
import 'theme.dart';

class SignUpPage extends StatefulWidget {
  const SignUpPage({super.key});

  @override
  State<SignUpPage> createState() => _SignUpPageState();
}

class _SignUpPageState extends State<SignUpPage> with TickerProviderStateMixin {
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

  // Animation controllers
  late AnimationController _slideController;
  late AnimationController _fadeController;
  late Animation<Offset> _slideAnimation;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _slideController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );

    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.3),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _slideController,
      curve: Curves.easeOutBack,
    ));

    _fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _fadeController,
      curve: Curves.easeIn,
    ));

    _slideController.forward();
    _fadeController.forward();
  }

  @override
  void dispose() {
    _timer?.cancel();
    _slideController.dispose();
    _fadeController.dispose();
    super.dispose();
  }

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
      _showSnackBar('Please verify your email with OTP first', isError: true);
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

      // print(response.body);

      if (response.statusCode == 201) {
        final responseData = json.decode(response.body);
        await prefs.setString('auth_token', responseData['auth_token']);
        await prefs.setString('userType', userType);
        await prefs.setString('userName', responseData['name']);
        await prefs.setString('userEmail', responseData['email']);
        await prefs.setString('userId', responseData['id']);
        await prefs.setBool('isLoggedIn', true);

        _showSnackBar('Account created! 🎉', isSuccess: true);

        if (userType == 'student') {
          Navigator.pushReplacement(context,
              MaterialPageRoute(builder: (_) => const DashboardPage()));
        } else {
          Navigator.pushReplacement(context,
              MaterialPageRoute(builder: (_) => const AdminDashboardPage()));
        }
      } else if (response.statusCode == 401) {
        _showSnackBar('Invalid OTP.. Try again later..', isError: true);
        // print(response.body);
        _otpController.text = "";
      } else if ([400, 409].contains(response.statusCode)) {
        final responseData = json.decode(response.body);
        if (responseData['errors'] != null && responseData['errors'] is List) {
          final messages = (responseData['errors'] as List)
              .map((e) => e['message'])
              .join('\n');
          _showSnackBar(messages, isError: true);
        } else if (responseData['error'] != null) {
          _showSnackBar(responseData['error'], isError: true);
        } else {
          _showSnackBar('Invalid input', isError: true);
        }
      } else {
        // print(response.body);
        // print(response.statusCode);
        _showSnackBar('Something went wrong.. Try again later..',
            isError: true);
      }

      setState(() {
        isLoading = false;
      });
    }
  }

  void _getOtp() async {
    if (!_isValidEmail(emailController.text, context)) {
      _showSnackBar('Please enter a valid email', isError: true);
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
      _showSnackBar('OTP sent successfully 🎉', isSuccess: true);
      _startOtpTimer();
    } else {
      _showSnackBar('Failed to send OTP: ${response.body}', isError: true);
      print(response.body);
      _timer?.cancel();
      setState(() {
        _secondsRemaining = 0;
      });
    }
  }

  _verifyOtp() async {
    if (_otpController.text.isEmpty) {
      _showSnackBar('Please enter OTP', isError: true);
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

        _showSnackBar(
          responseData['message'] ?? 'Email verified successfully! ✅',
          isSuccess: true,
        );
      } else {
        final responseData = jsonDecode(response.body);
        String errorMsg = 'Verification failed';

        if (responseData['error'] != null) {
          errorMsg = responseData['error'];
        } else if (responseData['errors'] != null) {
          errorMsg = responseData['errors'][0]['message'];
        }

        _showSnackBar(errorMsg, isError: true);
      }
      isLoading = false;
    } catch (e) {
      setState(() {
        isLoading = false;
      });
      print('Exception: $e');
      _showSnackBar('Network error occurred', isError: true);
    }
  }

  void _showSnackBar(String message,
      {bool isError = false, bool isSuccess = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(
              isSuccess
                  ? Icons.check_circle
                  : (isError ? Icons.error : Icons.info),
              color: Colors.white,
              size: 20,
            ),
            const SizedBox(width: 8),
            Expanded(child: Text(message)),
          ],
        ),
        backgroundColor: isSuccess
            ? Colors.green[600]
            : (isError ? Colors.red[600] : Colors.blue[600]),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        margin: const EdgeInsets.all(16),
      ),
    );
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
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            title: const Row(
              children: [
                Icon(Icons.error_outline, color: Colors.red),
                SizedBox(width: 8),
                Text("Invalid Email"),
              ],
            ),
            content: const Text(
                "Please use an email provided by your college (nmamit or nitte)."),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(ctx).pop(),
                style: TextButton.styleFrom(
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: const Text("OK"),
              ),
            ],
          ),
        );
        return false;
      }
      if (domain != "nitte") {
        userType = "student";
      } else {
        userType = "admin";
      }

      return true;
    } catch (e) {
      return false;
    }
  }

  Widget _buildCustomTextField({
    required TextEditingController controller,
    required String label,
    required String? Function(String?) validator,
    bool obscureText = false,
    bool? passwordToggle,
    VoidCallback? onTogglePassword,
    Widget? suffixIcon,
    bool enabled = true,
    TextInputType? keyboardType,
    List<TextInputFormatter>? inputFormatters,
    int? maxLength,
  }) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: TextFormField(
        controller: controller,
        validator: validator,
        obscureText: obscureText,
        enabled: enabled,
        keyboardType: keyboardType,
        inputFormatters: inputFormatters,
        maxLength: maxLength,
        style: TextStyle(
          fontSize: 16,
          color: enabled ? Colors.black87 : Colors.grey[600],
        ),
        decoration: InputDecoration(
          labelText: label,
          labelStyle: TextStyle(
            color: enabled ? Colors.grey[700] : Colors.grey[500],
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
          filled: true,
          fillColor: enabled ? Colors.white : Colors.grey[50],
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide.none,
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(color: Colors.grey[300]!, width: 1),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: Colors.blue, width: 2),
          ),
          errorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: Colors.red, width: 1),
          ),
          suffixIcon: passwordToggle != null
              ? IconButton(
                  icon: Icon(
                    passwordToggle ? Icons.visibility_off : Icons.visibility,
                    color: Colors.grey[600],
                  ),
                  onPressed: onTogglePassword,
                )
              : suffixIcon,
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 15, vertical: 18),
          counterText: maxLength != null ? '' : null,
        ),
      ),
    );
  }

  Widget _buildGradientButton({
    required String text,
    required VoidCallback? onPressed,
    bool isLoading = false,
    List<Color>? colors,
    double? width,
    EdgeInsets? padding,
  }) {
    return Container(
      width: width,
      height: 56,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        gradient: LinearGradient(
          colors: colors ?? [Colors.blue[700]!, Colors.blue[500]!],
          begin: Alignment.centerLeft,
          end: Alignment.centerRight,
        ),
        boxShadow: [
          BoxShadow(
            color: (colors?.first ?? Colors.blue).withOpacity(0.3),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onPressed,
          borderRadius: BorderRadius.circular(16),
          child: Container(
            padding: padding ??
                const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Center(
              child: isLoading
                  ? const SizedBox(
                      width: 24,
                      height: 24,
                      child: CircularProgressIndicator(
                        color: Colors.white,
                        strokeWidth: 2,
                      ),
                    )
                  : Text(
                      text,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
            ),
          ),
        ),
      ),
    );
  }

  String? validateEmail(String email) {
    final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    if (!emailRegex.hasMatch(email)) {
      return 'Invalid email';
    }
    return null;
  }

  String? validatePassword(String password) {
    if (password.length < 8) {
      return 'At least 8 characters required';
    }
    if (!RegExp(r'[A-Z]').hasMatch(password)) {
      return 'Must contain at least one uppercase letter';
    }
    if (!RegExp(r'[a-z]').hasMatch(password)) {
      return 'Must contain at least one lowercase letter';
    }
    if (!RegExp(r'[0-9]').hasMatch(password)) {
      return 'Must contain at least one number';
    }
// if (!RegExp(r'[!@#\$%^&*()_\+\-=\[\]{};\'":\\|,.<>\/?]').hasMatch(password)) {
//   return 'Must contain at least one special character';
// }

    return null;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            child: FadeTransition(
              opacity: _fadeAnimation,
              child: SlideTransition(
                position: _slideAnimation,
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 24),
                  padding: const EdgeInsets.all(32),
                  decoration: BoxDecoration(
                    color: AppColors.card,
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.08),
                        blurRadius: 30,
                        offset: const Offset(0, 15),
                      ),
                    ],
                  ),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        // Header
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(16),
                              decoration: const BoxDecoration(
                                gradient: LinearGradient(
                                  colors: AppColors.mainGradient,
                                ),
                                borderRadius:
                                    BorderRadius.all(Radius.circular(16)),
                              ),
                              child: const Icon(
                                Icons.person_add_rounded,
                                color: Colors.white,
                                size: 32,
                              ),
                            ),
                            const SizedBox(width: 16),
                            const Text(
                              "Create Account",
                              style: AppTextStyles.headline,
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),

                        // Email verification section
                        AnimatedContainer(
                          duration: const Duration(milliseconds: 500),
                          child: Column(
                            children: [
                              if (!isOtpVerified) ...[
                                // Email field with Get OTP button
                                Row(
                                  children: [
                                    Expanded(
                                      flex: 3,
                                      child: _buildCustomTextField(
                                        controller: emailController,
                                        label: "College Email",
                                        validator: (value) {
                                          if (value == null || value.isEmpty) {
                                            return 'Please enter email';
                                          } else if (!_isValidEmail(
                                              value, context)) {
                                            return 'Please enter a valid college email';
                                          }
                                          return null;
                                        },
                                      ),
                                    ),
                                    const SizedBox(width: 12),
                                    SizedBox(
                                      width: 100,
                                      child: _buildGradientButton(
                                        text: _secondsRemaining > 0
                                            ? '$_secondsRemaining'
                                            : 'Get OTP',
                                        onPressed:
                                            (isLoading || _secondsRemaining > 0)
                                                ? null
                                                : _getOtp,
                                        colors: _secondsRemaining > 0
                                            ? [
                                                Colors.grey[400]!,
                                                Colors.grey[500]!
                                              ]
                                            : [
                                                Colors.green[600]!,
                                                Colors.green[500]!
                                              ],
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 20),

                                // OTP field with Verify button
                                Row(
                                  children: [
                                    Expanded(
                                      flex: 3,
                                      child: _buildCustomTextField(
                                        controller: _otpController,
                                        label: "Enter OTP",
                                        keyboardType: TextInputType.number,
                                        maxLength: 6,
                                        inputFormatters: [
                                          FilteringTextInputFormatter
                                              .digitsOnly,
                                          LengthLimitingTextInputFormatter(6),
                                        ],
                                        validator: (value) =>
                                            null, // No validation needed
                                      ),
                                    ),
                                    const SizedBox(width: 12),
                                    SizedBox(
                                      width: 100,
                                      child: _buildGradientButton(
                                        text: 'Verify',
                                        onPressed:
                                            isLoading ? null : _verifyOtp,
                                        isLoading: isLoading,
                                        colors: [
                                          Colors.blue[700]!,
                                          Colors.blue[500]!
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ] else ...[
                                // Verification success card
                                Container(
                                  width: double.infinity,
                                  padding: const EdgeInsets.all(20),
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      colors: [
                                        Colors.green[50]!,
                                        Colors.green[100]!
                                      ],
                                    ),
                                    border:
                                        Border.all(color: Colors.green[300]!),
                                    borderRadius: BorderRadius.circular(16),
                                  ),
                                  child: Row(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.all(8),
                                        decoration: BoxDecoration(
                                          color: Colors.green,
                                          borderRadius:
                                              BorderRadius.circular(12),
                                        ),
                                        child: const Icon(
                                          Icons.check,
                                          color: Colors.white,
                                          size: 20,
                                        ),
                                      ),
                                      const SizedBox(width: 16),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              "Email Verified!",
                                              style: TextStyle(
                                                color: Colors.green[800],
                                                fontWeight: FontWeight.bold,
                                                fontSize: 16,
                                              ),
                                            ),
                                            Text(
                                              emailController.text,
                                              style: TextStyle(
                                                color: Colors.green[700],
                                                fontSize: 14,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),
                        const SizedBox(height: 32),

                        // Rest of the form fields
                        _buildCustomTextField(
                          controller: nameController,
                          label: "Full Name",
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter your name';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 24),

                        _buildCustomTextField(
                          controller: passwordController,
                          label: "Password",
                          obscureText: isPasswordHidden,
                          passwordToggle: isPasswordHidden,
                          onTogglePassword: () {
                            setState(() {
                              isPasswordHidden = !isPasswordHidden;
                            });
                          },
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter password';
                            } else if (value.length < 8) {
                              return 'Password must be at least 8 characters, should contain at least one numeric, capital letter, small letter, special character';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 24),

                        _buildCustomTextField(
                          controller: confirmPasswordController,
                          label: "Confirm Password",
                          obscureText: isConfirmPasswordHidden,
                          passwordToggle: isConfirmPasswordHidden,
                          onTogglePassword: () {
                            setState(() {
                              isConfirmPasswordHidden =
                                  !isConfirmPasswordHidden;
                            });
                          },
                          validator: (value) {
                            if (value != passwordController.text) {
                              return 'Password didn\'t match';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 40),

                        // Create account button
                        _buildGradientButton(
                          text: "Create Account",
                          onPressed: isLoading ? null : _submit,
                          isLoading: isLoading,
                          width: double.infinity,
                          colors: AppColors.mainGradient,
                        ),
                        const SizedBox(height: 24),

                        // Login link
                        Center(
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                "Already have an account? ",
                                style: TextStyle(
                                  color: Colors.grey[600],
                                  fontSize: 16,
                                ),
                              ),
                              GestureDetector(
                                onTap: () {
                                  Navigator.pushReplacement(
                                    context,
                                    MaterialPageRoute(
                                        builder: (_) => const LoginPage()),
                                  );
                                },
                                child: Text(
                                  "Sign In",
                                  style: AppTextStyles.button
                                      .copyWith(color: AppColors.primary),
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
          ),
        ),
      ),
    );
  }
}
