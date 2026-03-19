// ignore_for_file: unnecessary_getters_setters

import 'package:chongchana/models/branch.dart';

class Branchs {
  late List<Branch> _branchs = [];

  Branchs({
    List<Branch>? branchs,
  }) {
    _branchs = branchs ?? [];
  }

  List<Branch> get branchs => _branchs;
  set branchs(List<Branch> data) => _branchs = data;

  Branchs.fromJson(List<dynamic> json) {
    for (var row in json) {
      branchs.add(Branch.fromJson({
        ...row,
        "logo": row["logo"]["url"] ?? "",
        "googleMap": row["google_map"],
        "appleMap": row["apple_map"],
        "coverImage": row["cover_image"]["url"] ?? "",
      }));
    }
  }
}
