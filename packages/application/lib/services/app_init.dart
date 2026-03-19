// ignore_for_file: unnecessary_getters_setters

import 'package:chongchana/models/app_init.dart';
import 'package:chongchana/models/app_settings.dart';
import 'package:chongchana/models/branch.dart';
import 'package:chongchana/models/menu/menu_category.dart';
import 'package:chongchana/services/api/fetch_appinit.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';

import 'package:chongchana/models/api_response.dart';

class ChongjaroenAppInit extends ChangeNotifier {
  List<Branch> branchs = [];
  late ApplicationSettings settings = ApplicationSettings();
  late List<MenuCategory> caregories = [];
  late bool _showDialog = false;

  late DateTime lastSeenAnnouncement = DateTime.now().subtract(const Duration(days: 1));

  // ignore: todo
  // TODO: could be handle show only once time.
  bool get showDialog => _showDialog;
  set showDialog(bool s) => _showDialog = s;

  Future<void> fetchDataAppInit() async {
    ApiResponse resp = await fetchApplicationInit();
    if (resp.ApiError == Null) {
      AppInit data = resp.Data as AppInit;
      branchs = data.branchs;
      settings = data.settings as ApplicationSettings;
      caregories = data.menuCategories;

      if (settings.announcement!.enable) {
        _showDialog = true;
      }
    } else {}
    notifyListeners();
  }

  void setLastSeenAnnouncement () {
    lastSeenAnnouncement = DateTime.now();
  }
}
