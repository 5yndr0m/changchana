import 'dart:async';
import 'package:chongchana/models/service_response.dart';
import 'package:chongchana/services/api/fetcher.dart';

Future<ServiceResponse> fetchArticles(
  bool? special, {
  required int page,
  required int limit,
}) async {
  bool _special = special ?? false;
  int start = (page - 1) * limit;
  String path =
      '/articles?_sort=published_at:DESC&_limit=$limit&_start=${start < 0 ? 0 : start}';
  String pathSpecial = _special
      ? ''
      : '&_where[_or][0][special]=false&_where[_or][1][special_null]=true';
  return await Fetcher.fetch(Fetcher.get, "$path$pathSpecial", useAccesstoken: false);
}
