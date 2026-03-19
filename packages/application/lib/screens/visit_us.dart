import 'dart:io' show Platform;
import 'package:cached_network_image/cached_network_image.dart';
import 'package:chongchana/constants/chongjaroen_icons.dart';
import 'package:chongchana/models/app_settings.dart';
import 'package:chongchana/services/app_init.dart';
import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/constants/locales.dart';

import 'package:chongchana/models/branch.dart';
import 'package:chongchana/widgets/appbar_button_back.dart';
import 'package:chongchana/widgets/page_title.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';

class VisitUsScreen extends StatefulWidget {
  const VisitUsScreen({Key? key}) : super(key: key);

  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<VisitUsScreen> {
  @override
  void initState() {
    super.initState();
  }

  Future<void> _openUrl(String url) async {
    if (await canLaunch(url)) {
      await launch(
        url,
        forceSafariVC: true,
        forceWebView: true,
        enableJavaScript: true,
        headers: <String, String>{'title': 'Chongjaroen'},
      );
    } else {
      Fluttertoast.showToast(
          msg: "ไม่สามารถเปิด URL นี้ได้",
          backgroundColor: ChongjaroenColors.lightBlackColors);
    }
  }

  Future<void> _openLineAt(String line) async {
    String url = "${Locales.LinePageEnpont}${line.replaceAll("@", "")}";
    if (await canLaunch(url)) {
      await launch(
        url,
        forceSafariVC: true,
        forceWebView: true,
        enableJavaScript: true,
        headers: <String, String>{'title': 'Chongjaroen'},
      );
    } else {
      Fluttertoast.showToast(
          msg: "ไม่สามารถเปิด URL นี้ได้",
          backgroundColor: ChongjaroenColors.lightBlackColors);
    }
  }

  Future<void> _makePhoneCall(String phoneNumber) async {
    final Uri launchUri = Uri(
      scheme: 'tel',
      path: phoneNumber,
    );
    await launch(launchUri.toString());
  }
  
  @override
  Widget build(BuildContext context) {
    return Consumer<ChongjaroenAppInit>(
      builder: (context, appinit, widget) => Scaffold(
        appBar: AppBar(
          centerTitle: true,
          toolbarHeight: 72.0,
          title: SvgPicture.asset('assets/images/logo.svg', height: 36.0),
          backgroundColor: ChongjaroenColors.primaryColors,
          leadingWidth: 100,
          leading: const AppBarButtonBack(),
          bottom: PreferredSize(
            preferredSize: Size.fromHeight(appinit.settings.line.isNotEmpty || appinit.settings.phone.isNotEmpty ? 35 : 0),
            child: appinit.settings.line.isNotEmpty || appinit.settings.phone.isNotEmpty ? chongjaroenContact(appinit.settings) : const SizedBox(),
          ),
        ),
        body: SingleChildScrollView(
          child: Column(
            children: [
              const PageTitle(
                text: Locales.VisitUs,
              ),
              _branchList(appinit.branchs),
            ],
          ),
        ),
      ),
    );
  }

  Widget chongjaroenContact(ApplicationSettings settings) {
    return Container(
      height: 35,
      padding: const EdgeInsets.only(left: 16, right: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          settings.phone.isNotEmpty
              ? Row(
                  children: [
                    const Icon(
                      ChongjaroenIcons.phone_alt,
                      color: ChongjaroenColors.lightGrayColors,
                      size: 15,
                    ),
                    const Padding(
                      padding: EdgeInsets.only(left: 10),
                    ),
                    InkWell(
                      child: Text(
                        settings.phone,
                        style: Theme.of(context).textTheme.bodyMedium!.merge(
                              const TextStyle(
                                fontSize: 15,
                                color: ChongjaroenColors.whiteColors,
                              ),
                            ),
                      ),
                      onTap: () => _makePhoneCall(settings.phone),
                    ),
                  ],
                )
              : const SizedBox(),
          Row(
            children: [
              const Icon(
                ChongjaroenIcons.line,
                color: ChongjaroenColors.lightGrayColors,
                size: 15,
              ),
              const Padding(
                padding: EdgeInsets.only(left: 10),
              ),
              settings.line.isNotEmpty
                  ? InkWell(
                      child: Text(
                        settings.line,
                        style: Theme.of(context).textTheme.bodyMedium!.merge(
                              const TextStyle(
                                fontSize: 15,
                                color: ChongjaroenColors.whiteColors,
                              ),
                            ),
                      ),
                      onTap: () => _openLineAt(settings.line),
                    )
                  : const SizedBox(),
            ],
          )
        ],
      ),
    );
  }

