import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/constants/locales.dart';
import 'package:chongchana/screens/booking/add_booking.dart';
import 'package:chongchana/screens/booking/booking_dialog.dart';
import 'package:chongchana/screens/booking/booking_list.dart';
import 'package:chongchana/screens/profile/guest.dart';
import 'package:chongchana/services/auth.dart';
import 'package:chongchana/services/booking.dart';
import 'package:chongchana/widgets/loader.dart';
import 'package:chongchana/widgets/show_snackbar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:jiffy/jiffy.dart';
import 'package:page_transition/page_transition.dart';
import 'package:provider/provider.dart';

class BookingScreen extends StatelessWidget {
  const BookingScreen({Key? key}) : super(key: key);

  Widget _btnAddBooking(context, BookingModel bookingModel) => Padding(
        padding: const EdgeInsets.only(right: 5),
        child: TextButton(
            style: TextButton.styleFrom(
              backgroundColor: ChongjaroenColors.whiteColors,
              textStyle: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: const [
                Icon(Icons.add),
                SizedBox(width: 4),
                Flexible(child: Text(Locales.Add))
              ],
            ),
            onPressed: () {
              Navigator.push(
                context,
                PageTransition(
                  type: PageTransitionType.rightToLeftWithFade,
                  child: AddBookingPage(bookingModel: bookingModel),
                  curve: Curves.easeInOut,
                  // duration: const Duration(milliseconds: 300),
                  // reverseDuration: const Duration(milliseconds: 300),
                ),
              );
            }),
      );

  TabBar get _tabbar => TabBar(
    labelStyle: const TextStyle(
      fontSize: 16,
      fontWeight: FontWeight.bold,
    ),
    labelColor: Colors.white,
    unselectedLabelColor: const Color(0xFFBDBDBD),
    indicatorColor: ChongjaroenColors.secondaryColors,
    indicatorWeight: 4,
    overlayColor: WidgetStateProperty.all(Colors.transparent),
    splashFactory: NoSplash.splashFactory,
    tabs: const [
      Tab(text: 'Booking'),
      Tab(text: 'History'),
    ],
  );

  @override
  Widget build(BuildContext context) {
    BookingModel bookingModel = BookingModel();

    return Consumer<ChongjaroenAuth>(
      builder: (context, auth, widget) => ChangeNotifierProvider(
        create: (context) => bookingModel,
        child: DefaultTabController(
          length: 2,
          child: Scaffold(
            appBar: AppBar(
              centerTitle: true,
              toolbarHeight: 72.0,
              title: SvgPicture.asset('assets/images/logo.svg', height: 36.0),
              backgroundColor: ChongjaroenColors.primaryColors,
              actions: auth.signedIn
                  ? [_btnAddBooking(context, bookingModel)]
                  : null,
              bottom: auth.signedIn ? _tabbar : null,
            ),
            body: auth.signedIn
                ? const _BookingTab()
                : const Guest(isInvert: true),
          ),
        ),
      ),
    );
  }
}

class _BookingTab extends StatefulWidget {
  const _BookingTab({Key? key}) : super(key: key);
  @override
  State<_BookingTab> createState() => _BookingTabState();
}

class _BookingTabState extends State<_BookingTab> {
  late BookingModel bookingProvider =
      Provider.of<BookingModel>(context, listen: false);

  openBookingDetailDialog(BookingData items) {
    bool isHistory = Jiffy.parseFromDateTime(items.date).endOf(Unit.day).isBefore(Jiffy.now());

    // can cancel if booking date after today midnight (history) and status is not reject nor cancelled
    bool isCanCancel = !isHistory &&
        (items.status != BookingStatus.reject) &&
        (items.status != BookingStatus.cancelled);
    showDialog(
        context: context,
        barrierDismissible: true,
        builder: (BuildContext context) => BookingDetailDialog(
              bookingData: items,
              isHistory: isHistory,
              onTapCancel: isCanCancel ? openBookingCancelDialog : null,
            ));
  }

  openBookingCancelDialog(int bookingID) {
    showDialog(
        context: context,
        barrierDismissible: true,
        builder: (BuildContext context) => BookingCancelDialog(
              bookingID: bookingID,
              onCancelBooking: callCancelBooking,
            ));
  }

  callCancelBooking(int bookingID) async {
    try {
      await bookingProvider.cancelBooking(bookingID);
    } catch (eMSG) {
      showErrorSnackBar(context, eMSG.toString());
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<BookingModel>(
      builder: (context, booking, widget) {
        return Stack(
          children: [
            TabBarView(
              children: [
                BookingList(
                  items: booking.bookings,
                  onTapBooking: openBookingDetailDialog,
                  pullToFetchData: booking.loadBooking,
                ),
                BookingList(
                  items: booking.pastBookings,
                  onTapBooking: openBookingDetailDialog,
                  pullToFetchData: booking.loadBooking,
                ),
              ],
            ),
            if (booking.isLoading) const Loader(),
          ],
        );
      },
    );
  }
}
