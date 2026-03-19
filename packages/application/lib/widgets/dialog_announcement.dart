import 'package:cached_network_image/cached_network_image.dart';
import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/constants/locales.dart';
import 'package:chongchana/models/app_settings.dart';
import 'package:chongchana/services/app_init.dart';
import 'package:flutter/material.dart';
import 'package:flutter_html/flutter_html.dart';
import 'package:flutter_widget_from_html/flutter_widget_from_html.dart';
import 'package:url_launcher/url_launcher.dart';

// ignore: must_be_immutable
class DialogAnnouncementWidgets extends StatefulWidget {
  ChongjaroenAppInit data;
  DialogAnnouncementWidgets({Key? key, required this.data}) : super(key: key);

  @override
  _DialogAnnouncementWidgetsState createState() =>
      _DialogAnnouncementWidgetsState();
}

class _DialogAnnouncementWidgetsState extends State<DialogAnnouncementWidgets> {
  final String title = 'Announcement';
  late ChongjaroenAppInit appInit = widget.data;

  Future<ChongjaroenAppInit?> _checkApplicationSettings() async {
    if (appInit.showDialog) {
      return appInit;
    } else {
      return null;
    }
  }

  Future<bool> _launchWeb(String url) async {
    if (await canLaunch(url)) {
      await launch(
        url,
        forceSafariVC: true,
        forceWebView: true,
        enableJavaScript: true,
        headers: <String, String>{'title': 'Chongjaroen'},
      );
      return true;
    } else {
      throw 'Could not launch $url';
    }
  }

  _showDialog(ChongjaroenAppInit data) {
    if (data.showDialog) {
      appInit.showDialog = false;

      if (data.settings.serverStatus == ServerStatus.maintenance) {
        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (BuildContext context) => AlertDialog(
            shape: const RoundedRectangleBorder(
              borderRadius: BorderRadius.all(Radius.circular(6)),
            ),
            titlePadding: const EdgeInsets.all(0),
            insetPadding: const EdgeInsets.only(left: 32, right: 32),
            contentPadding: const EdgeInsets.only(left: 24, right: 24, top: 24),
            actionsPadding: const EdgeInsets.all(24),
            title: Image.asset("assets/images/server_maintenance.png"),
            content: Text(data.settings.announcement!.description),
            actions: [
              Container(
                width: double.infinity,
                height: 40.0,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(6),
                  color: ChongjaroenColors.redColors,
                ),
                child: TextButton(
                  onPressed: () {
                    Navigator.pop(context, Locales.Close);
                    appInit.fetchDataAppInit();
                  },
                  child: Text(
                    Locales.Close,
                    style: Theme.of(context).textTheme.titleMedium!.merge(
                          const TextStyle(
                            color: ChongjaroenColors.whiteColors,
                          ),
                        ),
                  ),
                ),
              )
            ],
          ),
        );
      } else {
        final now = DateTime.now();
        if (now.difference(data.lastSeenAnnouncement).inHours > 3) {
          showDialog(
            context: context,
            barrierDismissible: false,
            builder: (BuildContext context) => AlertDialog(
              shape: const RoundedRectangleBorder(
                borderRadius: BorderRadius.all(Radius.circular(6)),
              ),
              titlePadding: const EdgeInsets.all(0),
              insetPadding: const EdgeInsets.only(left: 32, right: 32),
              contentPadding:
                  const EdgeInsets.only(left: 24, right: 24, top: 24),
              actionsPadding: const EdgeInsets.all(24),
              title: SizedBox(
                height: 165,
                child: CachedNetworkImage(
                  imageUrl: data.settings.announcement!.coverUrl,
                  imageBuilder: (context, imageProvider) => Container(
                    decoration: BoxDecoration(
                      borderRadius: const BorderRadius.only(
                        topLeft: Radius.circular(6.0),
                        topRight: Radius.circular(6.0),
                      ),
                      image: DecorationImage(
                        image: imageProvider,
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  placeholder: (context, url) => const Center(
                    child: CircularProgressIndicator(),
                  ),
                  errorWidget: (context, url, error) => const Image(
                    image: AssetImage("assets/images/default_article.jpeg"),
                    fit: BoxFit.fitHeight,
                  ),
                ),
              ),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    HtmlWidget(
                      data.settings.announcement!.description,
                      textStyle: Theme.of(context).textTheme.bodyMedium!.merge(
                      const TextStyle(
                        color: ChongjaroenColors.darkGrayColor,
                      ),
                    ),
                      onTapUrl: (url) => _launchWeb(url),
                    ),
                  ],
                ),
              ),
              actions: [
                Container(
                  width: double.infinity,
                  height: 40.0,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(6),
                    color: ChongjaroenColors.secondaryColors,
                  ),
                  child: TextButton(
                    onPressed: () {
                      Navigator.pop(context, Locales.Close);
                      data.setLastSeenAnnouncement();
                    },
                    child: Text(
                      Locales.Close,
                      style: Theme.of(context).textTheme.titleMedium!.merge(
                            const TextStyle(
                              color: ChongjaroenColors.whiteColors,
                            ),
                          ),
                    ),
                  ),
                )
              ],
            ),
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<ChongjaroenAppInit?>(
      future: _checkApplicationSettings(),
      builder:
          (BuildContext context, AsyncSnapshot<ChongjaroenAppInit?> snapshot) {
        if (snapshot.hasData) {
          Future(() {
            _showDialog(snapshot.data as ChongjaroenAppInit);
          });
        }
        return const SizedBox();
      },
    );
  }
}
