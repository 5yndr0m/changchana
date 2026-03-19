import 'dart:io' show Platform;
import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/constants/locales.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:url_launcher/url_launcher.dart';

class SigninDescriptionWidget extends StatelessWidget {
  const SigninDescriptionWidget({Key? key}) : super(key: key);

  Future<void> _launchInWebViewOrVC() async {
    final endpoint = dotenv.env['WEBSITE_ENDPOINT'] ?? "";
    if (await canLaunch(endpoint)) {
      bool isIOS = Platform.isIOS;
      await launch(
        endpoint,
        forceSafariVC: isIOS,
        forceWebView: isIOS,
        enableJavaScript: true,
        headers: <String, String>{'title': 'Chongjaroen'},
      );
    } else {
      throw 'Could not launch $endpoint';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(top: 16),
      child: Center(
        child: RichText(
          textAlign: TextAlign.center,
          text: TextSpan(
            children: [
              TextSpan(
                text: '${Locales.TextEditProfileDetail} ',
                style: Theme.of(context).textTheme.bodyMedium!.merge(
                      const TextStyle(
                        fontSize: 12,
                        color: ChongjaroenColors.grayColors,
                      ),
                    ),
              ),
              TextSpan(
                text: Locales.ClickHere,
                style: Theme.of(context).textTheme.bodyMedium!.merge(
                      const TextStyle(
                        fontSize: 12,
                        color: ChongjaroenColors.secondaryColors,
                      ),
                    ),
                recognizer: TapGestureRecognizer()
                  ..onTap = () {
                    _launchInWebViewOrVC();
                  },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
