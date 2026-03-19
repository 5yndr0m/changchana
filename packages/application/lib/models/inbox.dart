import 'package:chongchana/constants/colors.dart';
import 'package:flutter/material.dart';
import 'package:jiffy/jiffy.dart';

class Inbox {
  late int id;
  late int notificationID;
  late String title;
  late String description;
  late String shortDescription;
  late String? readAt;
  late String createAt;
  late String publishedAt;
  late String coverUrl;

  Inbox(
    this.id,
    this.title,
    this.shortDescription,
    this.readAt,
    this.createAt,
    this.coverUrl,
  );

  Inbox.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    notificationID = json['notificationID'];
    title = json['title'];
    shortDescription = json['shortDescription'];
    readAt = json['readAt'];
    publishedAt = json['publishedAt'];
    coverUrl = json['coverImage'] != null && json['coverImage']["url"] != null
        ? json['coverImage']["url"]
        : "";
  }

  statusDisplay() {
    if (readAt == null) {
      return Container(
        margin: const EdgeInsets.only(top: 16.0),
        width: 12.0,
        height: 12.0,
        decoration: const BoxDecoration(
          borderRadius: BorderRadius.all(Radius.circular(20)),
          color: ChongjaroenColors.secondaryColor,
        ),
      );
    } else {
      return const SizedBox();
    }
  }

  String getPublishedAt() {
    return Jiffy.parse(publishedAt).format(pattern: 'MMMM do yyyy');
  }

  publishAtDisplay() {
    Jiffy _createAt = Jiffy.parse(publishedAt, pattern: "yyyy-MM-ddTHH:m:ss").add(hours: 7);
    DateTime now = DateTime.now().toUtc().add(const Duration(hours: 7));
    DateTime _create = _createAt.dateTime;
    Duration diff = now.difference(_create);
    late String str = "";
    late double _fontsize = 12.0;
    Color _color = ChongjaroenColors.blackColors;
    if (diff.inDays == 0) {
      str = _createAt.format(pattern: "HH:mm");
    } else if (diff.inDays < 7) {
      str = _createAt.format(pattern: "EE");
    } else if (diff.inDays < 365) {
      str = _createAt.format(pattern: "d MMM");
    } else {
      str = _createAt.format(pattern: "yMMMd");
      _fontsize = 9;
    }

    if (readAt != null) {
      _color = ChongjaroenColors.blackColors.shade300;
    }

    return Text(
      str,
      style: TextStyle(
        color: _color,
        fontSize: _fontsize,
        fontWeight: FontWeight.bold,
      ),
    );
  }
}
