import 'dart:async';
import 'package:chongchana/services/api/fetcher.dart';

import 'package:chongchana/models/service_response.dart';

Future<ServiceResponse> userCheckout(String code) async {
  late ServiceResponse resp;
  const path = "/api/users/check-out";
  try {
    resp = await Fetcher.fetch(Fetcher.post, path, params: {
      "code": code,
    });
  } catch (e) {
    resp.setErrorObject({
      "statusCode": 500,
      "message": e.toString(),
    });
  }
  return resp;
}
