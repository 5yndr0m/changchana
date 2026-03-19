// ignore_for_file: unnecessary_getters_setters

import 'package:chongchana/models/article.dart';

class Articles {
  late List<Article> _articles = [];

  Articles({
    List<Article>? articles,
  }) {
    _articles = articles ?? [];
  }

  List<Article> get articles => _articles;
  set articles(List<Article> articles) => _articles = articles;

  Articles.fromJson(List<dynamic> json) {
    for (var row in json) {
      articles.add(Article.fromJson({
        ...row,
        "publishedAt": row["published_at"],
        "coverUrl": row["cover_image"]["url"],
      }));

      // articles.add(Article(
      //     id: row["id"],
      //     title: row["title"],
      //     coverUrl: row["coverUrl"],
      //     coverLarge: row["coverLarge"],
      //     content: row["content"],
      //     publishedAt: row["publishedAt"],
      //     special: row["special"]));
    }
  }
}
