// StatelessWidget for the Account screen, displaying user profile information and options.
import 'package:career_nest/common/animated_appbar.dart';
import 'package:career_nest/common/login.dart';
import 'package:career_nest/common/theme.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AccountPage extends StatefulWidget {
  final String userName;
  const AccountPage({super.key, required this.userName});

  @override
  State<AccountPage> createState() => _AccountPageState();
}

class _AccountPageState extends State<AccountPage> {
  // Local state populated from SharedPreferences
  String? _name;
  String? _email;
  String? _userType;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadProfileDetails();
  }

  Future<void> _loadProfileDetails() async {
    final prefs = await SharedPreferences.getInstance();
    // Keys set at login across the app
    final name = prefs.getString('userName');
    final email = prefs.getString('userEmail');
    final type = prefs.getString('userType');
    if (!mounted) return;
    setState(() {
      _name = name?.trim().isNotEmpty == true ? name : widget.userName;
      _email = email;
      _userType = type;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    // Account options (Favourite and Help removed per request)
    final List<String> options = [
      'Edit Account',
      'Settings and Privacy',
      'Logout',
    ];

    return Scaffold(
      appBar: AnimatedCurvedAppBar(title: "Profile"),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Display user profile information at the top.
            Center(
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 40,
                    backgroundColor: AppColors.primary,
                    child: Icon(
                      Icons.person,
                      size: 40,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 10),
                  if (_loading)
                    const SizedBox(
                      height: 22,
                      width: 22,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  else
                    Column(
                      children: [
                        Text(
                          _name ?? widget.userName,
                          style: AppTextStyles.titleLarge(context),
                          textAlign: TextAlign.center,
                        ),
                        if (_email != null && _email!.isNotEmpty)
                          Padding(
                            padding: const EdgeInsets.only(top: 6.0),
                            child: Text(
                              _email!,
                              style: AppTextStyles.bodyMedium(context)
                                  .copyWith(color: Colors.grey[700]),
                            ),
                          ),
                        if (_userType != null && _userType!.isNotEmpty)
                          Padding(
                            padding: const EdgeInsets.only(top: 2.0),
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                  vertical: 4, horizontal: 10),
                              decoration: BoxDecoration(
                                color: AppColors.primary.withOpacity(0.08),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Text(
                                _userType!,
                                style: AppTextStyles.bodySmall(context)
                                    .copyWith(color: AppColors.primary),
                              ),
                            ),
                          ),
                      ],
                    ),
                ],
              ),
            ),
            const SizedBox(height: 30),
            // Build a list of account option cards.
            ...options.map((option) => _buildAccountOption(context, option)),
          ],
        ),
      ),
    );
  }

  // Helper function to build a reusable account option card.
  Widget _buildAccountOption(BuildContext context, String title) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      margin: const EdgeInsets.only(bottom: 10),
      child: ListTile(
        title: Text(title, style: const TextStyle(fontSize: 18)),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
        onTap: () async {
          if (title == "Logout") {
            final prefs = await SharedPreferences.getInstance();
            await prefs.setString('auth_token', "");
            await prefs.setString('userType', "");
            await prefs.setString('userName', "");
            await prefs.setString('userEmail', "");
            await prefs.setBool('isLoggedIn', false);
            Navigator.pushAndRemoveUntil(
              context,
              MaterialPageRoute(builder: (_) => const LoginPage()),
              (Route<dynamic> route) => false,
            );
          } else if (title == "Edit Account") {
            // Placeholder: later wire this to a screen calling /authenticate/update-details
            if (context.mounted) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Edit Account coming soon')),
              );
            }
          } else if (title == "Settings and Privacy") {
            if (context.mounted) {
              showDialog(
                context: context,
                builder: (ctx) => AlertDialog(
                  title: const Text('Privacy'),
                  content: const Text(
                    'Your basic profile details are stored locally after sign-in. You can log out to clear them.',
                  ),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.of(ctx).pop(),
                      child: const Text('Close'),
                    ),
                  ],
                ),
              );
            }
          } else {
            // Fallback
            debugPrint('$title tapped');
          }
        },
      ),
    );
  }
}
