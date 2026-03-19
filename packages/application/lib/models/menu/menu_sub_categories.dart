import 'package:chongchana/models/menu/menu.dart';

class MenuSubCategory {
  late int id;
  late int categoryID;
  late String name;
  late List<Menu> menus;

  MenuSubCategory(this.id, this.name, this.categoryID, this.menus);

  MenuSubCategory.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    categoryID = json['menu_category'];
    name = json['name'];
  }
}
