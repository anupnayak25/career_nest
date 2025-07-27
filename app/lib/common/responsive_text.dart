import 'package:flutter/material.dart';
import 'theme.dart';

/// A widget that provides consistent responsive text scaling throughout the app
/// This ensures text adapts to user accessibility settings while maintaining design consistency
class ResponsiveText extends StatelessWidget {
  const ResponsiveText(
    this.text, {
    super.key,
    this.style,
    this.textAlign,
    this.overflow,
    this.maxLines,
    this.softWrap,
    this.fontSize,
    this.fontWeight,
    this.color,
    this.height,
  });

  final String text;
  final TextStyle? style;
  final TextAlign? textAlign;
  final TextOverflow? overflow;
  final int? maxLines;
  final bool? softWrap;
  final double? fontSize;
  final FontWeight? fontWeight;
  final Color? color;
  final double? height;

  @override
  Widget build(BuildContext context) {
    TextStyle finalStyle = style ?? const TextStyle();

    if (fontSize != null ||
        fontWeight != null ||
        color != null ||
        height != null) {
      finalStyle = finalStyle.copyWith(
        fontSize: fontSize != null
            ? AppTextScale.scaledFontSize(context, fontSize!)
            : finalStyle.fontSize,
        fontWeight: fontWeight ?? finalStyle.fontWeight,
        color: color ?? finalStyle.color,
        height: height ?? finalStyle.height,
      );
    } else if (finalStyle.fontSize != null) {
      // Scale existing fontSize in the provided style
      finalStyle = finalStyle.copyWith(
        fontSize: AppTextScale.scaledFontSize(context, finalStyle.fontSize!),
      );
    }

    return Text(
      text,
      style: finalStyle,
      textAlign: textAlign,
      overflow: overflow,
      maxLines: maxLines,
      softWrap: softWrap,
    );
  }
}

/// Pre-built responsive text widgets for common use cases
class AppText {
  /// Large headline text (32px base)
  static Widget headline(
    BuildContext context,
    String text, {
    Color? color,
    TextAlign? textAlign,
    int? maxLines,
    TextOverflow? overflow,
  }) {
    return ResponsiveText(
      text,
      style: AppTextStyles.headline(context).copyWith(color: color),
      textAlign: textAlign,
      maxLines: maxLines,
      overflow: overflow,
    );
  }

  /// Title large text (24px base)
  static Widget titleLarge(
    BuildContext context,
    String text, {
    Color? color,
    TextAlign? textAlign,
    int? maxLines,
    TextOverflow? overflow,
  }) {
    return ResponsiveText(
      text,
      style: AppTextStyles.titleLarge(context).copyWith(color: color),
      textAlign: textAlign,
      maxLines: maxLines,
      overflow: overflow,
    );
  }

  /// Title medium text (20px base)
  static Widget titleMedium(
    BuildContext context,
    String text, {
    Color? color,
    TextAlign? textAlign,
    int? maxLines,
    TextOverflow? overflow,
  }) {
    return ResponsiveText(
      text,
      style: AppTextStyles.titleMedium(context).copyWith(color: color),
      textAlign: textAlign,
      maxLines: maxLines,
      overflow: overflow,
    );
  }

  /// Subtitle text (18px base)
  static Widget subtitle(
    BuildContext context,
    String text, {
    Color? color,
    TextAlign? textAlign,
    int? maxLines,
    TextOverflow? overflow,
  }) {
    return ResponsiveText(
      text,
      style: AppTextStyles.subtitle(context).copyWith(color: color),
      textAlign: textAlign,
      maxLines: maxLines,
      overflow: overflow,
    );
  }

  /// Body large text (16px base)
  static Widget bodyLarge(
    BuildContext context,
    String text, {
    Color? color,
    TextAlign? textAlign,
    int? maxLines,
    TextOverflow? overflow,
  }) {
    return ResponsiveText(
      text,
      style: AppTextStyles.bodyLarge(context).copyWith(color: color),
      textAlign: textAlign,
      maxLines: maxLines,
      overflow: overflow,
    );
  }

  /// Body medium text (14px base)
  static Widget bodyMedium(
    BuildContext context,
    String text, {
    Color? color,
    TextAlign? textAlign,
    int? maxLines,
    TextOverflow? overflow,
  }) {
    return ResponsiveText(
      text,
      style: AppTextStyles.bodyMedium(context).copyWith(color: color),
      textAlign: textAlign,
      maxLines: maxLines,
      overflow: overflow,
    );
  }

  /// Body small text (12px base)
  static Widget bodySmall(
    BuildContext context,
    String text, {
    Color? color,
    TextAlign? textAlign,
    int? maxLines,
    TextOverflow? overflow,
  }) {
    return ResponsiveText(
      text,
      style: AppTextStyles.bodySmall(context).copyWith(color: color),
      textAlign: textAlign,
      maxLines: maxLines,
      overflow: overflow,
    );
  }

  /// Caption text (10px base)
  static Widget caption(
    BuildContext context,
    String text, {
    Color? color,
    TextAlign? textAlign,
    int? maxLines,
    TextOverflow? overflow,
  }) {
    return ResponsiveText(
      text,
      style: AppTextStyles.caption(context).copyWith(color: color),
      textAlign: textAlign,
      maxLines: maxLines,
      overflow: overflow,
    );
  }

  /// Button text (16px base)
  static Widget button(
    BuildContext context,
    String text, {
    Color? color,
    TextAlign? textAlign,
    int? maxLines,
    TextOverflow? overflow,
  }) {
    return ResponsiveText(
      text,
      style: AppTextStyles.button(context).copyWith(color: color),
      textAlign: textAlign,
      maxLines: maxLines,
      overflow: overflow,
    );
  }
}

/// Extension method to make existing Text widgets responsive easily
extension ResponsiveTextExtension on Text {
  Widget makeResponsive(BuildContext context) {
    return ResponsiveText(
      data ?? '',
      style: style,
      textAlign: textAlign,
      overflow: overflow,
      maxLines: maxLines,
      softWrap: softWrap,
    );
  }
}
