class Menu {
  late int id;
  late int categoryID;
  late int subCategoryID;
  late String name;
  late String description;
  late String coverUrl;

  Menu(
    this.id,
    this.name,
    this.description,
    this.categoryID,
    this.coverUrl,
    this.subCategoryID,
  );

  Menu.fromJson(Map<String, dynamic> json) {
    try {
      id = json['id'];
      categoryID = json['menu_category'];
      subCategoryID = json['menu_sub_category'];
      name = json['name'];
      description = json['description'];
      if (!["", null, false].contains(json["cover_image"])) {
        coverUrl = json["cover_image"]["url"];
      } else {
        coverUrl = "";
      }
    } catch (e) {
      // ignore: avoid_print
      print("Error from Menu class: $e");
    }
  }
}
