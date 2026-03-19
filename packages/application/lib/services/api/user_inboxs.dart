import 'dart:async';
import 'package:chongchana/models/service_response.dart';
import 'package:chongchana/services/api/fetcher.dart';

Future<ServiceResponse> fetchInbox({
  required int page,
  required int limit,
}) async {
  int start = (page - 1) * limit;
  String path =
      "/api/inboxes?_sort=published_at:DESC&_limit=$limit&_start=${start < 0 ? 0 : start}";
  ServiceResponse resp = await Fetcher.fetch(Fetcher.get, path);
  return resp;
}

Future<ServiceResponse> updateInboxActivity(
    int notificationID, String action) async {
  const path = "/api/inboxes/activity";
  ServiceResponse resp = await Fetcher.fetch(Fetcher.post, path, params: {
    "notificationID": "$notificationID",
    "action": action,
  });
  return resp;
}
