import 'package:cached_network_image/cached_network_image.dart';
import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/constants/locales.dart';
import 'package:chongchana/models/api_response.dart';
import 'package:chongchana/models/article.dart';
import 'package:chongchana/services/api/fetch_article.dart';
import 'package:chongchana/constants/chongjaroen_icons.dart';
import 'package:chongchana/widgets/appbar_button_back.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_html/flutter_html.dart';
import 'package:flutter_svg/svg.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';

class ArticleDetailScreen extends StatefulWidget {
  final int id;
  final Article? article;

  const ArticleDetailScreen({Key? key, required this.id, this.article})
      : super(key: key);

  @override
  _ArticleDetailScreenState createState() => _ArticleDetailScreenState();
}

class _ArticleDetailScreenState extends State<ArticleDetailScreen> {
  Article? _article;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance!.addPostFrameCallback((timeStamp) {
      if (widget.article != null) {
        setState(() {
          _article = widget.article!;
        });
      } else {
        _onFetchArticle(widget.id);
      }
    });
  }

  void _onFetchArticle(int id) async {
    ApiResponse resp = await fetchArticle(id);
    if (resp.ApiError == Null) {
      setState(() {
        _article = resp.Data as Article;
      });
    } else {
      // To alert error

    }
  }

  Future<void> _onShareWithEmptyOrigin(BuildContext context) async {
    final endpoint = dotenv.env['WEBSITE_ENDPOINT'];
    await Share.share("${_article!.title} \n$endpoint/news/${_article!.slug}");
  }

  Future<void> _launchWeb(String url) async {
    if (await canLaunch(url)) {
      await launch(
        url,
        forceSafariVC: false,
        forceWebView: false,
        enableJavaScript: true,
        headers: <String, String>{'title': 'Chongjaroen'},
      );
    } else {
      throw 'Could not launch $url';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        toolbarHeight: 72.0,
        title: SvgPicture.asset('assets/images/logo.svg', height: 36.0),
        backgroundColor: ChongjaroenColors.primaryColors,
        leadingWidth: 100,
        leading: const AppBarButtonBack(),
        actions: <Widget>[
          IconButton(
            icon: const Icon(ChongjaroenIcons.article_share, size: 16),
            tooltip: Locales.Settings,
            onPressed: () => _onShareWithEmptyOrigin(context),
          )
        ],
      ),
      body: _article != null
          ? SingleChildScrollView(
              child: Container(
                padding: const EdgeInsets.all(32),
                child: Column(
                  children: [
                    _imageCover(_article!.coverUrl),
                    const Padding(
                      padding: EdgeInsets.only(bottom: 24),
                    ),
                    Text(
                      _article!.title,
                      style: Theme.of(context).textTheme.titleMedium,
                      textAlign: TextAlign.center,
                    ),
                    Text(
                      '${Locales.PublishedAt} ${_article!.getPublishedAt()}',
                      style: const TextStyle(
                        fontSize: 12,
                        color: ChongjaroenColors.grayColor,
                      ),
                    ),
                    const Padding(
                      padding: EdgeInsets.only(bottom: 10),
                    ),
                    Html(
                      data: _article!.content,
                      style: {
                        "a": Style(
                          color: ChongjaroenColors.darkGrayColor,
                        ),
                        "p": Style(
                          fontSize: FontSize.medium,
                        ),
                        "span": Style(
                          fontSize: FontSize.medium,
                        ),
                        "div": Style(
                          fontSize: FontSize.medium,
                        )
                      },
                      onLinkTap: (url, _, __) => _launchWeb(url ?? ""),
                    ),
                  ],
                ),
              ),
            )
          : const SizedBox(),
    );
  }

  Widget _imageCover(String imgPath) {
    return AspectRatio(
      aspectRatio: 16 / 9,
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
    );
  }
}
