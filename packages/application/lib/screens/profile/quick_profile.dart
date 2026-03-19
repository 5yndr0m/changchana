import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/constants/locales.dart';
import 'package:chongchana/models/user.dart';
import 'package:chongchana/screens/profile/atk_remaining.dart';
import 'package:chongchana/screens/profile/guest.dart';
import 'package:chongchana/screens/profile/profile_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:chongchana/services/auth.dart';

class QuickProfileWidgets extends StatelessWidget {
  const QuickProfileWidgets({
    Key? key,
    this.isInvert = false,
  }) : super(key: key);

  final bool isInvert;

  Widget profileContent(BuildContext context, User user) {
    return Container(
      padding: const EdgeInsets.fromLTRB(24, 16, 16, 16),
      margin: const EdgeInsets.only(top: 32, left: 32, right: 32),
      decoration: const BoxDecoration(
        color: ChongjaroenColors.secondaryColors,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(40),
          topRight: Radius.circular(4),
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          Expanded(
            flex: 5,
            child: Container(
              color: Colors.transparent,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  ProfileImage(
                    user: user,
                    width: 48,
                    height: 48,
                    vaccineAlignment: 1,
                    vaccineSize: 12,
                  ),
                  Container(
                    margin: const EdgeInsets.only(top: 13),
                    child: Text(
                      user.getShortName(),
                      style: Theme.of(context).textTheme.titleMedium!.merge(
                            const TextStyle(
                              color: ChongjaroenColors.whiteColors,
                            ),
                          ),
                    ),
                  ),
                  Row(
                    children: [
                      Container(
                        child: user.special
                            ? Container(
                                padding: const EdgeInsets.only(
                                    left: 4, right: 4, bottom: 4, top: 0),
                                margin: const EdgeInsets.only(right: 5, top: 2),
                                decoration: const BoxDecoration(
                                  borderRadius:
                                      BorderRadius.all(Radius.circular(4)),
                                  color: ChongjaroenColors.primaryColor,
                                ),
                                child: Text(
                                  Locales.Partner,
                                  style: Theme.of(context)
                                      .textTheme
                                      .bodyMedium!
                                      .merge(
                                        const TextStyle(
                                          color: ChongjaroenColors.whiteColors,
                                          fontSize: 13,
                                        ),
                                      ),
                                ),
                              )
                            : null,
                      ),
                      Text(
                        "${user.points} ${Locales.Points}",
                        style: Theme.of(context).textTheme.bodyMedium!.merge(
                              const TextStyle(
                                fontSize: 15,
                                color: ChongjaroenColors.whiteColors,
                              ),
                            ),
                      )
                    ],
                  ),
                  const SizedBox(height: 8),
                  // Wallet Balance Display
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: Colors.white.withOpacity(0.3),
                        width: 1,
                      ),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(3),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Icon(
                            Icons.account_balance_wallet,
                            size: 12,
                            color: ChongjaroenColors.whiteColors,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Flexible(
                          child: Text(
                            '฿1,250.00',
                            style: Theme.of(context).textTheme.bodyMedium!.merge(
                                  const TextStyle(
                                    fontSize: 14,
                                    color: ChongjaroenColors.whiteColors,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  )
                ],
              ),
            ),
          ),
          Expanded(
            flex: 5,
            child: Container(
              alignment: Alignment.topRight,
              color: Colors.transparent,
              child: TextButton(
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(6),
                  child: QrImageView(
                    data: "${user.userId}",
                    version: QrVersions.auto,
                    size: 110,
                    backgroundColor: ChongjaroenColors.whiteColors,
                  ),
                ),
                onPressed: () => showDialog<String>(
                  context: context,
                  barrierDismissible: false,
                  builder: (BuildContext context) => AlertDialog(
                    backgroundColor: ChongjaroenColors.secondaryColors,
                    contentPadding: const EdgeInsets.only(top: 15),
                    content: Stack(
                      alignment: Alignment.center,
                      children: <Widget>[
                        Container(
                          width: 232,
                          height: 257,
                          padding: const EdgeInsets.only(
                              top: 15, bottom: 0, left: 0),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(6),
                            color: ChongjaroenColors.whiteColors,
                          ),
                          child: Column(
                            children: [
                              QrImageView(
                                data: '${user.userId}',
                                backgroundColor: ChongjaroenColors.whiteColors,
                                size: 190,
                              ),
                              SizedBox(
                                height: 15,
                                child: LayoutBuilder(
                                  builder: (BuildContext context,
                                      BoxConstraints constraints) {
                                    final boxHeight =
                                        constraints.constrainHeight();
                                    const dashWidth = 2.0;
                                    const dashHeight = 0.7;
                                    final dashCount = (boxHeight * 2.1).floor();
                                    return Flex(
                                      children: List.generate(dashCount, (_) {
                                        return const SizedBox(
                                          width: dashWidth,
                                          height: dashHeight,
                                          child: DecoratedBox(
                                            decoration: BoxDecoration(
                                              color:
                                                  ChongjaroenColors.grayColors,
                                            ),
                                          ),
                                        );
                                      }),
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      direction: Axis.horizontal,
                                    );
                                  },
                                ),
                              ),
                              Text(
                                user.getShortName(),
                                style: Theme.of(context).textTheme.titleSmall,
                              ),
                              const Padding(
                                padding: EdgeInsets.only(bottom: 0, top: 15),
                              )
                            ],
                          ),
                        ),
                      ],
                    ),
                    actions: [
                      Container(
                        width: double.infinity,
                        height: 40.0,
                        margin: const EdgeInsets.only(
                            left: 15, right: 15, bottom: 5),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(6),
                          color: ChongjaroenColors.whiteColors,
                        ),
                        child: TextButton(
                          onPressed: () =>
                              Navigator.pop(context, Locales.Close),
                          child: Text(
                            Locales.Close,
                            style: Theme.of(context).textTheme.titleSmall,
                          ),
                        ),
                      )
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<ChongjaroenAuth>(
      builder: (context, auth, widget) => Center(
        child: Column(
          children: [
            auth.signedIn
                ? Padding(
                    padding: const EdgeInsets.only(bottom: 26),
                    child: Column(
                      children: [
                        profileContent(context, auth.user),
                        auth.user.atkExpiredAt != null
                            ? ATKRemaining(user: auth.user)
                            : const SizedBox(),
                      ],
                    ),
                  )
                : Guest(isInvert: isInvert),
          ],
        ),
      ),
    );
  }
}
