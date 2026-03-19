import 'package:chongchana/models/branch.dart';
import 'package:chongchana/models/menu/menu.dart';
import 'package:chongchana/models/menu/menu_category.dart';
import 'package:chongchana/models/menu/menu_sub_categories.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';

class ChongjaroenMenus extends ChangeNotifier {
  List<MenuCategory> mainMenuCategories = [];
  List<MenuSubCategory> mainSubCategories = [];
  late Branch branch;
  List<MenuCategory> categories = [];
  List<MenuSubCategory> availableSubCategory = [];
  List<Menu> menus = [];
  int activeCategoryID = 0;
  int activeSubCategoryID = 0;

  void setBranchActive(Branch _branch, List<MenuCategory> _mainMenuCategories) {
    branch = _branch;
    menus = _branch.menus;

    for (var item in _branch.categories) {
      if (menus.where((menu) => menu.categoryID == item.id).isNotEmpty) {
        categories.add(item);
      }
    }

    mainMenuCategories = _mainMenuCategories;
    for (MenuCategory cat in mainMenuCategories) {
      if (categories.where((row) => row.id == cat.id).isNotEmpty) {
        mainSubCategories.addAll(cat.subCategories);
      }
    }

    notifyListeners();
  }

  void setCategoryIDActive(int _categoryID) {
    activeCategoryID = _categoryID;
    availableSubCategory = [];
    notifyListeners();
  }

  void setSubCategoryIDActive(int _subCategoryID) {
    activeSubCategoryID = _subCategoryID;
    notifyListeners();
  }

  List<MenuSubCategory> getSubCategoryListByCatagoryID() {
    if (availableSubCategory.isEmpty) {
      List<MenuSubCategory> subs = mainSubCategories
          .where((row) => row.categoryID == activeCategoryID)
          .toSet()
          .toList();

      for (var item in subs) {
        if (menus.where((menu) => menu.subCategoryID == item.id).isNotEmpty) {
          availableSubCategory.add(item);
        }
      }
    }
    return availableSubCategory;
  }

  List<Menu> getMenuListByCatagoryID() {
    return menus.where((menu) => menu.categoryID == activeCategoryID).toList();
  }

  List<Menu> getMenuListByActiveSubCatagoryID() {
    return getMenuListBySubCatagoryID(activeSubCategoryID);
  }

  List<Menu> getMenuListBySubCatagoryID(int subID) {
    return menus
        .where((menu) =>
            (subID == 0 || (subID > 0 && menu.subCategoryID == subID)) &&
            menu.categoryID == activeCategoryID)
        .toList();
  }
}
