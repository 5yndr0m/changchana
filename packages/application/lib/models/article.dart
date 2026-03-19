// ignore_for_file: non_constant_identifier_names, unnecessary_getters_setters

// import 'package:intl/intl.dart';
import 'package:jiffy/jiffy.dart';

class Article {
  late int _id;
  late String _title;
  late String _content;
  late String _publishedAt;
  late String _coverLarge;
  late String _coverUrl;
  late bool _special;
  late String _slug;

  Article({
    required int id,
    String? title,
    String? content,
    String? publishedAt,
    String? coverLarge,
    String? coverUrl,
    bool? special,
    String? slug,
  }) {
    _id = id;
    _title = title!;
    _content = content!;
    _publishedAt = publishedAt!;
    _coverLarge = coverLarge!;
    _coverUrl = coverUrl!;
    _slug = slug!;
  }

  // Properties
  int get id => _id;
  set id(int id) => _id = id;

  String get title => _title;
  set title(String title) => _title = title;

  String get content => _content;
  set content(String content) => _content = content;

  String get publishedAt => _publishedAt;
  set publishedAt(String publishedAt) => _publishedAt = publishedAt;

  String get coverLarge => _coverLarge;
  set coverLarge(String coverLarge) => _coverLarge = coverLarge;

  String get coverUrl => _coverUrl;
  set coverUrl(String coverUrl) => _coverUrl = coverUrl;

  String get slug => _slug;
  set slug(String str) => _slug = str;

  bool get special => _special;
  set special(bool _special) => _special = special;

  String getPublishedAt() {
    return Jiffy.parse(_publishedAt).format(pattern: 'MMMM do yyyy');
  }

  Article.fromJson(Map<String, dynamic> json) {
    _id = json['id'];
    _slug = json['slug'];
    _title = json['title'];
    _content = json['content'];
    _publishedAt = json['publishedAt'];
    _coverUrl = json['coverUrl'];
    _special = json['special'] ?? false;
  }
}
