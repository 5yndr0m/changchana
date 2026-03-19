import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/constants/locales.dart';
import 'package:chongchana/models/inbox.dart';
import 'package:chongchana/models/service_response.dart';
import 'package:chongchana/services/api/user_inboxs.dart';
import 'package:flutter/widgets.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:jiffy/jiffy.dart';
import 'package:onesignal_flutter/onesignal_flutter.dart';

class InboxService extends ChangeNotifier {
  late ServiceResponse data;
  List<Inbox> list = [];
  bool hasNewItem = false;
  bool canLoadMore = true;
  int limit = 20;
  int page = 0;

  Future<void> fetchInboxList(bool fetchNew) async {
    if (fetchNew) {
      list = [];
      page = 0;
      canLoadMore = true;
    }
    page++;
    if (canLoadMore) {
      data = await fetchInbox(
        page: page,
        limit: limit,
      );
      if (data.isSuccess) {
        List<dynamic> json = data.data;
        if (json.isEmpty || json.length < limit) {
          canLoadMore = false;
        }

        for (var row in json) {
          if (row["readAt"] == null) {
            hasNewItem = true;
          }
          list.add(Inbox.fromJson(row));
        }
      }
      notifyListeners();
    }
  }

  Future<void> updateInboxStatus(int notificationID, String action) async {
    String msg = Locales.InboxDeleted;
    Color color = ChongjaroenColors.completeColor;

    data = await updateInboxActivity(notificationID, action);
    if (data.isSuccess) {
      msg = Locales.InboxDeleted;

      list[list.indexWhere((item) => item.notificationID == notificationID)] =
          Inbox.fromJson(data.data);
      if (action == "delete") {
        list.removeWhere((item) => item.notificationID == notificationID);
      }

      checkHasNewItem();
    } else {
      msg = data.errorMessage;
      color = ChongjaroenColors.redColor;
    }

    if (action == "delete") {
      Fluttertoast.showToast(
        msg: msg,
        timeInSecForIosWeb: 5,
        backgroundColor: color,
      );
    }

    notifyListeners();
  }

  void checkHasNewItem() {
    for (var row in list) {
      if (row.readAt == null) {
        hasNewItem = true;
      }
    }
  }

  void setHasNewItem({bool isNew = true}) {
    hasNewItem = isNew;
    notifyListeners();
  }

  void setNewItemFromNotification(OSNotification noti) {
    Map<String, dynamic>? data = noti.additionalData;
    if (data?["sendingMethod"] == "inbox_push" ||
        data?["sendingMethod"] == "push") {
      setHasNewItem();
      list.insert(
          0,
          Inbox.fromJson({
            "id": data?["timestamp"], // fake id from notification
            "notificationID": data?["notificationID"],
            "title": noti.title,
            "shortDescription": noti.body,
            "readAt": null,
            "publishedAt": Jiffy.now().format(pattern: "yyyy-MM-ddTHH:m:ss"),
            "coverImage": {
              "url": data?["coverImage"],
            }
          }));
    }
    // notifyListeners();
  }
}
