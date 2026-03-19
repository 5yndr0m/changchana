import 'dart:async';
import 'dart:convert';
import 'package:chongchana/models/branchs.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;

import "package:chongchana/models/api_error.dart";
import "package:chongchana/models/api_response.dart";

Future<ApiResponse> fetchBranchs() async {
  ApiResponse resp = ApiResponse(data: {});
  final endpoint = dotenv.env['API_ENDPOINT'];
  String path = '/branches';
  final url = Uri.parse('$endpoint$path');
  try {
    final response = await http.get(url);
    switch (response.statusCode) {
      case 200:
        resp.Data = Branchs.fromJson(jsonDecode(response.body));
        break;
      case 401:
        resp.ApiError = ApiError.fromJson(jsonDecode(response.body));
        break;
      default:
        resp.ApiError = ApiError.fromJson(jsonDecode(response.body));
        break;
    }
  } catch (e) {
    resp.ApiError = ApiError(error: "Server error. Please retry");
  }
  return resp;
}
