import 'package:career_nest/student/dashboard.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:career_nest/student/common/service.dart';
import 'package:career_nest/common/theme.dart';
import '../admin/dashboard.dart';
import 'login.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with TickerProviderStateMixin {
  late AnimationController _logoController;
  late AnimationController _progressController;
  late AnimationController _textController;
  late Animation<double> _logoAnimation;
  late Animation<double> _progressAnimation;
  late Animation<double> _textAnimation;

  String _statusText = 'Initializing...';
  double _progress = 0.0;
  bool _showRetryButton = false;
  int _retryCount = 0;

  final List<String> _loadingMessages = [
    'Connecting to server...',
    'Checking network status...',
    'Loading your data...',
    'Almost ready...',
  ];

  @override
  void initState() {
    super.initState();
    _initializeAnimations();
    _startLoadingSequence();
  }

  void _initializeAnimations() {
    _logoController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );

    _progressController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );

    _textController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );

    _logoAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _logoController, curve: Curves.elasticOut),
    );

    _progressAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _progressController, curve: Curves.easeInOut),
    );

    _textAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _textController, curve: Curves.easeIn),
    );

    _logoController.forward();
  }

  void _startLoadingSequence() async {
    // Start progress animation
    _progressController.forward();

    // Animate through loading messages
    for (int i = 0; i < _loadingMessages.length; i++) {
      if (!mounted) return;

      setState(() {
        _statusText = _loadingMessages[i];
        _progress = (i + 1) / _loadingMessages.length * 0.8; // 80% for messages
      });

      _textController.reset();
      _textController.forward();

      await Future.delayed(const Duration(milliseconds: 800));
    }

    // Try to connect to server
    await _attemptServerConnection();
  }

  Future<void> _attemptServerConnection() async {
    try {
      setState(() {
        _statusText = 'Connecting to server...';
        _progress = 0.9;
      });

      await AssignmentService.pingServer();

      setState(() {
        _statusText = 'Connected! Loading...';
        _progress = 1.0;
      });

      await Future.delayed(const Duration(milliseconds: 500));
      await _navigateToNextScreen();
    } catch (e) {
      _retryCount++;
      setState(() {
        _statusText = 'Connection failed. Please check your internet.';
        _showRetryButton = true;
        _progress = 0.0;
      });
    }
  }

  Future<void> _navigateToNextScreen() async {
    final prefs = await SharedPreferences.getInstance();
    final isLoggedIn = prefs.getBool('isLoggedIn') ?? false;
    final userType = prefs.getString('userType') ?? '';

    if (!mounted) return;

    if (isLoggedIn) {
      if (userType == 'student') {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const DashboardPage()),
        );
      } else if (userType == 'admin') {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const AdminDashboardPage()),
        );
      } else {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const LoginPage()),
        );
      }
    } else {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const LoginPage()),
      );
    }
  }

  void _retry() {
    setState(() {
      _showRetryButton = false;
      _progress = 0.0;
      _statusText = 'Retrying...';
    });
    _startLoadingSequence();
  }

  void _skipToLogin() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const LoginPage()),
    );
  }

  @override
  void dispose() {
    _logoController.dispose();
    _progressController.dispose();
    _textController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(32.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Spacer(flex: 2),

              // Animated Logo
              AnimatedBuilder(
                animation: _logoAnimation,
                builder: (context, child) {
                  return Transform.scale(
                    scale: _logoAnimation.value,
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(75),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.primary.withOpacity(0.3),
                            blurRadius: 20,
                            spreadRadius: 5,
                          ),
                        ],
                      ),
                      child: const Image(
                        image: AssetImage('assets/logo.png'),
                        height: 150,
                      ),
                    ),
                  );
                },
              ),

              const SizedBox(height: 40),

              // App Name with animation
              AnimatedBuilder(
                animation: _textAnimation,
                builder: (context, child) {
                  return Opacity(
                    opacity: _textAnimation.value,
                    child: Text(
                      'CareerNest',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: AppColors.primary,
                      ),
                    ),
                  );
                },
              ),

              const SizedBox(height: 60),

              // Progress Indicator
              if (!_showRetryButton) ...[
                SizedBox(
                  width: double.infinity,
                  child: Column(
                    children: [
                      LinearProgressIndicator(
                        value: _progress,
                        backgroundColor: AppColors.border,
                        valueColor: AlwaysStoppedAnimation<Color>(
                          AppColors.primary,
                        ),
                        minHeight: 6,
                      ),
                      const SizedBox(height: 20),
                      AnimatedBuilder(
                        animation: _textAnimation,
                        builder: (context, child) {
                          return Opacity(
                            opacity: _textAnimation.value,
                            child: Text(
                              _statusText,
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w500,
                                color: AppColors.textSecondary,
                              ),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ),
              ],

              // Retry Section
              if (_showRetryButton) ...[
                Column(
                  children: [
                    Icon(
                      Icons.cloud_off,
                      size: 64,
                      color: AppColors.error.withOpacity(0.7),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      _statusText,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 16,
                        color: AppColors.error,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        ElevatedButton.icon(
                          onPressed: _retry,
                          icon: const Icon(Icons.refresh),
                          label: Text('Retry ($_retryCount)'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 24,
                              vertical: 12,
                            ),
                          ),
                        ),
                        OutlinedButton.icon(
                          onPressed: _skipToLogin,
                          icon: const Icon(Icons.skip_next),
                          label: const Text('Skip'),
                          style: OutlinedButton.styleFrom(
                            foregroundColor: AppColors.primary,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 24,
                              vertical: 12,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ],

              const Spacer(flex: 3),

              // Footer
              Text(
                'Version 1.0.0',
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[500],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
