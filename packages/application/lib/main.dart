
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:url_strategy/url_strategy.dart';
import 'package:chongchana/app.dart';

void main() async {
   await dotenv.load();
  // Provider.debugCheckInvalidValueType = null;

  setHashUrlStrategy();
  runApp(const ChongjaroenApp());
}
