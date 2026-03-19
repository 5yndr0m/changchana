import 'package:chongchana/models/menu/menu.dart';
import 'package:chongchana/models/menu/menu_sub_categories.dart';

class MenuCategory {
  late int id = 0;
  late String? name;
  late List<Menu> menus = [];
  late List<MenuSubCategory> subCategories = [];
  MenuCategory({
    required this.id,
    this.name,
  });

  MenuCategory.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    name = json['name'];

    try {
      if (json["menus"] != null) {
        for (var row in json["menus"]) {
          menus.add(Menu.fromJson(row));
        }
      }

      if (json["menu_sub_categories"] != null) {
        for (var row in json["menu_sub_categories"]) {
          subCategories.add(MenuSubCategory.fromJson(row));
        }
      }
    } catch (e) {
      // ignore: avoid_print
      print("Error from MenuCategory class: $e");
    }
  }
}
