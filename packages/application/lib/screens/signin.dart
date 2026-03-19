import 'dart:io' show Platform;
import 'package:chongchana/constants/chongjaroen_icons.dart';
import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/constants/locales.dart';
import 'package:chongchana/widgets/appbar_button_back.dart';
import 'package:chongchana/widgets/application_version.dart';
import 'package:chongchana/widgets/loader.dart';
import 'package:chongchana/widgets/page_title.dart';
import 'package:chongchana/widgets/singin_description.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_svg/svg.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:url_launcher/url_launcher.dart';

class Credentials {
  final String username;
  final String password;

  Credentials(this.username, this.password);
}

// ignore: must_be_immutable
class SignInScreen extends StatefulWidget {
  final ValueChanged<Credentials> onSignIn;
  bool isLoading = false;

  SignInScreen({
    required this.onSignIn,
    this.isLoading = false,
    Key? key,
  }) : super(key: key);

  @override
  _SignInScreenState createState() => _SignInScreenState();
}

class _SignInScreenState extends State<SignInScreen> {
  final _usernameController = TextEditingController(text: "");
  final _passwordController = TextEditingController(text: "");
  RegExp isEmail = RegExp(
      r"^([a-zA-Z0-9]+([a-zA-Z0-9]|([\.][^\.])|[_|-])*)@[a-zA-Z0-9]+(((((\-){1}[a-zA-Z0-9]+)*)([a-zA-Z0-9])*\.)+[a-zA-Z]{2,4})$");
  bool obscureText = true;

  Future<void> _onForgetPassword() async {
    final endpoint = dotenv.env['WEBSITE_ENDPOINT'] ?? "";
    if (await canLaunch(endpoint)) {
      bool isIOS = Platform.isIOS;
      await launch(
        "$endpoint/forget-password",
        forceSafariVC: isIOS,
        forceWebView: isIOS,
        enableJavaScript: true,
        headers: <String, String>{'title': 'Chongjaroen'},
      );
    } else {
      throw 'Could not launch $endpoint';
    }
  }

  void _onHandleSignin() {
    Credentials credential = Credentials(
      _usernameController.value.text,
      _passwordController.value.text,
    );
    if (credential.password == "") {
      Fluttertoast.showToast(
        timeInSecForIosWeb: 5,
        msg: Locales.ErrorRecheckUserNamePassword,
        backgroundColor: ChongjaroenColors.lightBlackColors,
      );
    } else {
      widget.onSignIn(credential);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      appBar: AppBar(
        centerTitle: true,
        toolbarHeight: 72.0,
        title: SvgPicture.asset('assets/images/logo.svg', height: 36.0),
        backgroundColor: ChongjaroenColors.primaryColors,
        leadingWidth: 100,
        leading: const AppBarButtonBack(),
      ),
      body: Stack(
        children: [
          _signinForm(),
          widget.isLoading ? const Loader() : const SizedBox(),
        ],
      ),
    );
  }

  Widget _signinForm() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.only(left: 32, right: 32),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Center(
            child: PageTitle(
              text: Locales.ENSignIn,
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(bottom: 6),
            child: Text(
              Locales.Username,
              style: Theme.of(context).textTheme.titleSmall!.merge(
                    const TextStyle(
                      color: ChongjaroenColors.grayColors,
                    ),
                  ),
            ),
          ),
          TextField(
            style: Theme.of(context).textTheme.bodyMedium,
            decoration: InputDecoration(
              hintText: Locales.PlaceholderUsername,
              hintStyle: const TextStyle(color: ChongjaroenColors.grayColors),
              contentPadding: const EdgeInsets.only(left: 16, right: 16),
              fillColor: Colors.white,
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(5),
                borderSide: const BorderSide(
                  color: ChongjaroenColors.primaryColors,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(5),
                borderSide: const BorderSide(
                  color: ChongjaroenColors.lightGrayColors,
                  width: 2.0,
                ),
              ),
            ),
            controller: _usernameController,
          ),
          Padding(
            padding: const EdgeInsets.only(top: 24, bottom: 6),
            child: Text(
              Locales.Password,
              style: Theme.of(context).textTheme.titleSmall!.merge(
                    const TextStyle(
                      color: ChongjaroenColors.grayColors,
                    ),
                  ),
            ),
          ),
          TextField(
            style: Theme.of(context).textTheme.bodyMedium,
            decoration: InputDecoration(
              hintText: Locales.PlaceholderPassword,
              hintStyle: const TextStyle(color: ChongjaroenColors.grayColors),
              contentPadding: const EdgeInsets.only(left: 16, right: 16),
              fillColor: Colors.white,
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(5),
                borderSide: const BorderSide(
                  color: ChongjaroenColors.primaryColors,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(5),
                gapPadding: 2,
                borderSide: const BorderSide(
                  color: ChongjaroenColors.lightGrayColors,
                ),
              ),
              suffixIcon: IconButton(
                iconSize: 12,
                onPressed: () {
                  setState(() {
                    obscureText = !obscureText;
                  });
                },
                icon: obscureText == true
                    ? const Icon(ChongjaroenIcons.eye)
                    : const Icon(ChongjaroenIcons.eye_slash),
              ),
            ),
            obscureText: obscureText,
            controller: _passwordController,
          ),
          Center(
            child: Column(
              children: [
                Container(
                  width: double.infinity,
                  margin: const EdgeInsets.only(top: 24),
                  child: ElevatedButton(
                    onPressed: _onHandleSignin,
                    style: ButtonStyle(
                      backgroundColor:
                          MaterialStateProperty.resolveWith<Color?>(
                        (Set<MaterialState> states) {
                          return ChongjaroenColors.secondaryColors;
                        },
                      ),
                      padding: MaterialStateProperty.resolveWith<EdgeInsets?>(
                        (Set<MaterialState> states) {
                          return const EdgeInsets.only(top: 15, bottom: 15);
                        },
                      ),
                    ),
                    child: Text(
                      Locales.THSignIn,
                      style: Theme.of(context).textTheme.titleSmall!.merge(
                            const TextStyle(
                              color: ChongjaroenColors.whiteColors,
                            ),
                          ),
                    ),
                  ),
                ),
                TextButton(
                  onPressed: _onForgetPassword,
                  style: TextButton.styleFrom(
                    padding: const EdgeInsets.only(top: 24),
                  ),
                  child: Text(
                    Locales.ForGetPassword,
                    style: Theme.of(context).textTheme.titleSmall!.merge(
                          const TextStyle(
                            color: ChongjaroenColors.secondaryColors,
                          ),
                        ),
                  ),
                ),
                const SigninDescriptionWidget(),
                const ApplicationVersion()
              ],
            ),
          ),
        ],
      ),
    );
  }
}
