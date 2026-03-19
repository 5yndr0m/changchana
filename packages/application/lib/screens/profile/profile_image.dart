import 'package:chongchana/constants/chongjaroen_icons.dart';
import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/models/user.dart';
import 'package:flutter/material.dart';

// ignore: must_be_immutable
class ProfileImage extends StatelessWidget {
  final String title = 'Menu';
  User user;
  double width;
  double height;
  double vaccineAlignment;
  double vaccineSize;

  ProfileImage({
    Key? key,
    required this.user,
    this.width = 120,
    this.height = 120,
    this.vaccineAlignment = 0.9,
    this.vaccineSize = 20,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment(vaccineAlignment, vaccineAlignment),
      children: [
        Container(
          margin: const EdgeInsets.only(top: 10),
          width: width,
          height: height,
          decoration: BoxDecoration(
            boxShadow: [
              BoxShadow(
                color: ChongjaroenColors.blackColors.shade200,
                spreadRadius: 3,
                blurRadius: 9,
                offset: const Offset(2, 3),
              ),
            ],
            image: user.imageProfile != null
                ? DecorationImage(
                    image: user.imageProfile,
                    fit: BoxFit.cover,
                  )
                : null,
            borderRadius: const BorderRadius.all(Radius.circular(100.0)),
            border: Border.all(
              color: ChongjaroenColors.whiteColors,
              width: 2,
            ),
          ),
        ),
        Container(
          child: user.vaccinated
              ? Container(
                  width: vaccineSize + 6,
                  height: vaccineSize + 6,
                  decoration: const BoxDecoration(
                    borderRadius: BorderRadius.all(Radius.circular(30)),
                    color: ChongjaroenColors.whiteColor,
                  ),
                  child: Icon(
                    ChongjaroenIcons.vaccinated,
                    color: ChongjaroenColors.secondaryColors,
                    size: vaccineSize,
                  ),
                )
              : const SizedBox(),
        ),
      ],
    );
  }
}
