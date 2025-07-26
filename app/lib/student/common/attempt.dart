import 'package:flutter/material.dart';
import 'dart:io';
import 'package:career_nest/common/video_recoredr_screen.dart';
import 'package:career_nest/common/video_service.dart';
import 'package:career_nest/student/models/hr_model.dart' show Question;
import 'package:career_nest/student/models/programming_model.dart'
    show ProgrammingQuestion;
import 'package:career_nest/student/models/quiz_model.dart' show QuizQuestion;
import 'package:career_nest/student/common/success_screen.dart';
import 'package:flutter/services.dart';

class AttemptPage<T> extends StatefulWidget {
  final String title;
  final List<T> questions;
  final Widget Function(T, int, dynamic, void Function(dynamic))
      questionBuilder;
  final Future<bool> Function(List<Map<String, dynamic>>) onSubmit;
  final Map<int, dynamic> Function()? initialAnswers;
  final String? type;

  const AttemptPage({
    Key? key,
    required this.title,
    required this.questions,
    required this.questionBuilder,
    required this.onSubmit,
    this.initialAnswers,
    this.type,
  }) : super(key: key);

  @override
  State<AttemptPage<T>> createState() => _AttemptPageState<T>();
}

class _AttemptPageState<T> extends State<AttemptPage<T>> {
  late Map<int, dynamic> answers;
  bool isSubmitting = false;
  List<int> uploadingQuestions = [];

