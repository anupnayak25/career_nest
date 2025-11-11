import 'package:flutter/material.dart';

class AppColors {
  static const Color primary = Color.fromARGB(255, 3, 2, 87);
  static const Color secondary = Color.fromARGB(255, 28, 25, 201);
  static const Color background = Color(0xFFF8FAFC);
  static const Color card = Colors.white;
  static const Color textPrimary = Color(0xFF1E293B);
  static const Color textSecondary = Color(0xFF64748B);
  static const Color accent = Color(0xFF38BDF8);
  static const Color error = Color(0xFFEF4444);
  static const Color success = Color(0xFF22C55E);
  static const Color border = Color(0xFFE5E7EB);

  static const List<Color> mainGradient = [primary, secondary];
}

/// Utility class for responsive text scaling
class AppTextScale {
  /// Scale font size based on device text scale factor
  /// This ensures consistent relative sizing across different devices and accessibility settings
  static double scaledFontSize(BuildContext context, double baseSize) {
    final textScale = MediaQuery.textScalerOf(context);
    // Clamp the scaling between 0.8 and 1.5 to prevent extremely large or small text
    final clampedScale = textScale.scale(1.0).clamp(0.8, 1.5);
    return baseSize * clampedScale;
  }

  /// Get responsive text style with proper scaling
  static TextStyle getResponsiveTextStyle(
    BuildContext context, {
    required double fontSize,
    FontWeight? fontWeight,
    Color? color,
    double? height,
    String? fontFamily,
  }) {
    return TextStyle(
      fontSize: scaledFontSize(context, fontSize),
      fontWeight: fontWeight,
      color: color,
      height: height,
      fontFamily: fontFamily,
    );
  }
}

class AppTextStyles {
  // Base font sizes - these will be scaled responsively
  static const double _headlineFontSize = 32;
  static const double _titleLargeFontSize = 24;
  static const double _titleMediumFontSize = 20;
  static const double _subtitleFontSize = 18;
  static const double _bodyLargeFontSize = 16;
  static const double _bodyMediumFontSize = 14;
  static const double _bodySmallFontSize = 12;
  static const double _buttonFontSize = 16;
  static const double _captionFontSize = 10;

  // Responsive text styles that scale based on user preferences
  static TextStyle headline(BuildContext context) =>
      AppTextScale.getResponsiveTextStyle(
        context,
        fontSize: _headlineFontSize,
        fontWeight: FontWeight.bold,
        color: AppColors.textPrimary,
      );

  static TextStyle titleLarge(BuildContext context) =>
      AppTextScale.getResponsiveTextStyle(
        context,
        fontSize: _titleLargeFontSize,
        fontWeight: FontWeight.bold,
        color: AppColors.textPrimary,
      );

  static TextStyle titleMedium(BuildContext context) =>
      AppTextScale.getResponsiveTextStyle(
        context,
        fontSize: _titleMediumFontSize,
        fontWeight: FontWeight.w600,
        color: AppColors.textPrimary,
      );

  static TextStyle subtitle(BuildContext context) =>
      AppTextScale.getResponsiveTextStyle(
        context,
        fontSize: _subtitleFontSize,
        fontWeight: FontWeight.w500,
        color: AppColors.textSecondary,
      );

  static TextStyle bodyLarge(BuildContext context) =>
      AppTextScale.getResponsiveTextStyle(
        context,
        fontSize: _bodyLargeFontSize,
        color: AppColors.textPrimary,
      );

  static TextStyle bodyMedium(BuildContext context) =>
      AppTextScale.getResponsiveTextStyle(
        context,
        fontSize: _bodyMediumFontSize,
        color: AppColors.textPrimary,
      );

  static TextStyle bodySmall(BuildContext context) =>
      AppTextScale.getResponsiveTextStyle(
        context,
        fontSize: _bodySmallFontSize,
        color: AppColors.textSecondary,
      );

  static TextStyle button(BuildContext context) =>
      AppTextScale.getResponsiveTextStyle(
        context,
        fontSize: _buttonFontSize,
        fontWeight: FontWeight.w600,
        color: Colors.white,
      );

  static TextStyle caption(BuildContext context) =>
      AppTextScale.getResponsiveTextStyle(
        context,
        fontSize: _captionFontSize,
        color: AppColors.textSecondary,
      );

  // Legacy static styles for backwards compatibility (but discouraged)
  static const TextStyle headlineLegacy = TextStyle(
    fontSize: 32,
    fontWeight: FontWeight.bold,
    color: AppColors.textPrimary,
  );
  static const TextStyle subtitleLegacy = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w500,
    color: AppColors.textSecondary,
  );
  static const TextStyle body = TextStyle(
    fontSize: 16,
    color: AppColors.textPrimary,
  );
  static const TextStyle buttonLegacy = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w600,
    color: Colors.white,
  );
}

class AppButtonStyles {
  static ButtonStyle elevated = ElevatedButton.styleFrom(
    backgroundColor: AppColors.primary,
    foregroundColor: Colors.white,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(16),
    ),
    padding: const EdgeInsets.symmetric(vertical: 16),
    textStyle: AppTextStyles.buttonLegacy,
    elevation: 0,
  );
}