  Widget _branchList(List<Branch> branchs) {
    return ListView.builder(
      controller: ScrollController(),
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: branchs.length,
      itemBuilder: (BuildContext ctx, int index) {
        return Container(
          padding: const EdgeInsets.only(left: 32, right: 32, bottom: 16),
          height: 285,
          width: double.maxFinite,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(6),
          ),
          child: Card(
            shadowColor: ChongjaroenColors.primaryColors.shade200,
            elevation: 2,
            child: Column(
              children: [
                AspectRatio(
                  aspectRatio: 16 / 4.5,
                  child: CachedNetworkImage(
                    imageUrl: branchs[index].coverImage,
                    imageBuilder: (context, imageProvider) => Container(
                      decoration: BoxDecoration(
                        color: ChongjaroenColors.blackColors.shade400,
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
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                const Padding(
                  padding: EdgeInsets.only(bottom: 24),
                ),
                Text(
                  branchs[index].name,
                  style: Theme.of(context).textTheme.titleSmall,
                ),
                Padding(
                  padding: const EdgeInsets.only(
                    top: 8,
                    left: 24,
                    right: 24,
                    bottom: 10,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Icon(
                            ChongjaroenIcons.phone_alt,
                            color: ChongjaroenColors.grayColors,
                            size: 13,
                          ),
                          const Padding(
                            padding: EdgeInsets.only(left: 5),
                          ),
                          InkWell(
                            child: Text(
                              branchs[index].phone,
                              style:
                                  Theme.of(context).textTheme.bodyMedium!.merge(
                                        const TextStyle(
                                          fontSize: 13,
                                          color: ChongjaroenColors.grayColors,
                                        ),
                                      ),
                            ),
                            onTap: () => _makePhoneCall(branchs[index].phone),
                          )
                        ],
                      ),
                      Row(
                        children: [
                          const Icon(
                            ChongjaroenIcons.line,
                            color: ChongjaroenColors.grayColors,
                            size: 13,
                          ),
                          const Padding(
                            padding: EdgeInsets.only(left: 5),
                          ),
                          InkWell(
                            child: Text(
                              branchs[index].line,
                              style:
                                  Theme.of(context).textTheme.bodyMedium!.merge(
                                        const TextStyle(
                                          fontSize: 13,
                                          color: ChongjaroenColors.grayColors,
                                        ),
                                      ),
                            ),
                            onTap: () => _openLineAt(branchs[index].line),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(
                      ChongjaroenIcons.clock,
                      color: ChongjaroenColors.grayColors,
                      size: 13,
                    ),
                    const Padding(
                      padding: EdgeInsets.only(left: 5),
                    ),
                    Text(
                      branchs[index].branchOpen(),
                      style: Theme.of(context).textTheme.bodyMedium!.merge(
                            const TextStyle(
                              fontSize: 13,
                              color: ChongjaroenColors.grayColors,
                            ),
                          ),
                    )
                  ],
                ),
                _btnGoToMap(branchs[index], Platform.isIOS),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _btnGoToMap(Branch branch, bool isIOS) {
    String url = isIOS ? branch.appleMap : branch.googleMap;
    return url != ""
        ? Padding(
            padding: const EdgeInsets.only(left: 24, right: 24, top: 8),
            child: ElevatedButton(
              style: ButtonStyle(
                minimumSize: MaterialStateProperty.resolveWith<Size?>(
                  (Set<MaterialState> states) {
                    return const Size(double.infinity, 44);
                  },
                ),
                backgroundColor: MaterialStateProperty.resolveWith<Color?>(
                  (Set<MaterialState> states) {
                    return ChongjaroenColors.secondaryColors;
                  },
                ),
              ),
              onPressed: () => _openUrl(url),
              child: Text(
                Locales.GetDirection,
                style: Theme.of(context).textTheme.titleSmall!.merge(
                      const TextStyle(
                        color: ChongjaroenColors.whiteColors,
                      ),
                    ),
              ),
            ),
          )
        : const SizedBox();
  }
}
