// ignore_for_file: non_constant_identifier_names, unnecessary_getters_setters
import 'package:chongchana/models/menu/menu.dart';
import 'package:chongchana/models/menu/menu_category.dart';
import 'package:chongchana/models/menu/menu_sub_categories.dart';
import 'package:jiffy/jiffy.dart';

class Branch {
  late int _id;
  late String _name;
  late String _phone;
  late String _line;
  late String _googleMap;
  late String _appleMap;
  late String _logo;
  late String _cover_image;
  late String _opening_time;
  late String _closing_time;
  late List<MenuCategory> _categories = [];
  late List<Menu> _menus = [];

  Branch({
    required int id,
    String? name,
    String? phone,
    String? line,
    String? googleMap,
    String appleMap = "",
    String logo = "",
    String coverImage = "",
    String opening_time = "",
    String closing_time = "",
    List<MenuCategory> categories = const [],
    List<MenuSubCategory> subCategories = const [],
    List<Menu> menus = const [],
  }) {
    _id = id;
    _name = name!;
    _appleMap = appleMap;
    _googleMap = googleMap!;
    _logo = logo;
    _cover_image = coverImage;
    _categories = categories;
    _menus = menus;
    _opening_time = opening_time;
    _closing_time = closing_time;
  }

  // Properties
  int get id => _id;
  set id(int id) => _id = id;

  String get name => _name;
  set slug(String str) => _name = str;

  String get phone => _phone;
  set phone(String str) => _phone = str;

  String get line => _line;
  set line(String str) => _line = str;

  String get googleMap => _googleMap;
  set googleMap(String str) => _googleMap = str;

  String get appleMap => _appleMap;
  set appleMap(String str) => _appleMap = str;

  String get logo => _logo;
  set logo(String str) => _logo = str;

  String get coverImage => _cover_image;
  set coverImage(String str) => _cover_image = str;

  String branchOpen() {
    if (_opening_time != "" && _closing_time != "") {
      return "${Jiffy.parse(_opening_time, pattern: "HH:mm:sss").format(pattern: 'HH:mm')} - ${Jiffy.parse(_closing_time, pattern: "HH:mm:sss").format(pattern: 'HH:mm')}";
    } else {
      return "-";
    }
  }

  List<MenuCategory> get categories => _categories;
  List<Menu> get menus => _menus;

  Branch.fromJson(Map<String, dynamic> json) {
    try {
      _id = json['id'];
      _name = json['name'];
      _phone = json['phone'];
      _line = json['line'];
      _googleMap = json['googleMap'] ?? "";
      _appleMap = json['appleMap'] ?? "";
      _logo = json['logo'];
      _cover_image = json['coverImage'];
      _opening_time = json['opening_time'] ?? "";
      _closing_time = json['closing_time'] ?? "";

      for (var row in json["menu_categories"]) {
        _categories.add(MenuCategory.fromJson(row));
      }

      for (var row in json["menus"]) {
        _menus.add(Menu.fromJson(row));
      }
    } catch (e) {
      print("Error from Branch class: $e");
    }
  }
}
