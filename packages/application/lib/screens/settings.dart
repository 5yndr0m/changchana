import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/widgets/appbar_button_back.dart';
import 'package:chongchana/screens/profile/profile.dart';
import 'package:chongchana/widgets/checkout_scanner.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:chongchana/constants/chongjaroen_icons.dart';

class SettingsScreen extends StatelessWidget {
  final String title = 'Settings';

  const SettingsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        toolbarHeight: 72.0,
        title: SvgPicture.asset('assets/images/logo.svg', height: 36.0),
        backgroundColor: ChongjaroenColors.primaryColors,
        leadingWidth: 100,
        leading: const AppBarButtonBack(),
        actions: [
          IconButton(
            icon: const Icon(ChongjaroenIcons.qrcode, size: 18),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const CheckoutScanner(),
                ),
              );
            },
          ),
        ],
      ),
      body: const ProfileWidgets(),
    );
  }
}
