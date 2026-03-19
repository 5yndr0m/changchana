import 'package:chongchana/models/article.dart';
import 'package:chongchana/models/service_response.dart';
import 'package:chongchana/services/api/fetch_articles.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';

class ChongjaroenArticle extends ChangeNotifier {
  List<Article> articles = [];
  bool articleLoading = false;
  bool canLoadMore = true;
  int limit = 10;
  int page = 0;

  Future<void> fetchArticleList(bool? special, {bool fetchNew = true}) async {
    articleLoading = true;
    if (fetchNew) {
      articles = [];
      page = 0;
      canLoadMore = true;
    }
    page++;
    ServiceResponse resp = await fetchArticles(
      special,
      page: page,
      limit: limit,
    );
    if (resp.isSuccess) {
      List<dynamic> json = resp.data;
      if (json.isEmpty || json.length < limit) {
        canLoadMore = false;
      }

      for (var row in json) {
        articles.add(Article.fromJson({
          ...row,
          "publishedAt": row["published_at"],
          "coverUrl": row["cover_image"]["url"],
        }));
      }
    }
    articleLoading = false;

    notifyListeners();
  }
}
