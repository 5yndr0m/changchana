import 'package:chongchana/constants/chongjaroen_icons.dart';
import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/constants/locales.dart';
import 'package:chongchana/services/booking.dart';
import 'package:chongchana/widgets/appbar_button_back.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

class BookingSuccess extends StatelessWidget {
  const BookingSuccess({
    Key? key,
    required this.bookingID,
    required this.bookingData,
  }) : super(key: key);

  final int bookingID;
  final AddBookingData bookingData;

  @override
  Widget build(BuildContext context) {
    final closeButtonStyle = ElevatedButton.styleFrom(
      elevation: 8,
      backgroundColor: ChongjaroenColors.secondaryColors,
      shadowColor: ChongjaroenColors.secondaryColors.shade200,
      minimumSize: const Size(double.infinity, 50),
      padding: const EdgeInsets.all(16.0),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
      textStyle: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
    );

    return Scaffold(
        appBar: AppBar(
          centerTitle: true,
          toolbarHeight: 72.0,
          title: SvgPicture.asset('assets/images/logo.svg', height: 36.0),
          backgroundColor: ChongjaroenColors.primaryColors,
          leadingWidth: 100,
          leading: const AppBarButtonBack(),
        ),
        body: Container(
          padding: const EdgeInsets.fromLTRB(32, 72, 32, 10),
          child: Column(
            children: [
              Ink(
                  width: 70,
                  height: 70,
                  decoration: const ShapeDecoration(
                    color: ChongjaroenColors.completeColor,
                    shape: CircleBorder(),
                  ),
                  child: const Icon(
                    ChongjaroenIcons.booking_clock,
                    color: ChongjaroenColors.whiteColor,
                    size: 32.0,
                  )),
              const SizedBox(height: 24),
              Column(
                children: [
                  Text(
                    'BOOKING ID - #$bookingID',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 13.0,
                      height: 1.6,
                      color: ChongjaroenColors.grayColors.shade800,
                      letterSpacing: 2.0,
                    ),
                  ),
                  const Text("We’ll reach you back!",
                      style: TextStyle(
                          fontSize: 20,
                          height: 3,
                          color: ChongjaroenColors.blackColor,
                          fontWeight: FontWeight.bold),
                      textAlign: TextAlign.center),
                  const SizedBox(height: 6),
                  Text(
                      'คำขอถูกส่งเรียบร้อยแล้ว\n${bookingData.name} ( ${bookingData.peopleAmount} คน) วันที่ ${bookingData.date}\nโปรดรอการติดต่อกลับ',
                      style: const TextStyle(
                          fontSize: 15,
                          height: 1.8,
                          color: ChongjaroenColors.grayColor,
                          fontWeight: FontWeight.w400),
                      textAlign: TextAlign.center),
                ]
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                style: closeButtonStyle,
                onPressed: () {
                  Navigator.pop(context);
                },
                child: const Text(Locales.LinkBack),
              ),
            ],
          ),
        ));
  }
}
