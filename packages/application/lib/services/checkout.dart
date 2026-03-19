import 'package:chongchana/models/service_response.dart';
import 'package:chongchana/services/api/user_checkout.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:jiffy/jiffy.dart';

class CheckoutService extends ChangeNotifier {
  String responseMessage = "";
  late DateTime checkOutTime;
  late String subject;
  late String description;
  late int earnPoints = 0;

  late ServiceResponse resp;
  bool isSuccess = true;
  bool isLoading = false;

  Future<void> checkOut(String code) async {
    checkOutTime = DateTime.now().toLocal();
    isLoading = true;

    String _code = code.replaceAll(RegExp("(http|https)://"), "");
    resp = await userCheckout(_code);
    isSuccess = resp.isSuccess;
    if (resp.isSuccess) {
      dynamic data = resp.data["data"];
      responseMessage = "Success";
      earnPoints = data["earnPoints"] ?? 0;
    } else {
      responseMessage = resp.errorMessage;
    }

    mappingMessageResponse();
    isLoading = false;
    notifyListeners();
  }

  checkOutTimeFormat() {
    String date = Jiffy.parseFromDateTime(checkOutTime).format(pattern: 'yyyy-MM-dd');
    String time = Jiffy.parseFromDateTime(checkOutTime).format(pattern: 'HH:mm');
    return "วันที่ $date เวลา $time";
  }

  mappingMessageResponse() {
    subject = "";
    description = "";
    switch (responseMessage) {
      case "Success":
        subject = "คุณได้รับ $earnPoints Point";
        description = "ขอบคุณที่มาใช้บริการ";
        break;
      case "User not checked in":
        subject = "แสกนเข้าร้านหรือยัง?";
        description = "กรุณาให้พนักงานแสกนเข้าร้านก่อน\nเพื่อใช้งาน";
        break;
      case "User already checked out":
        subject = "คุณได้ทำการแสกนไปแล้ว";
        description = "1 สิทธิ์ / 1 ผู้ใช้งาน";
        break;
      case "Access token not found":
        subject = "ไม่พบผู้ใช้งาน";
        description = "กรุณาเข้าใช้งานระบบใหม่อีกครั้ง";
        break;
      default:
        subject = "พบข้อผิดพลาด";
        description = "QR ไม่ถูกต้อง";
    }
  }
}
