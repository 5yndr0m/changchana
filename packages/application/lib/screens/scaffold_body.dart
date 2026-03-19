import 'package:flutter/material.dart';

import 'package:chongchana/routing.dart';
import 'package:chongchana/widgets/fade_ransition_page.dart';
import 'booking/booking_screen.dart';
import 'home.dart';
import 'menu.dart';
import 'wallet/wallet_overview.dart';
import 'scaffold.dart';

/// Displays the contents of the body of [ChongjaroenScaffold]
class ChongjaroenScaffoldBody extends StatelessWidget {
  static GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

  const ChongjaroenScaffoldBody({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var currentRoute = RouteStateScope.of(context).route;

    // A nested Router isn't necessary because the back button behavior doesn't
    // need to be customized.
    return Navigator(
      key: navigatorKey,
      onPopPage: (route, dynamic result) => route.didPop(result),
      pages: [
        if (currentRoute.pathTemplate.startsWith('/menu'))
          const FadeTransitionPage<void>(
            key: ValueKey('menu'),
            child: MenuScreen(),
          )
        else if (currentRoute.pathTemplate.startsWith('/booking'))
          const FadeTransitionPage<void>(
            key: ValueKey('booking'),
            child: BookingScreen(),
          )
        else if (currentRoute.pathTemplate.startsWith('/wallet'))
          const FadeTransitionPage<void>(
            key: ValueKey('wallet'),
            child: WalletOverviewScreen(),
          )
        else if (currentRoute.pathTemplate.startsWith('/home') ||
            currentRoute.pathTemplate == '/')
          const FadeTransitionPage<void>(
            key: ValueKey('home'),
            child: HomeScreen(),
          )
        else
          FadeTransitionPage<void>(
            key: const ValueKey('empty'),
            child: Container(),
          ),
      ],
    );
  }
}
