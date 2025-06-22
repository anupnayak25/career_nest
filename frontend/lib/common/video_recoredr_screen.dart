import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart';

class VideoRecordScreen extends StatefulWidget {
  final int qno;

  const VideoRecordScreen({super.key, required this.qno});

  @override
  State<VideoRecordScreen> createState() => _VideoRecordScreenState();
}

class _VideoRecordScreenState extends State<VideoRecordScreen> {
  CameraController? _controller; // ✅ make it nullable
  bool _isRecording = false;
  bool _isCameraInitialized = false;
  late List<CameraDescription> _cameras;

  @override
  void initState() {
    super.initState();
    initCamera();
  }

  Future<void> initCamera() async {
    try {
      _cameras = await availableCameras();
      _controller = CameraController(_cameras.first, ResolutionPreset.medium);
      await _controller!.initialize();

      if (mounted) {
        setState(() {
          _isCameraInitialized = true;
        });
      }
    } catch (e) {
      debugPrint("Camera initialization failed: $e");
    }
  }

  Future<void> startRecording() async {
    await _controller?.startVideoRecording();
    setState(() => _isRecording = true);
  }

  Future<void> stopRecording(BuildContext context) async {
    final video = await _controller?.stopVideoRecording();
    setState(() => _isRecording = false);

    if (video != null) {
      Navigator.pop(context, video.path);
    }
  }

  @override
  void dispose() {
    _controller?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (!_isCameraInitialized || _controller == null) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      appBar: AppBar(title: const Text("Record Video")),
      body: Column(
        children: [
          Expanded(
            child: AspectRatio(
              aspectRatio: _controller!.value.aspectRatio,
              child: CameraPreview(_controller!),
            ),
          ),
          const SizedBox(height: 20),
          ElevatedButton.icon(
            icon: Icon(_isRecording ? Icons.stop : Icons.videocam),
            label: Text(_isRecording ? "Stop Recording" : "Start Recording"),
            onPressed: () {
              _isRecording ? stopRecording(context) : startRecording();
            },
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }
}
