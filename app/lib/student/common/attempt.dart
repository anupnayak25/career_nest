import 'package:flutter/material.dart';
import 'dart:io';
import 'package:career_nest/common/video_recoredr_screen.dart';
import 'package:career_nest/common/video_service.dart';
import 'package:career_nest/student/models/hr_model.dart' show Question;

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
    final q = question as Question;
    final isBlueType = widget.type == 'quiz' || widget.type == 'programming';

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: Card(
        elevation: 4,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        color: isBlueType
            ? Theme.of(context).primaryColor.withOpacity(0.12)
            : Colors.white,
        shadowColor: Theme.of(context).primaryColor.withOpacity(0.08),
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text("${q.qno}) ${q.question}",
                  style: const TextStyle(
                      fontWeight: FontWeight.w600, fontSize: 16)),
              const SizedBox(height: 12),
              if (widget.type == 'quiz')
                _buildOptions(q, index)
              else if (widget.type == 'programming')
                _buildCodeInput(q, index)
              else
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

  Widget _buildOptions(dynamic q, int index) {
    final options = (q != null && q is dynamic && q.options != null)
        ? q.options as List<String>
        : <String>[];
    return Column(
      children: List.generate(options.length, (i) {
        return RadioListTile(
          value: options[i],
          groupValue: answers[index],
          onChanged: (val) {
            setState(() => answers[index] = val);
          },
          title: Text(options[i]),
        );
      }),
    );
  }

  Widget _buildCodeInput(Question q, int index) {
    final controller = TextEditingController(text: answers[index] ?? "");

    return TextField(
      controller: controller,
      onChanged: (val) => answers[index] = val,
      maxLines: 8,
      minLines: 5,
      decoration: InputDecoration(
        hintText: 'Enter your code here...',
        filled: true,
        fillColor: Colors.grey[100],
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
      ),
      style: const TextStyle(fontFamily: 'monospace', fontSize: 14),
    );
  }

  Widget _buildVideoQuestionCard(T question, int index) {
    final q = question as Question;
    final uploaded = answers[q.qno] != null;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: const Color(0xFFF2F2F2),
        borderRadius: BorderRadius.circular(20),
      ),
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("${q.qno}) ${q.question}",
              style:
                  const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 8),
          GestureDetector(
            onTap: () => _recordVideo(q.qno),
            child: Container(
              decoration: BoxDecoration(
                color: uploaded ? Colors.green : Colors.blueAccent,
                borderRadius: BorderRadius.circular(30),
              ),
              padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      uploaded ? "Video Uploaded" : "Click Here To Add Video",
                      style: const TextStyle(color: Colors.white, fontSize: 14),
                    ),
                  ),
                  Icon(uploaded ? Icons.check : Icons.add, color: Colors.white),
                ],
              ),
            ),
          ),
          const SizedBox(height: 10),
          if (uploadingQuestions.contains(q.qno))
            const Row(
              children: [
                SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2)),
                SizedBox(width: 10),
                Text("Uploading...", style: TextStyle(fontSize: 13)),
              ],
            ),
        ],
      ),
    );
  }

  Widget _buildSubmitSection() {
    final canSubmit =
        answers.length == widget.questions.length && !isSubmitting;
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
                color: Colors.orange[50],
                border: Border.all(color: Colors.orange[200]!),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                children: [
                  Icon(Icons.warning_amber,
                      color: Colors.orange[600], size: 20),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      '$missingAnswers question${missingAnswers == 1 ? '' : 's'} remaining',
                      style: TextStyle(
                          color: Colors.orange[700],
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
                  : const Text('SUBMIT',
                      style:
                          TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _recordVideo(int index) async {
    try {
      final path = await Navigator.push<String>(
        context,
        MaterialPageRoute(builder: (_) => VideoRecordScreen(qno: index + 1)),
      );

      if (path != null && mounted) {
        setState(() => uploadingQuestions.add(index));

        final url = await VideoService.uploadVideoFile(File(path));

        if (mounted) {
          setState(() {
            uploadingQuestions.remove(index);
            if (url != null) answers[index] = url;
          });

          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(url != null
                  ? 'Video uploaded successfully for Q${index + 1}'
                  : 'Failed to upload video for Q${index + 1}'),
              backgroundColor: url != null ? Colors.green : Colors.red,
            ),
          );
        }
      }
    } catch (e) {
      setState(() => uploadingQuestions.remove(index));
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
            content: Text('Error recording video: $e'),
            backgroundColor: Colors.red),
      );
    }
  }

  Future<void> _submitAnswers() async {
    if (answers.length != widget.questions.length) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please answer all questions before submitting.'),
          backgroundColor: Colors.orange,
        ),
      );
      return;
    }

    setState(() => isSubmitting = true);

    try {
      final answerList = widget.questions.asMap().entries.map((entry) {
        final idx = entry.key;
        return {
          'qno': idx + 1,
          'answer': answers[idx],
        };
      }).toList();

      final success = await widget.onSubmit(answerList);

      if (mounted) {
        setState(() => isSubmitting = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(success
                ? 'Answers submitted successfully!'
                : 'Failed to submit answers.'),
            backgroundColor: success ? Colors.green : Colors.red,
          ),
        );
        if (success) Navigator.pop(context, true);
      }
    } catch (e) {
      if (mounted) {
        setState(() => isSubmitting = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text('Error submitting answers: $e'),
              backgroundColor: Colors.red),
        );
      }
    }
  }
}
