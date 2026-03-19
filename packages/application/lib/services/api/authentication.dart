import 'dart:async';
import 'package:chongchana/models/service_response.dart';
import 'package:chongchana/services/api/fetcher.dart';

Future<ServiceResponse> authenticateUser(
    String username, String password) async {
  late ServiceResponse resp;
  try {
    const path = "/auth/local";
    resp = await Fetcher.fetch(Fetcher.post, path, params: {
      'identifier': username,
      'password': password,
    }, useAccesstoken: false);
  } catch (e) {
    resp.setErrorObject({
      "statusCode": 400,
      "message": e.toString(),
    });
  }
  return resp;
}
