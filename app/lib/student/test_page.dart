import 'package:career_nest/common/animated_appbar.dart';
import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:career_nest/student/common/list.dart';
import 'package:career_nest/student/models/quiz_model.dart';
import 'package:career_nest/student/models/programming_model.dart';
import 'package:career_nest/student/models/hr_model.dart';
import 'package:career_nest/student/models/technical_model.dart';
import 'package:career_nest/student/common/service.dart';
import 'package:career_nest/common/theme.dart';

class TestsPage extends StatefulWidget {
  const TestsPage({super.key});

  @override
  State<TestsPage> createState() => _TestsPageState();
}

class _TestsPageState extends State<TestsPage> with TickerProviderStateMixin {
  late Future<List<TestCategory>> _categoriesFuture;
  late AnimationController _animationController;
  late List<Animation<Offset>> _slideAnimations;
  late List<Animation<double>> _fadeAnimations;

  @override
  void initState() {
    super.initState();
    _categoriesFuture = _loadCategories();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );
  }

  Future<List<TestCategory>> _loadCategories(
      {bool isManualRefresh = false}) async {
    // No need to show loading indicator here as RefreshIndicator handles it
    print('📊 [_loadCategories] Starting to load categories...');

    try {
      print(
          '📊 [_loadCategories] Fetching all assignments and attempts in parallel...');
      final results = await Future.wait([
        AssignmentService.fetchList<QuizList>(
            'quiz', (json) => QuizList.fromJson(json)),
        AssignmentService.fetchAttempted('quiz'),
        AssignmentService.fetchList<ProgramingList>(
            'programming', (json) => ProgramingList.fromJson(json)),
        AssignmentService.fetchAttempted('programming'),
        AssignmentService.fetchList<HrModel>(
            'hr', (json) => HrModel.fromJson(json)),
        AssignmentService.fetchAttempted('hr'),
        AssignmentService.fetchList<TechnicalItem>(
            'technical', (json) => TechnicalItem.fromJson(json)),
        AssignmentService.fetchAttempted('technical'),
      ]);

      final quizAssignments = results[0] as List<QuizList>;
      final quizAttempted = results[1] as List;
      final programmingAssignments = results[2] as List<ProgramingList>;
      final programmingAttempted = results[3] as List;
      final hrAssignments = results[4] as List<HrModel>;
      final hrAttempted = results[5] as List;
      final technicalAssignments = results[6] as List<TechnicalItem>;
      final technicalAttempted = results[7] as List;

      final categories = [
        TestCategory(
          title: 'QUIZ',
          subtitle: '${quizAssignments.length} Tests Available',
          completed: quizAttempted.length,
          icon: Icons.quiz,
          page: const QuizAssignmentListPage(),
        ),
        TestCategory(
          title: 'Programming',
          subtitle: '${programmingAssignments.length} Challenges',
          completed: programmingAttempted.length,
          icon: Icons.code,
          page: const ProgrammingAssignmentListPage(),
        ),
        TestCategory(
          title: 'HR Interview',
          subtitle: '${hrAssignments.length} Sessions',
          completed: hrAttempted.length,
          icon: Icons.people,
          page: const HrAssignmentListPage(),
        ),
        TestCategory(
          title: 'Technical',
          subtitle: '${technicalAssignments.length} Topics',
          completed: technicalAttempted.length,
          icon: Icons.engineering,
          page: const TechnicalAssignmentListPage(),
        ),
      ];

      print('📊 [_loadCategories] ✅ Categories created successfully:');
      for (var category in categories) {
        print('   - ${category.title}: ${category.completed} completed');
      }

      return categories;
    } catch (e, stackTrace) {
      print('💥 [_loadCategories] Error loading categories: $e');
      print('💥 [_loadCategories] Stack trace: $stackTrace');
      rethrow;
    }
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: const AnimatedCurvedAppBar(title: 'Tests'),
      body: RefreshIndicator(
        onRefresh: () async {
          // Ensure the indicator stays visible until data is fetched
          final data = await _loadCategories(isManualRefresh: true);
          if (!mounted) return;
          setState(() {
            // Immediately provide the fetched data to the FutureBuilder
            _categoriesFuture = Future.value(data);
          });
        },
        child: FutureBuilder<List<TestCategory>>(
          future: _categoriesFuture,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              // Keep it scrollable so pull-to-refresh works even when loading
              return ListView(
                physics: const AlwaysScrollableScrollPhysics(),
                children: const [
                  SizedBox(height: 200),
                  Center(child: CircularProgressIndicator()),
                  SizedBox(height: 200),
                ],
              );
            }

            if (snapshot.hasError) {
              // Wrap in a scrollable so pull-to-refresh is enabled on error
              return ListView(
                physics: const AlwaysScrollableScrollPhysics(),
                children: [
                  SizedBox(height: MediaQuery.of(context).size.height * 0.25),
                  Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.error_outline,
                          size: 64,
                          color: Colors.grey[400],
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Error loading tests',
                          style: TextStyle(
                            fontSize: 18,
                            color: Colors.grey[600],
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Pull down to refresh',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[500],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              );
            }

            if (!snapshot.hasData || snapshot.data!.isEmpty) {
              // Wrap in a scrollable so pull-to-refresh is enabled when empty
              return ListView(
                physics: const AlwaysScrollableScrollPhysics(),
                children: [
                  SizedBox(height: MediaQuery.of(context).size.height * 0.25),
                  Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.assignment_outlined,
                          size: 64,
                          color: Colors.grey[400],
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'No tests available',
                          style: TextStyle(
                            fontSize: 18,
                            color: Colors.grey[600],
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Pull down to refresh',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[500],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              );
            }
            final categories = snapshot.data!;
            _slideAnimations = List.generate(
              categories.length,
              (index) => Tween<Offset>(
                begin: const Offset(1, 0),
                end: Offset.zero,
              ).animate(
                CurvedAnimation(
                  parent: _animationController,
                  curve: Interval(
                    index * 0.1,
                    1.0,
                    curve: Curves.easeOut,
                  ),
                ),
              ),
            );
            _fadeAnimations = List.generate(
              categories.length,
              (index) => Tween<double>(
                begin: 0.0,
                end: 1.0,
              ).animate(
                CurvedAnimation(
                  parent: _animationController,
                  curve: Interval(
                    index * 0.1,
                    1.0,
                    curve: Curves.easeOut,
                  ),
                ),
              ),
            );
            _animationController.forward();
            return Padding(
              padding: const EdgeInsets.all(16.0),
              child: ListView.builder(
                physics: const AlwaysScrollableScrollPhysics(),
                itemCount: categories.length,
                itemBuilder: (context, index) {
                  return SlideTransition(
                    position: _slideAnimations[index],
                    child: FadeTransition(
                      opacity: _fadeAnimations[index],
                      child: _buildAnimatedTestCard(
                        context,
                        categories[index],
                        index,
                      ),
                    ),
                  );
                },
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildAnimatedTestCard(
    BuildContext context,
    TestCategory category,
    int index,
  ) {
    final theme = Theme.of(context);
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
              // Using withValues instead of deprecated withOpacity; 191 ≈ 0.75 * 255
              color: Colors.white60,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: AppColors.primary.withOpacity(0.3),
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
                    color: AppColors.primary.withValues(alpha: 204),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    category.icon,
                    color: AppColors.primary,
                    size: 28,
                  ),
                ),
                const SizedBox(width: 16),
                // Content
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(category.title,
                          style: theme.textTheme.titleLarge?.copyWith(
                            color: AppColors.primary,
                          )),
                      const SizedBox(height: 4),
                      Text(
                        category.subtitle,
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: AppColors.primary,
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
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: AppColors.primary,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppColors.primary.withValues(alpha: 204),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(
                        Icons.arrow_forward_ios,
                        size: 16,
                        color: AppColors.primary,
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
  final Widget page;

  TestCategory({
    required this.title,
    required this.subtitle,
    required this.completed,
    required this.icon,
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
        return Card(
          margin: const EdgeInsets.symmetric(vertical: 12),
          elevation: 3,
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Q${question.qno}: ${question.question}',
                    style:
                        TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                if (question.programSnippet.isNotEmpty) ...[
                  SizedBox(height: 8),
                  Container(
                    width: double.infinity,
                    padding: EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.grey[200],
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      question.programSnippet,
                      style: TextStyle(
                          fontFamily: 'monospace', color: Colors.blueGrey[800]),
                    ),
                  ),
                ],
                SizedBox(height: 8),
                Text('Marks: ${question.marks}',
                    style: TextStyle(color: Colors.blueGrey)),
                SizedBox(height: 12),
                TextField(
                  decoration: const InputDecoration(labelText: 'Your code'),
                  onChanged: onChanged,
                  maxLines: 4,
                ),
              ],
            ),
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
