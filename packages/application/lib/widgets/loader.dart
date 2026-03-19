import 'package:chongchana/constants/colors.dart';
import 'package:flutter/material.dart';

class Loader extends StatelessWidget {
  final double opacity;
  final bool dismissibles;
  final Color color;
  final String loadingTxt;
  const Loader({
    Key? key,
    this.opacity = 0.5,
    this.dismissibles = false,
    this.color = ChongjaroenColors.primaryColors,
    this.loadingTxt = 'Loading...',
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Stack(
        children: [
          Opacity(
            opacity: opacity,
            child: ModalBarrier(
              dismissible: dismissibles,
              color: ChongjaroenColors.blackColors,
            ),
          ),
          Center(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                Container(
                  width: 30,
                  height: 30,
                  alignment: Alignment.center,
                  // padding: const EdgeInsets.only(top: 10),
                  margin: const EdgeInsets.only(bottom: 10),
                  child: const CircularProgressIndicator(),
                ),
                Container(
                  margin: const EdgeInsets.only(top: 5),
                  child: Text(loadingTxt,
                      style: const TextStyle(
                        color: ChongjaroenColors.whiteColor,
                        fontSize: 18,
                      )),
                ),
              ],
            ),
          ),
        ],
    );
  }
}
