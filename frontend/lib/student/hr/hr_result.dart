import 'package:flutter/material.dart';

class HrResults extends StatelessWidget {
  const HrResults({super.key});

  @override
  Widget build(BuildContext context) {
    return  Scaffold(
      appBar:  AppBar(
        title: Text("HR Results"),
      ),
      body: Center(
        child: Text(
          "Results will be displayed here.",
          style: TextStyle(fontSize: 18),
        ),
      ),
    );
  }
}