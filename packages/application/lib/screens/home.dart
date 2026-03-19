import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/constants/locales.dart';
import 'package:chongchana/screens/inbox.dart';
import 'package:chongchana/screens/settings.dart';
import 'package:chongchana/screens/visit_us.dart';
import 'package:chongchana/services/app_init.dart';
import 'package:chongchana/services/article.dart';
import 'package:chongchana/services/inbox.dart';
import 'package:chongchana/widgets/dialog_announcement.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:provider/provider.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';

import 'package:chongchana/services/auth.dart';
import 'package:chongchana/widgets/article_list.dart';
import 'package:chongchana/constants/chongjaroen_icons.dart';
import 'package:chongchana/screens/profile/quick_profile.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late ChongjaroenArticle articles;
  bool enablePullUp = true;
  bool isLoading = false;
  final RefreshController _refreshController =
      RefreshController(initialRefresh: false);

  @override
  void initState() {
    WidgetsBinding.instance!.addPostFrameCallback((timeStamp) {
      articles = Provider.of<ChongjaroenArticle>(context, listen: false);
    });
    super.initState();
  }

  void _onRefresh(ChongjaroenAuth auth) async {
    setState(() {
      isLoading = true;
    });
    ChongjaroenAuth _auth = await auth.fetchProfile();
    setState(() {
      isLoading = _auth.loadingFetchProfile;
      enablePullUp = true;
    });
    _refreshController.refreshCompleted();
  }

  void _onLoading(ChongjaroenAuth auth) async {
    articles.fetchArticleList(auth.isSpecial, fetchNew: false);
    _refreshController.loadComplete();
    setState(() {
      enablePullUp = articles.canLoadMore;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<ChongjaroenAuth>(
      builder: (context, auth, widget) => Scaffold(
        appBar: AppBar(
          centerTitle: true,
          toolbarHeight: 72.0,
          title: SvgPicture.asset('assets/images/logo.svg', height: 36.0),
          backgroundColor: ChongjaroenColors.primaryColors,
          leading: IconButton(
            icon: const Icon(ChongjaroenIcons.map_marker_alt, size: 18),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) {
                    return const VisitUsScreen();
                  },
                ),
              );
            },
          ),
          titleSpacing: 0,
          automaticallyImplyLeading: false,
          actions: [
            if (auth.signedIn) _actions() else const SizedBox(),
          ],
        ),
        backgroundColor: ChongjaroenColors.primaryColors.shade900,
        body: SmartRefresher(
          enablePullDown: true,
          enablePullUp: enablePullUp,
          header: const MaterialClassicHeader(
            backgroundColor: Colors.transparent,
          ),
          footer: const ClassicFooter(
            height: 0,
          ),
          controller: _refreshController,
          onRefresh: () => _onRefresh(auth),
          onLoading: () => _onLoading(auth),
          child: _content(),
        ),
      ),
    );
  }

  Widget _actions() {
    return Row(
      children: [
        _iconInbox(),
        Padding(
          padding: const EdgeInsets.only(right: 24.0),
          child: GestureDetector(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) {
                    return const SettingsScreen();
                  },
                ),
              );
            },
            child: const Icon(
              ChongjaroenIcons.cog,
              size: 18,
            ),
          ),
        ),
      ],
    );
  }

  Widget _iconInbox() {
    return Consumer<InboxService>(
      builder: (context, inbox, widget) => Padding(
        padding: const EdgeInsets.only(right: 20.0),
        child: GestureDetector(
          onTap: () {
            inbox.setHasNewItem(isNew: false);
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) {
                  return InboxScreen();
                },
              ),
            );
          },
          child: Stack(
            alignment: const Alignment(4, -2),
            children: [
              const Icon(
                ChongjaroenIcons.inbox,
                size: 16,
              ),
              inbox.hasNewItem
                  ? Container(
                      margin: const EdgeInsets.only(top: 0.0),
                      width: 8.0,
                      height: 8.0,
                      decoration: const BoxDecoration(
                        borderRadius: BorderRadius.all(Radius.circular(10)),
                        color: ChongjaroenColors.secondaryColor,
                      ),
                    )
                  : const SizedBox(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _content() {
    return Consumer<ChongjaroenAppInit>(
      builder: (context, appInitData, widget) => SingleChildScrollView(
        controller: ScrollController(),
        physics: const NeverScrollableScrollPhysics(),
        child: Column(
          children: [
            DialogAnnouncementWidgets(data: appInitData),
            const QuickProfileWidgets(),
            isLoading == true
                ? const CircularProgressIndicator()
                : ArticleList(
                    title: Row(
                      children: [
                        Container(
                          margin: const EdgeInsets.only(left: 32),
                          child: Text(
                            Locales.NewAndPromotions,
                            style: Theme.of(context).textTheme.titleMedium!.merge(
                                  const TextStyle(
                                    color: ChongjaroenColors.whiteColors,
                                  ),
                                ),
                            textAlign: TextAlign.start,
                          ),
                        ),
                        Expanded(
                          child: Container(
                            margin: const EdgeInsets.only(top: 5),
                            child: const Divider(
                              height: 0,
                              thickness: 1,
                              indent: 5,
                              endIndent: 32,
                              color: Color.fromRGBO(255, 255, 255, 0.3),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
          ],
        ),
      ),
    );
  }
}
