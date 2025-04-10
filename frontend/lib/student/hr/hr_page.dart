import 'package:flutter/material.dart';
import '../../models/hr_model.dart';
import 'hr_service.dart';

class HrPage extends StatefulWidget {
  const HrPage({super.key});

  @override
  State<HrPage> createState() => _HrPageState();
}

class _HrPageState extends State<HrPage> {
  late Future<List<HrModel>> _futureHrList;

  @override
  void initState() {
    super.initState();
    _futureHrList = HrService().fetchHrList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("HR Interview"),
        centerTitle: true,
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: FutureBuilder<List<HrModel>>(
        future: _futureHrList,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error}"));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text("No HR data available."));
          }

          final hrData = snapshot.data![0]; // Taking the first item
          final questions = hrData.questions;

          return Padding(
            padding:
                const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  hrData.title,
                  style: const TextStyle(
                      fontSize: 20, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 10),
                const Text(
                  "Note:\n1) Video should cover your whole face and audio should be clear\n2) Video should not be more than one minute",
                  style: TextStyle(fontSize: 14),
                ),
                const SizedBox(height: 16),
                Expanded(
                  child: ListView.builder(
                    itemCount: questions.length,
                    itemBuilder: (context, index) {
                      final q = questions[index];
                      return Container(
                        margin: const EdgeInsets.only(bottom: 16),
                        decoration: BoxDecoration(
                          color: Colors.grey.shade200,
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: ListTile(
                          title: Text("${q.qno}) ${q.question}"),
                          subtitle: const Text("Click Here To add Video"),
                          trailing: IconButton(
                            icon: const Icon(Icons.add_circle,
                                color: Colors.blue, size: 30),
                            onPressed: () {
                              // TODO: Add video picker/recorder
                            },
                          ),
                        ),
                      );
                    },
                  ),
                ),
                Center(
                  child: ElevatedButton(
                    onPressed: () {
                      // TODO: Submit logic
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue,
                      padding: const EdgeInsets.symmetric(
                          horizontal: 40, vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                    ),
                    child:
                        const Text("Submit", style: TextStyle(fontSize: 16)),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
