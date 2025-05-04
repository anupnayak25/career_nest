import 'package:flutter/material.dart';
import '../services/auth_service.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  bool isLogin = true;
  final _formKey = GlobalKey<FormState>();

  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final rePasswordController = TextEditingController();
  final otpController = TextEditingController();
  String userType = 'student'; // default

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(isLogin ? "Login" : "Sign Up")),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              TextFormField(
                controller: emailController,
                decoration: const InputDecoration(labelText: 'Email ID'),
                validator: (value) => value!.isEmpty ? 'Enter email' : null,
              ),
              const SizedBox(height: 10),
              if (!isLogin) ...[
                TextFormField(
                  controller: otpController,
                  decoration: const InputDecoration(labelText: 'OTP'),
                  validator: (value) => value!.isEmpty ? 'Enter OTP' : null,
                ),
                const SizedBox(height: 10),
              ],
              TextFormField(
                controller: passwordController,
                decoration: const InputDecoration(labelText: 'Password'),
                obscureText: true,
                validator: (value) => value!.isEmpty ? 'Enter password' : null,
              ),
              const SizedBox(height: 10),
              if (!isLogin) ...[
                TextFormField(
                  controller: rePasswordController,
                  decoration: const InputDecoration(labelText: 'Re-enter Password'),
                  obscureText: true,
                  validator: (value) {
                    if (value != passwordController.text) {
                      return 'Passwords do not match';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 10),
                DropdownButtonFormField<String>(
                  value: userType,
                  items: const [
                    DropdownMenuItem(child: Text('Student'), value: 'student'),
                    DropdownMenuItem(child: Text('Teacher'), value: 'teacher'),
                  ],
                  onChanged: (value) {
                    setState(() {
                      userType = value!;
                    });
                  },
                  decoration: const InputDecoration(labelText: 'User Type'),
                ),
                const SizedBox(height: 10),
              ],
              ElevatedButton(
                onPressed: () async {
                  if (_formKey.currentState!.validate()) {
                    if (isLogin) {
                      await AuthService.login(emailController.text, passwordController.text, context);
                    } else {
                      await AuthService.signup(
                        emailController.text,
                        otpController.text,
                        passwordController.text,
                        userType,
                        context,
                      );
                    }
                  }
                },
                child: Text(isLogin ? 'Login' : 'Create Account'),
              ),
              const SizedBox(height: 20),
              TextButton(
                onPressed: () {
                  setState(() {
                    isLogin = !isLogin;
                  });
                },
                child: Text(isLogin ? 'Don\'t have an account? Sign up' : 'Already have an account? Login'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
