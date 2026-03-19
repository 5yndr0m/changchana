import 'package:cached_network_image/cached_network_image.dart';
import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/constants/locales.dart';
import 'package:chongchana/models/inbox.dart';
import 'package:chongchana/services/inbox.dart';
import 'package:chongchana/widgets/appbar_button_back.dart';
import 'package:flutter/material.dart';
import 'package:flutter_html/flutter_html.dart';
import 'package:flutter_svg/svg.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';

class InboxDetailScreen extends StatefulWidget {
  final int notificationID;
  const InboxDetailScreen({Key? key, required this.notificationID})
      : super(key: key);

  @override
  _InboxDetailScreenState createState() => _InboxDetailScreenState();
}

class _InboxDetailScreenState extends State<InboxDetailScreen> {
  late InboxService _inboxNotify;
  late Inbox inbox;

  @override
  void initState() {
    _inboxNotify = Provider.of<InboxService>(context, listen: false);
    setState(() {
      inbox = _inboxNotify.list
          .firstWhere((item) => item.notificationID == widget.notificationID);
    });
    WidgetsBinding.instance!.addPostFrameCallback((timeStamp) {});
    super.initState();
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
      ),
      body: SingleChildScrollView(
        child: Container(
          padding: const EdgeInsets.all(26),
          child: Column(
            children: [
              Text(
                inbox.title,
                style: Theme.of(context).textTheme.titleLarge,
                textAlign: TextAlign.center,
              ),
              Text(
                '${Locales.InboxPublishedAt} ${inbox.getPublishedAt()}',
                style: Theme.of(context).textTheme.bodyMedium!.merge(
                      const TextStyle(
                        fontSize: 13,
                        color: ChongjaroenColors.grayColors,
                      ),
                    ),
              ),
              _imageCover(inbox.coverUrl),
              const Padding(
                padding: EdgeInsets.only(bottom: 24),
              ),
              Html(
                data: inbox.shortDescription,
                style: {
                  "a": Style(
                    color: ChongjaroenColors.darkGrayColor,
                  ),
                },
                onLinkTap: (url, _, __) => _launchWeb(url ?? ""),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _imageCover(String imgPath) {
    return imgPath != ""
        ? Column(
            children: [
              const Padding(
                padding: EdgeInsets.only(bottom: 24),
              ),
              AspectRatio(
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
                  placeholder: (context, urrl) =>
                      const Center(child: CircularProgressIndicator()),
                  errorWidget: (context, url, error) => const Image(
                    image: AssetImage("assets/images/default_article.jpeg"),
                    fit: BoxFit.fitHeight,
                  ),
                ),
              )
            ],
          )
        : const SizedBox();
  }
}
