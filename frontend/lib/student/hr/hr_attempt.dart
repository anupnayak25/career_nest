import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import './hr_model.dart';
import '../common_page/success_screen.dart'; // Adjust the path based on your project structure

class HRAnswerPage extends StatefulWidget {
  final List<Question> questions;

  const HRAnswerPage({super.key, required this.questions});

  @override
  State<HRAnswerPage> createState() => _HRAnswerPageState();
}

class _HRAnswerPageState extends State<HRAnswerPage> {
  Map<int, String> videoAnswers = {};

  Future<void> pickVideo(int qno) async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.video,
      allowMultiple: false,
    );

    if (result != null && result.files.single.path != null) {
      String filePath = result.files.single.path!;
      // TODO: Add 2-minute video duration check here if needed
      setState(() {
        videoAnswers[qno] = filePath;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
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
                onPressed: () {
                  print("Submitted video answers: $videoAnswers");
                  // Submit logic here
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  padding: const EdgeInsets.symmetric(horizontal: 50, vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                ),
                child: const Text(
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
            onTap: () => pickVideo(q.qno),
            child: Container(
              decoration: BoxDecoration(
                color: Colors.blueAccent,
                borderRadius: BorderRadius.circular(30),
              ),
              padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      videoAnswers[q.qno] != null
                          ? "Video Selected"
                          : "Click Here To Add Video",
                      style: const TextStyle(color: Colors.white, fontSize: 14),
                    ),
                  ),
                  const Icon(Icons.add, color: Colors.white),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
