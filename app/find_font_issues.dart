#!/usr/bin/env dart

import 'dart:io';

// Script to find and report hardcoded font sizes in Flutter code
// Run this to identify files that still need font size fixes

void main() async {
  final appDir = Directory('lib');
  if (!await appDir.exists()) {
    print(
        'Error: lib directory not found. Run this script from the Flutter app root.');
    exit(1);
  }

  print('🔍 Scanning for hardcoded font sizes...\n');

  int fileCount = 0;
  int issueCount = 0;
  Map<String, List<String>> issues = {};

  await for (final entity in appDir.list(recursive: true)) {
    if (entity is File && entity.path.endsWith('.dart')) {
      fileCount++;
      final content = await entity.readAsString();
      final lines = content.split('\n');

      for (int i = 0; i < lines.length; i++) {
        final line = lines[i];
        final lineNumber = i + 1;

        // Check for hardcoded fontSize
        if (line.contains('fontSize:') &&
            !line.contains('AppTextScale.scaledFontSize')) {
          final relativePath = entity.path
              .replaceFirst(Directory.current.path, '')
              .replaceFirst('\\', '')
              .replaceFirst('/', '');
          issues.putIfAbsent(relativePath, () => []);
          issues[relativePath]!.add('Line $lineNumber: ${line.trim()}');
          issueCount++;
        }

        // Check for selectedFontSize/unselectedFontSize in BottomNavigationBar
        if ((line.contains('selectedFontSize:') ||
                line.contains('unselectedFontSize:')) &&
            !line.contains('AppTextScale.scaledFontSize')) {
          final relativePath = entity.path
              .replaceFirst(Directory.current.path, '')
              .replaceFirst('\\', '')
              .replaceFirst('/', '');
          issues.putIfAbsent(relativePath, () => []);
          issues[relativePath]!.add('Line $lineNumber: ${line.trim()}');
          issueCount++;
        }
      }
    }
  }

  print('📊 Scan Results:');
  print('Files scanned: $fileCount');
  print('Issues found: $issueCount');
  print('Files with issues: ${issues.length}\n');

  if (issues.isNotEmpty) {
    print('🚨 Files needing font size fixes:\n');

    issues.forEach((file, lines) {
      print('📄 $file');
      for (final line in lines) {
        print('   $line');
      }
      print('');
    });

    print('💡 Recommendations:');
    print(
        '1. Replace fontSize: X with AppTextScale.scaledFontSize(context, X)');
    print('2. Or use AppText.bodyLarge(context, "text") helper methods');
    print('3. Or use AppTextStyles.bodyLarge(context) for TextStyle');
    print(
        '4. For BottomNavigationBar, use AppTextScale.scaledFontSize(context, X)');
  } else {
    print('✅ No hardcoded font sizes found! All text is properly scaled.');
  }

  print('\n📖 See FONT_SIZE_FIX_GUIDE.md for detailed migration instructions.');
}
