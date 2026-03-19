import 'dart:async';
import 'package:chongchana/models/service_response.dart';
import 'package:chongchana/services/api/fetcher.dart';

Future<ServiceResponse> getUserProfile() async {
  late ServiceResponse resp;
  try {
    const path = "/users/me";
    resp = await Fetcher.fetch(Fetcher.get, path);
  } catch (e) {
    resp.setErrorObject({
      "statusCode": 400,
      "message": e.toString(),
    });
  }
  return resp;
}

Future<ServiceResponse> accountDelete () async {
  late ServiceResponse resp;
  try {
    const path = "/api/user";
    resp = await Fetcher.fetch(Fetcher.delete, path);
  } catch (e) {
    resp.setErrorObject({
      "statusCode": 400,
      "message": e.toString(),
    });
  }
  return resp;
}