  @override
  void initState() {
    super.initState();
    answers = widget.initialAnswers?.call() ?? {};

    // Restrict screenshots and split-screen
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersiveSticky);
  }

  @override
  void dispose() {
    // Re-enable screenshots and split-screen when leaving the page
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
    super.dispose();
  }

  bool get isVideoType => widget.type == 'technical' || widget.type == 'hr';

  int get answeredQuestions => answers.length;
  int get totalQuestions => widget.questions.length;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: isVideoType ? Colors.white : Colors.grey[50],
      appBar: AppBar(
        title: Text(
          widget.title,
          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 18),
        ),
        backgroundColor: isVideoType ? Colors.white : theme.primaryColor,
        foregroundColor: isVideoType ? Colors.black : Colors.white,
        elevation: isVideoType ? 0 : 2,
        centerTitle: true,
        actions: [
          if (totalQuestions > 0 && !isVideoType)
            Padding(
              padding: const EdgeInsets.only(right: 16.0),
              child: Center(
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    '$answeredQuestions/$totalQuestions',
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                      fontSize: 14,
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
      body: widget.questions.isEmpty
          ? _buildEmptyState()
          : Column(
              children: [
                if (isVideoType) _buildVideoTypeHeader(),
                if (totalQuestions > 0 && !isVideoType)
                  _buildProgressIndicator(),
                Expanded(
                  child: ListView.builder(
                    padding: EdgeInsets.all(isVideoType ? 20.0 : 16.0),
                    itemCount: widget.questions.length,
                    itemBuilder: (context, index) {
                      final question = widget.questions[index];
                      return isVideoType
                          ? _buildVideoQuestionCard(question, index)
                          : _buildQuestionCard(question, index);
                    },
                  ),
                ),
                _buildSubmitSection(),
              ],
            ),
    );
  }

  Widget _buildVideoTypeHeader() {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
      child: Text(
        widget.type == 'technical'
            ? 'Create technical videos that showcase your skills and expertise. Answer questions to demonstrate your technical knowledge.'
            : 'Create videos that showcase your personality and communication skills. Answer questions to demonstrate your fit for the role.',
        style: TextStyle(
          fontSize: 14,
          color: Colors.grey[600],
          height: 1.4,
        ),
        textAlign: TextAlign.center,
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.quiz_outlined, size: 80, color: Colors.grey[400]),
          const SizedBox(height: 16),
          Text(
            'No questions available',
            style: TextStyle(
                fontSize: 18,
                color: Colors.grey[600],
                fontWeight: FontWeight.w500),
          ),
          const SizedBox(height: 8),
          Text('Please check back later',
              style: TextStyle(fontSize: 14, color: Colors.grey[500])),
        ],
      ),
    );
  }

  Widget _buildProgressIndicator() {
    final progress =
        totalQuestions > 0 ? answeredQuestions / totalQuestions : 0.0;

    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 4,
              offset: const Offset(0, 2)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Progress',
                  style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Colors.grey[800])),
              Text('${(progress * 100).round()}% Complete',
                  style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: Theme.of(context).primaryColor)),
            ],
          ),
          const SizedBox(height: 8),
          LinearProgressIndicator(
            value: progress,
            backgroundColor: Colors.grey[200],
            valueColor:
                AlwaysStoppedAnimation<Color>(Theme.of(context).primaryColor),
            minHeight: 6,
          ),
        ],
      ),
    );
  }

  Widget _buildQuestionCard(T question, int index) {
    // Check the type of the question dynamically
    if (question is ProgrammingQuestion) {
      return _buildProgrammingQuestionCard(question, index);
    } else if (question is QuizQuestion) {
      return _buildQuizQuestionCard(question, index);
    } else if (question is Question) {
      return _buildGeneralQuestionCard(question, index);
    } else {
      return const SizedBox.shrink(); // Handle unexpected types gracefully
    }
  }

  Widget _buildProgrammingQuestionCard(
      ProgrammingQuestion question, int index) {
    final controller = TextEditingController(text: answers[index] ?? "");

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: Card(
        elevation: 4,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        color: Theme.of(context).primaryColor.withOpacity(0.12),
        shadowColor: Theme.of(context).primaryColor.withOpacity(0.08),
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text("${question.qno}) ${question.question}",
                  style: const TextStyle(
                      fontWeight: FontWeight.w600, fontSize: 16)),
              const SizedBox(height: 12),
              TextField(
                controller: controller,
                onChanged: (val) => answers[index] = val,
                maxLines: 8,
                minLines: 5,
                decoration: InputDecoration(
                  hintText: 'Enter your code here...',
                  filled: true,
                  fillColor: Colors.grey[100],
                  border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12)),
                ),
                style: const TextStyle(fontFamily: 'monospace', fontSize: 14),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildGeneralQuestionCard(T question, int index) {
    final isBlueType = widget.type == 'quiz' || widget.type == 'programming';

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: Card(
        elevation: 4,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        color: (isBlueType
            ? Theme.of(context).primaryColor.withOpacity(0.12)
            : Colors.white),
        shadowColor: Theme.of(context).primaryColor.withOpacity(0.08),
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                  "${(question as dynamic).qno}) ${(question as dynamic).question}",
                  style: const TextStyle(
                      fontWeight: FontWeight.w600, fontSize: 16)),
              const SizedBox(height: 12),
              widget.questionBuilder(
                question,
                index,
                answers[index],
                (val) => setState(() => answers[index] = val),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildQuizQuestionCard(QuizQuestion question, int index) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: Card(
        elevation: 4,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        color: Theme.of(context).primaryColor.withOpacity(0.12),
        shadowColor: Theme.of(context).primaryColor.withOpacity(0.08),
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text("${question.qno}) ${question.question}",
                  style: const TextStyle(
                      fontWeight: FontWeight.w600, fontSize: 16)),
              const SizedBox(height: 12),
              Column(
                children: List.generate(question.options.length, (i) {
                  return RadioListTile(
                    value: question.options[i],
                    groupValue: answers[index],
                    onChanged: (val) {
                      setState(() => answers[index] = val);
                    },
                    title: Text(question.options[i]),
                  );
                }),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildVideoQuestionCard(T question, int index) {
    final q = question as Question;
    final uploaded = answers[q.qno] != null;

    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 15,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: const Color(0xFF2563EB).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  "Question ${q.qno}",
                  style: const TextStyle(
                    color: Color(0xFF2563EB),
                    fontWeight: FontWeight.w600,
                    fontSize: 12,
                  ),
                ),
              ),
              const Spacer(),
              if (uploaded)
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.green.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.check_circle, color: Colors.green, size: 16),
                      const SizedBox(width: 4),
                      Text(
                        "Completed",
                        style: TextStyle(
                          color: Colors.green,
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            q.question,
            style: const TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: 16,
              height: 1.4,
              color: Color(0xFF1F2937),
            ),
          ),
          const SizedBox(height: 20),
          GestureDetector(
            onTap: () => _recordVideo(q.qno),
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: uploaded
                      ? [Colors.green, Colors.green.shade600]
                      : [const Color(0xFF2563EB), const Color(0xFF1D4ED8)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(15),
                boxShadow: [
                  BoxShadow(
                    color: (uploaded ? Colors.green : const Color(0xFF2563EB))
                        .withOpacity(0.3),
                    blurRadius: 8,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    uploaded ? Icons.check_circle : Icons.videocam,
                    color: Colors.white,
                    size: 24,
                  ),
                  const SizedBox(width: 12),
                  Text(
                    uploaded
                        ? "Video Recorded Successfully"
                        : "Record Your Answer",
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSubmitSection() {
    final canSubmit = answers.isNotEmpty && !isSubmitting;
    final missingAnswers = totalQuestions - answeredQuestions;

    return Container(
      padding: const EdgeInsets.all(20.0),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: !isVideoType
            ? [
                BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 4,
                    offset: const Offset(0, -2))
              ]
            : null,
      ),
      child: Column(
        children: [
          if (missingAnswers > 0 && !isVideoType)
            Container(
              padding: const EdgeInsets.all(12),
              margin: const EdgeInsets.only(bottom: 12),
              decoration: BoxDecoration(
                color: Colors.blue[50],
                border: Border.all(color: Colors.blue[200]!),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                children: [
                  Icon(Icons.info_outline, color: Colors.blue[600], size: 20),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      '$missingAnswers question${missingAnswers == 1 ? '' : 's'} remaining (Optional - you can submit partial answers)',
                      style: TextStyle(
                          color: Colors.blue[700],
                          fontWeight: FontWeight.w500,
                          fontSize: 14),
                    ),
                  ),
                ],
              ),
            ),
          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton(
              onPressed: canSubmit ? _submitAnswers : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF2563EB),
                foregroundColor: Colors.white,
                disabledBackgroundColor: Colors.grey[300],
                elevation: canSubmit ? 2 : 0,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
                textStyle:
                    const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
              ),
              child: isSubmitting
                  ? const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                                strokeWidth: 2,
                                valueColor: AlwaysStoppedAnimation<Color>(
                                    Colors.white))),
                        SizedBox(width: 12),
                        Text('Submitting...',
                            style: TextStyle(
                                fontSize: 16, fontWeight: FontWeight.w600)),
                      ],
                    )
                  : Text(
                      canSubmit
                          ? 'SUBMIT ANSWERS'
                          : 'ANSWER AT LEAST ONE QUESTION',
                      style: const TextStyle(
                          fontSize: 16, fontWeight: FontWeight.w600)),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _recordVideo(int index) async {
    try {
      debugPrint("Starting video recording for question index: $index");
      final path = await Navigator.push<String>(
        context,
        MaterialPageRoute(builder: (_) => VideoRecordScreen(qno: index + 1)),
      );

      if (path != null && mounted) {
        debugPrint("Video recorded successfully. Path: $path");
        setState(() => uploadingQuestions.add(index));

        final url = await VideoService.uploadVideoFile(File(path));

        if (mounted) {
          setState(() {
            uploadingQuestions.remove(index);
            if (url != null) {
              answers[index] = url;
              debugPrint("Video uploaded successfully. URL: $url");
            } else {
              debugPrint("Video upload failed for question index: $index");
            }
          });

          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(url != null
                  ? 'Video uploaded successfully for Q${index + 1}'
                  : 'Failed to upload video for Q${index + 1}'),
              backgroundColor: url != null ? Colors.green : Colors.red,
              duration: const Duration(seconds: 3),
            ),
          );
        }
      } else {
        debugPrint("Video recording was canceled for question index: $index");
      }
    } catch (e) {
      debugPrint(
          "Error during video recording or upload for question index: $index. Error: $e");
      if (mounted) {
        setState(() => uploadingQuestions.remove(index));
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error recording video: $e'),
            backgroundColor: Colors.red,
            duration: const Duration(seconds: 3),
          ),
        );
      }
    }
  }

  Future<void> _submitAnswers() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirm Submission'),
        content: const Text('Are you sure you want to submit your answers?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Submit'),
          ),
        ],
      ),
    );

    if (confirm != true) return;

    // Fill unanswered questions with "NA" for non-quiz questions
    for (int i = 0; i < widget.questions.length; i++) {
      if (answers[i] == null) {
        final question = widget.questions[i];
        if (question is! QuizQuestion) {
          answers[i] = 'NA';
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Please select an option for question ${i + 1}.'),
              backgroundColor: Colors.red,
            ),
          );
          return;
        }
      }
    }

    setState(() => isSubmitting = true);

    final success = await widget.onSubmit(
      answers.entries.map((e) => {'id': e.key, 'answer': e.value}).toList(),
    );

    setState(() => isSubmitting = false);

    if (success) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => SuccessScreen(
            title: 'Submission Successful',
            message: 'Your answers have been submitted successfully.',
          ),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Submission failed. Please try again.')),
      );
    }
  }
}
