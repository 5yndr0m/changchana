import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/constants/locales.dart';
import 'package:chongchana/routing.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class Guest extends StatelessWidget {
  final bool isInvert;
  const Guest({
    Key? key,
    this.isInvert = false,
  }) : super(key: key);

  Widget _textInviteToSignIn(BuildContext context) {
    return Center(
      child: Text(
        Locales.SigninShortDetail,
        style: Theme.of(context).textTheme.titleMedium!.merge(
              TextStyle(
                color: isInvert
                    ? ChongjaroenColors.darkGrayColors
                    : ChongjaroenColors.whiteColors,
              ),
            ),
        textAlign: TextAlign.center,
      ),
    );
  }

  Widget _signInButton(BuildContext context) {
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor: ChongjaroenColors.secondaryColors,
        fixedSize: const Size(130, 48),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
      ),
      onPressed: () {
        RouteStateScope.of(context).go('/signin');
      },
      child: Text(
        Locales.THSignIn,
        style: Theme.of(context).textTheme.titleSmall!.merge(
              const TextStyle(
                color: ChongjaroenColors.whiteColor,
              ),
            ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
        padding: const EdgeInsets.symmetric(horizontal: 65, vertical: 16),
        margin: const EdgeInsets.all(30),
        constraints: const BoxConstraints(
          minHeight: 100,
        ),
        decoration: BoxDecoration(
            border: Border.all(
                color: isInvert
                    ? ChongjaroenColors.lightGrayColors
                    : ChongjaroenColors.whiteColors.shade200),
            borderRadius: BorderRadius.circular(6)),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            _textInviteToSignIn(context),
            const SizedBox(height: 16),
            _signInButton(context)
          ],
        ));
  }
}
