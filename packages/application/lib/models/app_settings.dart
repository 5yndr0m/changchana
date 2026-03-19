import 'package:chongchana/models/announcement.dart';

enum ServerStatus {
  live,
  maintenance,
}

class ApplicationSettings {
  late String bookingConditions;
  late String line;
  late String phone;
  late ServerStatus serverStatus;
  late Announcement? announcement;

  ApplicationSettings({
    this.bookingConditions = "",
    this.announcement,
    this.line = "",
    this.phone = "",
    this.serverStatus = ServerStatus.live,
  });
  ApplicationSettings.fromJson(Map<String, dynamic> json) {
    try {
      bookingConditions = json["booking_conditions"];
      serverStatus = json["server_status"] == "maintenance"
          ? ServerStatus.maintenance
          : ServerStatus.live;
      line = json["line"] ?? "";
      phone = json["phone"] ?? "";

      if (serverStatus == ServerStatus.maintenance) {
        announcement = Announcement(
            isMaintenance: true,
            enable: true,
            description: "Server is maintenance");
      } else {
        announcement = Announcement.fromJson(json["announcement"]);
      }
    } catch (e) {
      print("Error from ApplicationSettings class: $e");
    }
  }
}
