import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/constants/locales.dart';
import 'package:flutter/material.dart';

class AppBarButtonBack extends StatelessWidget {
  const AppBarButtonBack ({ Key? key }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return TextButton(
      style: TextButton.styleFrom(
        backgroundColor: ChongjaroenColors.whiteColors,
        foregroundColor: ChongjaroenColors.primaryColors,
        textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
      ),
      child: Row(
        children: const [
          SizedBox(width: 5),
          Icon( Icons.arrow_back_ios_new, size: 20 ),
          SizedBox(width: 4),
          Text(Locales.LinkBack)
        ],
      ),
      onPressed: () {
        Navigator.pop(context);
      },
    );
  }
}