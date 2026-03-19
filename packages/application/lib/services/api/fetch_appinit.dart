import 'dart:async';
import 'dart:convert';
import 'package:chongchana/models/app_init.dart';
import 'package:chongchana/models/app_settings.dart';
import 'package:chongchana/models/branchs.dart';
import 'package:chongchana/models/menu/menu_categories.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;

import "package:chongchana/models/api_error.dart";
import "package:chongchana/models/api_response.dart";

Future<ApiResponse> fetchApplicationInit() async {
  ApiResponse resp = ApiResponse(data: {});
  String path = '/api/app-init';
  final endpoint = dotenv.env['API_ENDPOINT'];
  final url = Uri.parse('$endpoint$path');
  try {
    final response = await http.get(url);
    switch (response.statusCode) {
      case 200:
        dynamic data = jsonDecode(response.body);

        Branchs branchs = Branchs.fromJson(data["branches"]);
        ApplicationSettings settings = ApplicationSettings.fromJson(data["settings"]);
        MenuCategories menuCategories = MenuCategories.fromJson(data["menuCategories"]);
        resp.Data = AppInit(
          branchs: branchs.branchs,
          settings: settings,
          menuCategories: menuCategories.categories,
        );
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
