import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:chongchana/models/service_response.dart';

import '../auth.dart';

class Fetcher {
  // Singleton
  static final Fetcher _singleton = Fetcher._internal();
  factory Fetcher() {
    return _singleton;
  }
  Fetcher._internal();

  static const String get = 'get';
  static const String post = 'post';
  static const String put = 'put';
  static const String patch = 'patch';
  static const String delete = 'delete';

  static ChongjaroenAuth chongjaroenAuth = ChongjaroenAuth();

  static Future<ServiceResponse> fetch(String method, String path,
      {Map<String, dynamic>? params,
      Map<String, String>? headers,
      bool? useAccesstoken = true}) async {
    String apiEndPoint = dotenv.env['API_ENDPOINT'] as String;

    ServiceResponse resp = ServiceResponse();

    try {
      dynamic response;

      Map<String, String> _headers = {};

      // For API use authen role ?
      if (useAccesstoken == true) {
        String? accessToken = await chongjaroenAuth.getAccessToken();
        if (accessToken == null) {
          resp.setErrorObject({
            "statusCode": 401,
            "message": 'Unauthenticated',
          });
          return resp;
        }
        _headers[HttpHeaders.authorizationHeader] = 'Bearer $accessToken';
      }
      // merge input headers
      if (headers != null) {
        _headers.addAll(headers);
      }
      Map<String, dynamic> methods = {
        "get": http.get,
        "post": http.post,
        "put": http.put,
        "patch": http.patch,
        "delete": http.delete,
      };

      switch (method) {
        case get:
          String queryString = '';
          if (params != null) {
            Map<String, String> paramString =
                params.map((key, value) => MapEntry(key, '$value'));
            queryString = '?' + Uri(queryParameters: paramString).query;
          }
          Uri url = Uri.parse('$apiEndPoint$path$queryString');
          response = await http.get(
            url,
            headers: _headers,
          );
          break;
        case post:
        case put:
        case patch:
        case delete:
          Uri url = Uri.parse('$apiEndPoint$path');
          response = await methods[method](
            url,
            headers: _headers,
            body: (params != null)
                ? params.map((key, value) => MapEntry(key, '$value'))
                : null,
          );
          break;
        default:
          throw 'Unknown method of $method';
      }

      resp.statusCode = response.statusCode;
      dynamic data = jsonDecode(response.body);
      switch (response.statusCode) {
        case 200:
          resp.success({
            "data": data,
          });
          break;
        case 401: // Invalid Token
          if (useAccesstoken == true) {
            chongjaroenAuth.signOut();
          }
          resp.setErrorObject({
            "statusCode": 401,
            "message": 'Unauthenticated',
          });
          break;
        default:
          resp.setErrorObject(data);
          break;
      }
    } catch (e) {
      resp.setErrorObject({
        "statusCode": 500,
        "message": e.toString(),
      });
    }
    return resp;
  }
}
