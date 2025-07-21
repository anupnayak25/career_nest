import 'dart:math';

import 'package:career_nest/common/animated_appbar.dart';
import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:career_nest/student/common/list.dart';
import 'package:career_nest/student/models/quiz_model.dart';
import 'package:career_nest/student/models/programming_model.dart';
import 'package:career_nest/student/models/hr_model.dart';
import 'package:career_nest/student/models/technical_model.dart';

class TestsPage extends StatefulWidget {
  const TestsPage({super.key});

  @override
  State<TestsPage> createState() => _TestsPageState();
}

class _TestsPageState extends State<TestsPage> with TickerProviderStateMixin {
  late AnimationController _animationController;
  late List<Animation<Offset>> _slideAnimations;
  late List<Animation<double>> _fadeAnimations;

  final List<TestCategory> _testCategories = [
    TestCategory(
      title: 'QUIZ',
      subtitle: '15 Tests Available',
      completed: 7,
      icon: Icons.quiz,
      color: const Color(0xFFE1BEE7), // Light Purple
      page: const QuizAssignmentListPage(),
    ),
    TestCategory(
      title: 'Programming',
      subtitle: '12 Challenges',
      completed: 3,
      icon: Icons.code,
      color: const Color(0xFFBBDEFB), // Light Blue
      page: const ProgrammingAssignmentListPage(),
    ),
    TestCategory(
      title: 'HR Interview',
      subtitle: '8 Sessions',
      completed: 5,
      icon: Icons.people,
      color: const Color(0xFFFFF9C4), // Light Yellow
      page: const HrAssignmentListPage(),
    ),
    TestCategory(
      title: 'Technical',
      subtitle: '20 Topics',
      completed: 12,
      icon: Icons.engineering,
      color: const Color(0xFFC8E6C9), // Light Green
      page: const TechnicalAssignmentListPage(),
    ),
  ];

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );

    _slideAnimations = List.generate(
      _testCategories.length,
      (index) => Tween<Offset>(
        begin: const Offset(0, 1),
        end: Offset.zero,
      ).animate(
        CurvedAnimation(
          parent: _animationController,
          curve: Interval(
            index * 0.2,
            min(1.0, 0.8 + (index * 0.1)), // ✅ cap at 1.0
            curve: Curves.easeOutBack,
          ),
        ),
      ),
    );

    _fadeAnimations = List.generate(
      _testCategories.length,
      (index) => Tween<double>(
        begin: 0.0,
        end: 1.0,
      ).animate(
        CurvedAnimation(
          parent: _animationController,
          curve: Interval(
            index * 0.15,
            min(1.0, 0.7 + (index * 0.1)), // ✅ cap at 1.0
            curve: Curves.easeOut,
          ),
        ),
      ),
    );

    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      appBar: const AnimatedCurvedAppBar(title: 'Tests'),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 10),
            Expanded(
              child: ListView.builder(
                itemCount: _testCategories.length,
                itemBuilder: (context, index) {
                  return SlideTransition(
                    position: _slideAnimations[index],
                    child: FadeTransition(
                      opacity: _fadeAnimations[index],
                      child: _buildAnimatedTestCard(
                        context,
                        _testCategories[index],
                        index,
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAnimatedTestCard(
    BuildContext context,
    TestCategory category,
    int index,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: Material(
        borderRadius: BorderRadius.circular(16),
        elevation: 4,
        shadowColor: Colors.black.withOpacity(0.1),
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: () => _navigateToTest(context, category),
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: category.color,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: Colors.white.withOpacity(0.3),
                width: 1,
              ),
            ),
            child: Row(
              children: [
                // Icon Container
                Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.3),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    category.icon,
                    color: _getIconColor(category.color),
                    size: 28,
                  ),
                ),
                const SizedBox(width: 16),
                // Content
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        category.title,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.black87,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        category.subtitle,
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.black.withOpacity(0.6),
                        ),
                      ),
                    ],
                  ),
                ),
                // Completion Status
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      '${category.completed} Completed',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.black.withOpacity(0.7),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.4),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(
                        Icons.arrow_forward_ios,
                        size: 16,
                        color: Colors.black54,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Color _getIconColor(Color backgroundColor) {
    // Return darker shade of the background color for the icon
    final hsl = HSLColor.fromColor(backgroundColor);
    return hsl.withLightness(0.3).toColor();
  }

  void _navigateToTest(BuildContext context, TestCategory category) async {
    // Add a small scale animation on tap
    await _showTapAnimation();

    // bool granted = await checkPermissions();
    // if (granted) {
    if (mounted) {
      Navigator.push(
        context,
        PageRouteBuilder(
          pageBuilder: (context, animation, secondaryAnimation) =>
              category.page,
          transitionsBuilder: (context, animation, secondaryAnimation, child) {
            return SlideTransition(
              position: animation.drive(
                Tween(begin: const Offset(1.0, 0.0), end: Offset.zero)
                    .chain(CurveTween(curve: Curves.easeInOut)),
              ),
              child: child,
            );
          },
          transitionDuration: const Duration(milliseconds: 300),
        ),
      );
    }
    // } else {
    //   if (mounted) {
    //     ScaffoldMessenger.of(context).showSnackBar(
    //       const SnackBar(
    //         content: Text('Camera and Microphone permissions are required.'),
    //         backgroundColor: Colors.orange,
    //       ),
    //     );
    //   }
    // }
  }

  Future<void> _showTapAnimation() async {
    // Simple scale animation feedback
    await Future.delayed(const Duration(milliseconds: 100));
  }

  Future<bool> checkPermissions() async {
    if (await Permission.camera.isGranted &&
        await Permission.microphone.isGranted) {
      return true;
    } else {
      return requestCameraAndMicPermissions();
    }
  }

  Future<bool> requestCameraAndMicPermissions() async {
    final statuses = await [
      Permission.camera,
      Permission.microphone,
    ].request();

    return statuses.values.every((status) => status.isGranted);
  }
}

