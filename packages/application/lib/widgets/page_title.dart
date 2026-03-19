import 'package:chongchana/constants/colors.dart';
import 'package:flutter/material.dart';

class PageTitle extends StatelessWidget {
  final String title = "page title";
  final Color textColor;
  final String text;

  const PageTitle({
    Key? key,
    required this.text,
    this.textColor = ChongjaroenColors.blackColors,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const Padding(
          padding: EdgeInsets.only(top: 25),
        ),
        Text(
          text,
          style: Theme.of(context).textTheme.headlineMedium!.merge(
                TextStyle(
                  color: textColor,
                ),
              ),
        ),
        const Padding(
          padding: EdgeInsets.only(top: 16),
        ),
        const SizedBox(
          width: 32,
          height: 4,
          child: DecoratedBox(
            decoration: BoxDecoration(
              color: ChongjaroenColors.secondaryColors,
            ),
          ),
        ),
        const Padding(
          padding: EdgeInsets.only(bottom: 24),
        ),
      ],
    );
  }
}
