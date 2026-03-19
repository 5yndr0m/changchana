import 'package:chongchana/models/menu/menu_category.dart';

class MenuCategories {
  late List<MenuCategory> categories = [];

  MenuCategories({
    this.categories = const [],
  });

  MenuCategories.fromJson(List<dynamic> json) {
    for (var row in json) {
      categories.add(MenuCategory.fromJson(row));
    }
  }
}
