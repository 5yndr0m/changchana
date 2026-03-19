import 'package:chongchana/constants/colors.dart';
import 'package:flutter/material.dart';


showErrorSnackBar (BuildContext context, String message) {
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      backgroundColor: ChongjaroenColors.redColor,
      duration: const Duration(seconds: 3),
      content: Text(
        message,
        textAlign: TextAlign.center,
        style: const TextStyle(
          fontSize: 16,
          color: ChongjaroenColors.whiteColor
        ),
      )
    ),
  );
}