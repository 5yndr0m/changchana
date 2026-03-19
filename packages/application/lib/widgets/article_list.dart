import 'package:cached_network_image/cached_network_image.dart';
import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/constants/locales.dart';
import 'package:chongchana/screens/article_detail.dart';
import 'package:chongchana/services/article.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class ArticleList extends StatefulWidget {
  final Widget title;

  const ArticleList({
    Key? key,
    required this.title,
  }) : super(key: key);

  @override
  _ArticleListState createState() => _ArticleListState();
}

class _ArticleListState extends State<ArticleList> {
  @override
  Widget build(BuildContext context) => Consumer<ChongjaroenArticle>(
        builder: (context, data, _) => ListView.builder(
          controller: ScrollController(),
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: data.articles.length,
          itemBuilder: (BuildContext ctx, int index) {
            String publishedAt = data.articles[index].getPublishedAt();
            return Container(
              color: Colors.transparent,
              child: Column(
                children: [
                  index == 0
                      ? Container(
                          padding: const EdgeInsets.only(bottom: 16),
                          color: ChongjaroenColors.primaryColors.shade900,
                          child: widget.title,
                        )
                      : const SizedBox(),
                  ElevatedButton(
                    style: ButtonStyle(
                      shape: MaterialStateProperty.all<RoundedRectangleBorder>(
                        RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(0),
                        ),
                      ),
                      backgroundColor: MaterialStateProperty.all<Color>(
                          ChongjaroenColors.whiteColors.shade900),
                      padding: MaterialStateProperty.all<EdgeInsets>(
                        const EdgeInsets.only(left: 0, right: 0, bottom: 16),
                      ),
                    ),
                    child: Column(
                      children: [
                        _buildImage(data.articles[index].coverUrl,
                            data.articles[index].special),
                        Padding(
                          padding: const EdgeInsets.only(top: 16),
                          child: Text(
                            data.articles[index].title,
                            style: Theme.of(context).textTheme.titleSmall,
                            textAlign: TextAlign.center,
                          ),
                        ),
                        Text(
                          '${Locales.PublishedAt} $publishedAt',
                          style: Theme.of(context)
                              .textTheme
                              .bodyLarge!
                              .merge(const TextStyle(
                                fontSize: 12,
                              )),
                        )
                      ],
                    ),
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) {
                          return ArticleDetailScreen(
                            id: data.articles[index].id,
                            article: data.articles[index],
                          );
                        }),
                      );
                    },
                  ),
                  const Padding(
                    padding: EdgeInsets.only(bottom: 25),
                  ),
                ],
              ),
            );
          },
        ),
      );

  Widget _buildImage(String imgPath, bool isSpecialContent) {
    return Stack(
      alignment: const Alignment(0.95, -0.91),
      children: [
        AspectRatio(
          aspectRatio: 16 / 9,
          child: Container(
            padding: const EdgeInsets.only(left: 0, right: 0, bottom: 0),
            child: ClipRRect(
              child: CachedNetworkImage(
                imageUrl: imgPath,
                imageBuilder: (context, imageProvider) => Container(
                  decoration: BoxDecoration(
                    image: DecorationImage(
                      image: imageProvider,
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                placeholder: (context, url) =>
                    const Center(child: CircularProgressIndicator()),
                errorWidget: (context, url, error) => const Image(
                  image: AssetImage("assets/images/default_article.jpeg"),
                  fit: BoxFit.fitHeight,
                ),
              ),
            ),
          ),
        ),
        isSpecialContent
            ? Container(
                width: 110,
                height: 25,
                padding: const EdgeInsets.only(bottom: 4),
                decoration: const BoxDecoration(
                  borderRadius: BorderRadius.all(Radius.circular(6)),
                  color: ChongjaroenColors.secondaryColor,
                ),
                child: Center(
                  child: Text(
                    Locales.SpecialContent,
                    style: Theme.of(context).textTheme.bodyMedium!.merge(
                          const TextStyle(
                            color: ChongjaroenColors.whiteColors,
                            fontSize: 14,
                          ),
                        ),
                  ),
                ),
              )
            : const SizedBox(),
      ],
    );
  }
}
