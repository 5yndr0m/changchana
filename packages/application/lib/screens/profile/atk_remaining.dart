import 'dart:async';

import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/constants/locales.dart';
import 'package:chongchana/models/user.dart';
import 'package:flutter/material.dart';

// ignore: must_be_immutable
class ATKRemaining extends StatefulWidget {
  User user;
  ATKRemaining({
    Key? key,
    required this.user,
  }) : super(key: key);

  @override
  // ignore: no_logic_in_create_state
  _ATKRemaining createState() => _ATKRemaining(user);
}

class _ATKRemaining extends State<ATKRemaining> {
  final User _user;
  late Timer _timer;
  Duration countDown = const Duration(hours: 0, minutes: 0, seconds: 0);
  _ATKRemaining(this._user);

  @override
  void initState() {
    WidgetsBinding.instance!.addPostFrameCallback((timeStamp) {
      startTimer();
    });
    super.initState();
  }

  void startTimer() {
    if (_user.atkExpiredAt != null) {
      const oneSec = Duration(seconds: 1);
      _timer = Timer.periodic(
        oneSec,
        (Timer timer) {
          final atkExpiredAt = _user.atkExpiredAt!.toLocal();
          final now = DateTime.now().toLocal();
          setState(() {
            countDown = atkExpiredAt.difference(now);
          });
          if (countDown.inHours == 0 &&
              countDown.inMinutes == 0 &&
              countDown.inSeconds == 0) {
            setState(() {
              timer.cancel();
            });
          }
        },
      );
    }
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  Widget stringcountDown() {
    Widget stringTimer(int _number, String unit) {
      String number = _number.toString();
      return SizedBox(
        width: 65,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              number.length == 2 ? number : "0$number",
              style: Theme.of(context).textTheme.displayLarge!.merge(
                    const TextStyle(
                      fontSize: 36,
                      color: ChongjaroenColors.whiteColors,
                      height: 0.9,
                    ),
                  ),
            ),
            Text(
              unit,
              style: Theme.of(context).textTheme.bodyMedium!.merge(
                    const TextStyle(
                      color: ChongjaroenColors.whiteColors,
                      height: 2.2,
                      fontWeight: FontWeight.w600
                    ),
                  ),
            )
          ],
        ),
      );
    }

    return Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          stringTimer(countDown.inHours, "h"),
          stringTimer(countDown.inMinutes % 60, "m"),
          stringTimer(countDown.inSeconds % 60, "s"),
        ],
      );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(left: 32, right: 32),
      child: _user.atkExpiredAt != null
          ? Container(
              padding: const EdgeInsets.only(top: 16, bottom: 14),
              color: ChongjaroenColors.darkPrimaryColors,
              width: double.infinity,
              child: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.max,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    stringcountDown(),
                    Text(
                      Locales.ATKTimeRemaining,
                      style: Theme.of(context).textTheme.bodyMedium!.merge(
                             TextStyle(
                              fontSize: 15,
                              color: ChongjaroenColors.whiteColors.shade500,
                            ),
                          ),
                    ),
                  ],
                ),
              ),
            )
          : const SizedBox(),
    );
  }
}
