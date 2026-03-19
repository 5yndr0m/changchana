class Announcement {
  late int id;
  late bool enable;
  late bool isMaintenance;
  late String description;
  late String coverUrl;

  Announcement({
    this.id = 0,
    this.enable = false,
    this.coverUrl = "",
    this.description = "",
    this.isMaintenance = false,
  });
  Announcement.fromJson(Map<String, dynamic> json) {
    id = json["id"];
    enable = json["enable"];
    description = json["description"];
    coverUrl = json["cover_image"]["url"];
  }
}
