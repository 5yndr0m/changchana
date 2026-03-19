// ignore_for_file: non_constant_identifier_names, unnecessary_getters_setters

import 'package:chongchana/models/app_settings.dart';
import 'package:chongchana/models/branch.dart';
import 'package:chongchana/models/menu/menu_category.dart';
import 'package:chongchana/models/menu/menu_sub_categories.dart';

class AppInit {
  late List<Branch> branchs = [];
  late ApplicationSettings? settings;
  late List<MenuCategory> menuCategories = [];
  late List<MenuSubCategory> menuSubCategories = [];
  

  AppInit({
    this.branchs = const [],
    this.settings,
    this.menuCategories = const [],
    this.menuSubCategories = const [],
  });
}