class TestCategory {
  final String title;
  final String subtitle;
  final int completed;
  final IconData icon;
  final Color color;
  final Widget page;

  TestCategory({
    required this.title,
    required this.subtitle,
    required this.completed,
    required this.icon,
    required this.color,
    required this.page,
  });
}

class QuizAssignmentListPage extends StatelessWidget {
  const QuizAssignmentListPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AssignmentListPage<QuizList, QuizQuestion>(
      type: 'quiz',
      fromJson: (json) => QuizList.fromJson(json),
      getTitle: (q) => q.title,
      getUploadDate: (q) => q.uploadDate,
      getDueDate: (q) => q.dueDate,
      getId: (q) => q.id,
      getTotalMarks: (q) => q.totalMarks,
      getQuestions: (q) => q.questions,
      questionBuilder: (question, idx, answer, onChanged) {
        return ListTile(
          title: Text('Q${question.qno}: ${question.question}'),
          subtitle: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ...question.options.map((opt) => RadioListTile<String>(
                    title: Text(opt),
                    value: opt,
                    groupValue: answer,
                    onChanged: onChanged,
                  )),
            ],
          ),
        );
      },
      questionResultBuilder: (question, result) {
        return ListTile(
          title: Text('Q${question.qno}: ${question.question}'),
          subtitle: Text('Your answer: ${result['answer'] ?? '-'}'),
        );
      },
      attemptButtonText: 'Attempt Quiz',
    );
  }
}

class ProgrammingAssignmentListPage extends StatelessWidget {
  const ProgrammingAssignmentListPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AssignmentListPage<ProgramingList, ProgrammingQuestion>(
      type: 'programming',
      fromJson: (json) => ProgramingList.fromJson(json),
      getTitle: (q) => q.title,
      getUploadDate: (q) => q.uploadDate,
      getDueDate: (q) => q.dueDate,
      getId: (q) => q.id,
      getTotalMarks: (q) => q.totalMarks,
      getQuestions: (q) => q.questions,
      questionBuilder: (question, idx, answer, onChanged) {
        return ListTile(
          title: Text('Q${question.qno}: ${question.question}'),
          subtitle: TextField(
            decoration: const InputDecoration(labelText: 'Your code'),
            onChanged: onChanged,
            maxLines: 4,
          ),
        );
      },
      questionResultBuilder: (question, result) {
        return ListTile(
          title: Text('Q${question.qno}: ${question.question}'),
          subtitle: Text('Your code: ${result['answer'] ?? '-'}'),
        );
      },
      attemptButtonText: 'Attempt Challenge',
    );
  }
}

class HrAssignmentListPage extends StatelessWidget {
  const HrAssignmentListPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AssignmentListPage<HrModel, Question>(
      type: 'hr',
      fromJson: (json) => HrModel.fromJson(json),
      getTitle: (q) => q.title,
      getUploadDate: (q) => q.uploadDate,
      getDueDate: (q) => q.dueDate,
      getId: (q) => int.tryParse(q.id) ?? 0,
      getTotalMarks: (q) => q.totalMarks,
      getQuestions: (q) => q.questions,
      questionBuilder: (question, idx, answer, onChanged) {
        return ListTile(
          title: Text('Q${question.qno}: ${question.question}'),
          subtitle: TextField(
            decoration: const InputDecoration(labelText: 'Your answer'),
            onChanged: onChanged,
          ),
        );
      },
      questionResultBuilder: (question, result) {
        return ListTile(
          title: Text('Q${question.qno}: ${question.question}'),
          subtitle: Text('Your answer: ${result['answer'] ?? '-'}'),
        );
      },
      attemptButtonText: 'Attempt HR',
    );
  }
}

class TechnicalAssignmentListPage extends StatelessWidget {
  const TechnicalAssignmentListPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AssignmentListPage<TechnicalItem, TechnicalQuestion>(
      type: 'technical',
      fromJson: (json) => TechnicalItem.fromJson(json),
      getTitle: (q) => q.title,
      getUploadDate: (q) => q.uploadDate,
      getDueDate: (q) => q.dueDate,
      getId: (q) => q.id,
      getTotalMarks: (q) => 0, // Add totalMarks to model if needed
      getQuestions: (q) => q.questions,
      questionBuilder: (question, idx, answer, onChanged) {
        return ListTile(
          title: Text('Q${question.qno}: ${question.question}'),
          subtitle: TextField(
            decoration: const InputDecoration(labelText: 'Your answer'),
            onChanged: onChanged,
          ),
        );
      },
      questionResultBuilder: (question, result) {
        return ListTile(
          title: Text('Q${question.qno}: ${question.question}'),
          subtitle: Text('Your answer: ${result['answer'] ?? '-'}'),
        );
      },
      attemptButtonText: 'Attempt Technical',
    );
  }
}
