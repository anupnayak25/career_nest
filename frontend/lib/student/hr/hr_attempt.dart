import 'dart:io';
import 'package:career_nest/student/hr/hr_service.dart';
import 'package:flutter/material.dart';
// import 'package:file_picker/file_picker.dart';
import 'hr_model.dart';
import '../common_page/success_screen.dart'; // Adjust the path based on your project structure
import '../../common/video_recoredr_screen.dart'; // Adjust the path based on your project structure
import '../common_page/service.dart'; // Adjust the path based on your project structure

class HRAnswerPage extends StatefulWidget {
  final List<Question> questions;
  final int HRQId; // Assuming this is the ID for the HR question set

  const HRAnswerPage({super.key, required this.questions, required this.HRQId});

  @override
  State<HRAnswerPage> createState() => _HRAnswerPageState();
}

class _HRAnswerPageState extends State<HRAnswerPage> {
  Map<int, String> videoAnswers = {};
  Set<int> uploadingQuestions = {};

  Future<void> recordVideo(int qno) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => VideoRecordScreen(qno: qno)),
    );

    if (result != null && result is String) {
      setState(() {
        uploadingQuestions.add(qno); // show loading under that question
      });

      final uploadedUrl = await ApiService.uploadVideo(File(result));

      if (uploadedUrl != null) {
        setState(() {
          videoAnswers[qno] = uploadedUrl;
        });
      }

      setState(() {
        uploadingQuestions.remove(qno); // hide loader
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    bool isSubmitting = false;
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text("HR"),
        centerTitle: true,
        backgroundColor: Colors.white,
        elevation: 0,
        foregroundColor: Colors.black,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Note :\n1) Video should cover your whole face and audio should be clear\n2) Video should not be more than 2 minutes",
              style: TextStyle(fontSize: 13),
            ),
            const SizedBox(height: 16),
            ...widget.questions.map((q) => _buildVideoUploadCard(q)).toList(),
            const SizedBox(height: 20),
            Center(
              child: ElevatedButton(
                onPressed: isSubmitting
                    ? null
                    : () async {
                        if (videoAnswers.isEmpty) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Please upload at least one video'),
                            ),
                          );
                          return;
                        }

                        setState(() => isSubmitting = true); // Start loading

                        List<Map<String, dynamic>> answers =
                            videoAnswers.entries
                                .map((e) => {
                                      'qno': e.key,
                                      'answer': e.value,
                                    })
                                .toList();

                        final success = await HrService.submitHRAnswers(
                          hrQId: widget.HRQId,
                          answers: answers,
                        );

                        setState(() => isSubmitting = false); // Stop loading

                        if (success) {
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(
                                builder: (_) => const SuccessScreen()),
                          );
                        } else {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                                content: Text('Failed to submit answers')),
                          );
                        }
                      },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 50, vertical: 14),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20)),
                ),
                child: isSubmitting
                    ? const SizedBox(
                        width: 24,
                        height: 24,
                        child: CircularProgressIndicator(
                          color: Colors.white,
                          strokeWidth: 2,
                        ),
                      )
                    : const Text(
                        'Submit',
                        style: TextStyle(fontSize: 16, color: Colors.white),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildVideoUploadCard(Question q) {
    bool uploaded = videoAnswers[q.qno] != null;
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
          Text(
            "${q.qno}) ${q.question}",
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
          const SizedBox(height: 8),
          GestureDetector(
            onTap: () => recordVideo(q.qno),
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
          if (uploadingQuestions
              .contains(q.qno)) // 👈 show loading only for this question
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
}
