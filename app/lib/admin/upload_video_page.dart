import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';

class UploadVideoPage extends StatefulWidget {
  @override
  _UploadVideoPageState createState() => _UploadVideoPageState();
}

class _UploadVideoPageState extends State<UploadVideoPage> {
  String? selectedCategory;
  String? selectedFileName;
  final TextEditingController titleController = TextEditingController();
  final TextEditingController descriptionController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Upload Video'), backgroundColor: Colors.blue),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextField(
              controller: titleController,
              decoration: InputDecoration(
                labelText: 'Video Title',
                border: OutlineInputBorder(),
              ),
            ),
            SizedBox(height: 16),
            TextField(
              controller: descriptionController,
              decoration: InputDecoration(
                labelText: 'Description',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),
            SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: selectedCategory,
              hint: Text('Select Category'),
              decoration: InputDecoration(border: OutlineInputBorder()),
              items:
                  [
                    'Campus Placement',
                    'Off-Campus Drive',
                    'Virtual Event',
                    'Coding Competition',
                    'Technical Workshop',
                    'Career Fair',
                    'Industry Talk',
                    'Mock Interview',
                  ].map((String value) {
                    return DropdownMenuItem<String>(
                      value: value,
                      child: Text(value),
                    );
                  }).toList(),
              onChanged: (newValue) {
                setState(() {
                  selectedCategory = newValue;
                });
              },
            ),
            SizedBox(height: 16),
            ElevatedButton(
              onPressed: () async {
                FilePickerResult? result = await FilePicker.platform.pickFiles(
                  type: FileType.video,
                );
                if (result != null) {
                  setState(() {
                    selectedFileName = result.files.single.name;
                  });
                }
              },
              child: Text('Select Video'),
            ),
            if (selectedFileName != null) ...[
              SizedBox(height: 8),
              Text('Selected: $selectedFileName'),
            ],
            SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                if (titleController.text.isNotEmpty &&
                    selectedCategory != null &&
                    selectedFileName != null) {
                  Navigator.pop(context, {
                    'title': titleController.text,
                    'description': descriptionController.text,
                    'category': selectedCategory,
                  });
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        'Please fill all fields and select a video',
                      ),
                    ),
                  );
                }
              },
              child: Text('Upload'),
              style: ElevatedButton.styleFrom(
                minimumSize: Size(double.infinity, 50),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
