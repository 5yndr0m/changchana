import 'package:chongchana/models/service_response.dart';
import 'package:chongchana/services/api/fetcher.dart';
import 'package:flutter/foundation.dart';
import 'package:jiffy/jiffy.dart';

// ignore_for_file: constant_identifier_names
const String API_GET_BOOKING = '/api/get-bookings';
const String API_ADD_BOOKING = '/api/create-booking';
const String API_CANCEL_BOOKING = '/api/cancel-booking';
const String API_FULLY_BOOKING = '/fully-bookeds';
const String API_BRANCH_AVAILABLE = '/fully-bookeds/branchs/available';

enum BookingStatus { pending, waiting, cancelled, reject, approved }
enum FullyBookingStatus { event, full, closed }

extension BookingStatusExtension on BookingStatus {
  String toValue() {
    return toString().split('.').last;
  }
}

extension FullyBookingStatusExtension on FullyBookingStatus {
  String toValue() {
    return toString().split('.').last;
  }
}

class BookingData {
  final int id;
  final int branchID;
  final String branchName;
  final DateTime date;
  final String name;
  final String phone;
  BookingStatus status;
  final int peopleAmount;
  final List<dynamic> bookingRemarks;

  BookingData({
    required this.id,
    required this.branchID,
    required this.branchName,
    required this.date,
    required this.name,
    required this.phone,
    required this.status,
    required this.peopleAmount,
    required this.bookingRemarks,
  });

  factory BookingData.fromJson(Map<String, dynamic> json) {
    Map<String, dynamic> branch = json['branch'];

    BookingStatus status;
    switch (json['status']) {
      case 'cancelled':
        status = BookingStatus.cancelled;
        break;
      case 'waiting':
        status = BookingStatus.waiting;
        break;
      case 'reject':
        status = BookingStatus.reject;
        break;
      case 'approved':
        status = BookingStatus.approved;
        break;
      case 'pending':
      default:
        status = BookingStatus.pending;
    }

    return BookingData(
      id: json['id'],
      branchID: branch['id'],
      branchName: branch['name'],
      date: DateTime.parse(json['date']),
      name: json['name'],
      phone: json['phone'],
      status: status,
      peopleAmount: json['people_amount'],
      bookingRemarks: branch["booking_remarks"] ?? [],
    );
  }
}

class FullyBookingData {
  final int id;
  final int branchID;
  final DateTime date;
  final String name;
  FullyBookingStatus type;

  FullyBookingData({
    required this.id,
    required this.branchID,
    required this.date,
    required this.name,
    required this.type,
  });

  factory FullyBookingData.fromJson(Map<String, dynamic> json) {
    Map<String, dynamic>? branch = json['branch'];
    FullyBookingStatus type;
    switch (json['type']) {
      case 'event':
        type = FullyBookingStatus.event;
        break;
      case 'closed':
        type = FullyBookingStatus.closed;
        break;
      case 'full':
      default:
        type = FullyBookingStatus.full;
    }

    return FullyBookingData(
      id: json['id'] ?? 0,
      branchID: branch?['id'] ?? 0,
      date: DateTime.parse(json['date']),
      name: json['name'] ?? '',
      type: type,
    );
  }
}

class AddBookingData {
  AddBookingData(
      {this.branchID = "",
      this.name = "",
      this.phone = "",
      this.date = "",
      this.peopleAmount = ""});
  String branchID;
  String name;
  String phone;
  String date;
  String peopleAmount;
}

class BranchAvailable {
  final int id;
  final String name;
  BranchAvailable({
    required this.id,
    required this.name,
  });
}

class BookingModel extends ChangeNotifier {
  late bool _isLoading = false;
  final List<BookingData> _pastBookings = [];
  final List<BookingData> _bookings = [];
  final List<FullyBookingData> _fullyBookings = [];
  final List<BranchAvailable> _branchAvailable = [];

  BookingModel() {
    // Initialize on first time use
    loadBooking();
    getFullyBooking();
  }

  bool get isLoading => _isLoading;
  List<BookingData> get pastBookings => _pastBookings;
  List<BookingData> get bookings => _bookings;
  List<FullyBookingData> get fullyBookings => _fullyBookings;
  List<BranchAvailable> get branchAvailable => _branchAvailable;

  set isLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  Future<void> loadBooking() async {
    isLoading = true;
    ServiceResponse resp = await Fetcher.fetch(Fetcher.get, API_GET_BOOKING);
    isLoading = false;
    if (!resp.isSuccess) return; // throw resp.errorMessage;

    _pastBookings.clear();
    _bookings.clear();

    Map<String, dynamic> json = resp.data;

    List<dynamic> pastBookings = json['pastBookings'];
    for (var data in pastBookings) {
      _pastBookings.add(BookingData.fromJson(data));
    }

    List<dynamic> bookings = json['bookings'];
    for (var data in bookings) {
      _bookings.add(BookingData.fromJson(data));
    }

    isLoading = false;
    notifyListeners();
  }

  Future<void> cancelBooking(int id) async {
    isLoading = true;
    ServiceResponse resp =
        await Fetcher.fetch(Fetcher.get, API_CANCEL_BOOKING, params: {
      "id": id,
    });
    isLoading = false;
    if (!resp.isSuccess) throw resp.errorMessage;

    // Update state
    BookingData bookingItem =
        _bookings.singleWhere((element) => element.id == id);
    bookingItem.status = BookingStatus.cancelled;

    notifyListeners();
  }

  Future<int> addBooking(AddBookingData addBooking) async {
    isLoading = true;
    String bookingDate;
    try {
      bookingDate = Jiffy.parse(addBooking.date).format(pattern: 'yyyy-MM-dd');
    } catch (e) {
      throw 'Invalid Booking Date format';
    }
    ServiceResponse resp =
        await Fetcher.fetch(Fetcher.post, API_ADD_BOOKING, params: {
      "branch": addBooking.branchID,
      "name": addBooking.name,
      "phone": addBooking.phone,
      "date": bookingDate,
      "people_amount": addBooking.peopleAmount,
    });
    isLoading = false;
    if (!resp.isSuccess) throw resp.errorMessage;

    // Update state
    Map<String, dynamic> json = resp.data;
    int bookID = json['id'];
    _bookings.add(BookingData.fromJson(json));

    notifyListeners();
    return bookID;
  }

  Future<void> getFullyBooking() async {
    isLoading = true;
    ServiceResponse resp = await Fetcher.fetch(
      Fetcher.get,
      API_FULLY_BOOKING,
      params: {
        "_limit": -1,
        "_publicationState": "live",
        "_sort": "date:DESC",
      },
      useAccesstoken: false,
    );
    if (!resp.isSuccess) return; // throw resp.errorMessage;

    _fullyBookings.clear();
    List<dynamic> json = resp.data;
    for (var data in json) {
      if (data["branch"] != null) {
        _fullyBookings.add(FullyBookingData.fromJson(data));
      }
    }

    isLoading = false;
    notifyListeners();
  }

  Future<dynamic> getBranchAvailableByDate(DateTime date) async {
    isLoading = true;
    ServiceResponse resp = await Fetcher.fetch(
      Fetcher.post,
      API_BRANCH_AVAILABLE,
      params: {
        "date": date,
      },
      useAccesstoken: false,
    );

    if (!resp.isSuccess) return;

    _branchAvailable.clear();

    List<dynamic> json = resp.data;
    for (var data in json) {
      BranchAvailable b = BranchAvailable(
        id: data["id"],
        name: data["name"],
      );
      _branchAvailable.add(b);
    }
    isLoading = false;
    notifyListeners();
    return _branchAvailable;
  }
}
