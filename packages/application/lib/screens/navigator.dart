import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/models/api_response.dart';
import 'package:chongchana/models/service_response.dart';
import 'package:chongchana/screens/inbox.dart';
import 'package:chongchana/screens/inbox_detail.dart';
import 'package:chongchana/screens/menu.dart';
import 'package:chongchana/screens/visit_us.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';

import '../routing.dart';
import '../widgets/fade_ransition_page.dart';

import '../services/auth.dart';
import 'scaffold.dart';
import 'settings.dart';
import 'article_detail.dart';
import 'signin.dart';

/// Builds the top-level navigator for the app. The pages to display are based
/// on the `routeState` that was parsed by the TemplateRouteParser.
class ChongjaroenNavigator extends StatefulWidget {
  final GlobalKey<NavigatorState> navigatorKey;

  const ChongjaroenNavigator({
    required this.navigatorKey,
    Key? key,
  }) : super(key: key);

  @override
  _ChongjaroenNavigatorState createState() => _ChongjaroenNavigatorState();
}

class _ChongjaroenNavigatorState extends State<ChongjaroenNavigator> {
  final _homePageKey = const ValueKey<String>('home');
  final _settingPageKey = const ValueKey<String>('settings');
  final _visitUsPageKey = const ValueKey<String>('visitUs');
  final _signinPageKey = const ValueKey<String>('signin');
  final _articleDetailPageKey = const ValueKey<String>('articleDetail');
  final _inboxPageKey = const ValueKey<String>('inbox');
  final _inboxDetailPageKey = const ValueKey<String>('inboxDetail');
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    final routeState = RouteStateScope.of(context);
    final authState = ChongjaroenAuthScope.of(context);
    final pathTemplate = routeState.route.pathTemplate;
    final String contentID = routeState.route.parameters["id"] ?? "0";

    Future<void> _onHandleSignin(Credentials credentials) async {
      setState(() {
        _isLoading = true;
      });
      ServiceResponse resp = await authState.signIn(
        credentials.username,
        credentials.password,
      );
      if (resp.isSuccess) {
        routeState.go('/home');
      } else {
        FocusScope.of(context).requestFocus(FocusNode());
        // Need to handle error
        Fluttertoast.showToast(
          timeInSecForIosWeb: 5,
          msg: resp.errorMessage,
          backgroundColor: ChongjaroenColors.lightBlackColors,
        );
      }
      setState(() {
        _isLoading = false;
      });
    }

    return Navigator(
      key: widget.navigatorKey,
      onPopPage: (route, dynamic result) {
        if (route.settings is Page &&
            ((route.settings as Page).key == _articleDetailPageKey ||
                (route.settings as Page).key == _settingPageKey ||
                (route.settings as Page).key == _visitUsPageKey ||
                (route.settings as Page).key == _inboxPageKey ||
                (route.settings as Page).key == _signinPageKey)) {
          routeState.go('/home');
        } else if (route.settings is Page &&
            ((route.settings as Page).key == _inboxDetailPageKey)) {
          routeState.go('/inbox');
        }
        return route.didPop(result);
      },
      pages: [
        FadeTransitionPage<void>(
          key: _homePageKey,
          child: const ChongjaroenScaffold(),
        ),
        if (pathTemplate == '/article/:id')
          MaterialPage<void>(
            key: _articleDetailPageKey,
            child: ArticleDetailScreen(
              id: int.parse(contentID),
            ),
          )
        else if (pathTemplate == '/branch/:id/menus')
          MaterialPage<void>(
            key: _articleDetailPageKey,
            child: const MenuScreen(),
          )
        else if (pathTemplate == '/settings')
          MaterialPage<void>(
            key: _settingPageKey,
            child: const SettingsScreen(),
          )
        else if (pathTemplate == '/visit-us')
          MaterialPage<void>(
            key: _visitUsPageKey,
            child: const VisitUsScreen(),
          )
        else if (pathTemplate == '/signin')
          MaterialPage<void>(
            key: _signinPageKey,
            child: SignInScreen(
              isLoading: _isLoading,
              onSignIn: _onHandleSignin,
            ),
          )
        else if (pathTemplate == '/inbox')
          MaterialPage<void>(
            key: _inboxPageKey,
            child: InboxScreen(),
            
          )
        else if (pathTemplate == '/inbox/:id')
          MaterialPage<void>(
            key: _inboxDetailPageKey,
            child: InboxDetailScreen(
              notificationID: int.parse(contentID),
            ),
          )
      ],
    );
  }
}
