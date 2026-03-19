import 'package:chongchana/constants/locales.dart';
import 'package:chongchana/models/service_response.dart';
import 'package:chongchana/services/api/user_profile.dart';
import 'package:flutter/widgets.dart';

import 'package:chongchana/services/api/authentication.dart';
import 'package:chongchana/models/user.dart';
import 'package:onesignal_flutter/onesignal_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Authentication service
class ChongjaroenAuth extends ChangeNotifier {
  final Future<SharedPreferences> _prefs = SharedPreferences.getInstance();
  bool _signedIn = false;
  bool _loadingFetchProfile = false;
  bool alreadyFetchProfile = false;
  late User user = User();

  bool get signedIn => _signedIn;
  bool get isSpecial => user.special;
  bool get loadingFetchProfile => _loadingFetchProfile;
  Future<String?> getAccessToken() async {
    final SharedPreferences prefs = await _prefs;
    return prefs.getString("accessToken");
  }

  Future<void> signOut() async {
    final SharedPreferences prefs = await _prefs;
    _signedIn = false;
    user = User();
    prefs.remove("accessToken");
    prefs.remove("signedIn");
    notifyListeners();
  }

  Future<bool> accountDeleted() async {
    ServiceResponse resp = await accountDelete();
    if (resp.isSuccess) {
      signOut();
    }
    notifyListeners();
    return resp.isSuccess;
  }

  Future<ServiceResponse> signIn(String username, String password) async {
    final SharedPreferences prefs = await _prefs;
    ServiceResponse resp = await authenticateUser(username, password);
    if (resp.isSuccess) {
      user = User.fromJson({
        ...resp.data["user"],
        "userID": resp.data["user"]["id"],
        "accessToken": resp.data["jwt"],
      });

      _signedIn = true;
      prefs.setString("accessToken", user.accessToken);
    } else {
      _signedIn = false;
      prefs.remove("accessToken");

      if (resp.errorMessages.isNotEmpty) {
        String message = resp.errorMessages[0].message;
        if (resp.errorMessages[0].id == "Auth.form.error.invalid") {
          message = Locales.ErrorAuthticateFailed;
        }

        resp.setErrorObject({
          "statusCode": resp.statusCode,
          "message": message,
        });
      }
      // ignore: todo
      // TODO: Need to handle in case error
    }
    notifyListeners();
    return resp;
  }

  Future fetchProfile() async {
    _loadingFetchProfile = true;
    alreadyFetchProfile = true;

    ServiceResponse resp = await getUserProfile();
    if (resp.isSuccess) {
      user = User.fromJson({
        ...resp.data,
        "userID": resp.data["id"],
      });

      _signedIn = true;
      OneSignal.login("${user.userId}");
    } else {
      _signedIn = false;
      // prefs.remove("isSpecial");
      // prefs.setBool("signedIn", _signedIn);

      // ignore: todo
      // TODO: Need to handle in case error
    }
    _loadingFetchProfile = false;

    notifyListeners();
    return this;
  }
}

class ChongjaroenAuthScope extends InheritedNotifier<ChongjaroenAuth> {
  const ChongjaroenAuthScope({
    required ChongjaroenAuth notifier,
    required Widget child,
    Key? key,
  }) : super(key: key, notifier: notifier, child: child);

  static ChongjaroenAuth of(BuildContext context) => context
      .dependOnInheritedWidgetOfExactType<ChongjaroenAuthScope>()!
      .notifier!;
}
