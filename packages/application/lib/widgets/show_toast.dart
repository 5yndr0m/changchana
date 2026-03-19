import 'package:chongchana/constants/colors.dart';
import 'package:fluttertoast/fluttertoast.dart';

showToast(String message, {int duration = 5}) {
  Fluttertoast.showToast(
    timeInSecForIosWeb: duration,
    msg: message,
    backgroundColor: ChongjaroenColors.lightBlackColors,
  );
}
