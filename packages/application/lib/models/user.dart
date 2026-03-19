// ignore_for_file: non_constant_identifier_names, unnecessary_getters_setters
import 'package:flutter/material.dart';

class User {
  late String _accessToken;
  late int _userId;
  late String _username;
  late String _shortName;
  late String _firstName = "";
  late String _lastName = "";
  late String _email;
  late String _phone;
  late dynamic _imageProfile;
  late int _points;
  late bool _special;
  late bool _blocked;
  late bool _vaccinated;
  late DateTime? _atkExpiredAt;

  User({
    String? accessToken,
    int? userID,
    String? username,
    String? first_name,
    String? last_name,
    int? points,
    bool? special,
    String? email,
    String? phone,
    dynamic imageProfile,
    bool? blocked,
    bool? vaccinated,
    DateTime? atkExpiredAt,
  }) {
    _accessToken = accessToken ?? "";
    _userId = userID ?? 0;
    _username = username ?? "";
    _firstName = first_name ?? "";
    _lastName = last_name ?? "";
    _points = points ?? 0;
    _special = special ?? false;
    _email = email ?? "";
    _phone = phone ?? "";
    _imageProfile = imageProfile ?? null;
    _blocked = blocked ?? false;
    _vaccinated = vaccinated ?? false;
    _atkExpiredAt = atkExpiredAt;
  }

  // Properties
  int get userId => _userId;
  set userId(int userId) => _userId = userId;

  String get accessToken => _accessToken;
  set accessToken(String accessToken) => _accessToken = accessToken;

  String get username => _username;
  set username(String username) => _username = username;

  String get shortName => _shortName;

  String get firstName => _firstName;
  set name(String firstName) => _firstName = firstName;

  String get lastName => _lastName;
  set lastName(String lastName) => _lastName = lastName;

  int get points => _points;
  set points(int points) => _points = points;

  bool get special => _special;
  set special(bool special) => _special = special;

  dynamic get imageProfile => _imageProfile;
  set imageProfile(dynamic imageProfile) => _imageProfile = imageProfile;

  String get email => _email;
  set email(String email) => _email = email;

  String get phone => _phone;
  set phone(String phone) => _phone = phone;

  bool get blocked => _blocked;
  set blocked(bool blocked) => _blocked = blocked;

  bool get vaccinated => _vaccinated;
  set vaccinated(bool vaccinated) => _vaccinated = vaccinated;

  DateTime? get atkExpiredAt {
    if (DateTime.now().isBefore(_atkExpiredAt ?? DateTime.now())) {
      return _atkExpiredAt;
    }
    return null;
  }

  User.fromJson(Map<String, dynamic> json) {
    _userId = json['userID'];
    _username = json['username'];
    _firstName = json['first_name'];
    _lastName = json['last_name'];
    _points = json['points'] ?? 0;
    _special = json['special'];
    _email = json['email'];
    _phone = json['phone'];
    _imageProfile = NetworkImage(json['profile_image']["url"]);
    _special = json["special"] ?? false;
    _blocked = json["blocked"];
    _vaccinated = json["vaccinated"] ?? false;
    _atkExpiredAt = json["atk_expired_at"] != null
        ? DateTime.parse(json["atk_expired_at"])
        : null;

    if (json['accessToken'] != null) {
      _accessToken = json['accessToken'];
    }
  }

  String getShortName() {
    String first = _firstName != ""
        ? "${_firstName[0].toUpperCase()}${_firstName.substring(1)}"
        : "";
    String last = _lastName != "" ? _lastName[0].toUpperCase() : "";
    return '$first $last.';
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['userId'] = _userId;
    data['accessToken'] = _accessToken;
    data['username'] = _username;
    data['firstName'] = _firstName;
    data['lastName'] = _lastName;
    data['points'] = _points;
    data['special'] = _special;
    data['email'] = _email;
    data['imageProfile'] = _imageProfile;
    data["vaccinated"] = _vaccinated;
    return data;
  }
}
