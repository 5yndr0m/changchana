import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/widgets/our_branchs.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

class MenuScreen extends StatelessWidget {
  final String title = 'Menu';

  const MenuScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        toolbarHeight: 72.0,
        leadingWidth: 100,
        title: SvgPicture.asset('assets/images/logo.svg', height: 36.0),
        backgroundColor: ChongjaroenColors.primaryColors,
      ),
      body: const OurBranchsWidgets(),
    );
  }
}
