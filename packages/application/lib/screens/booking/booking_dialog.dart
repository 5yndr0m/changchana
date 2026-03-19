import 'package:chongchana/constants/chongjaroen_icons.dart';
import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/constants/locales.dart';
import 'package:chongchana/services/booking.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'booking_item.dart';

class BookingDetailDialog extends StatelessWidget {
  final BookingData bookingData;
  final bool isHistory;
  final Function(int)? onTapCancel;

  const BookingDetailDialog({
    Key? key,
    required this.bookingData,
    required this.isHistory,
    this.onTapCancel,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final closeButtonStyle = ElevatedButton.styleFrom(
      elevation: 8,
      backgroundColor: ChongjaroenColors.secondaryColor,
      shadowColor: ChongjaroenColors.secondaryColors.shade200,
      minimumSize: const Size(double.infinity, 50),
      padding: const EdgeInsets.all(16.0),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
      textStyle: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
    );
    final cancelButtonStyle = TextButton.styleFrom(
      backgroundColor: ChongjaroenColors.redColor,
      minimumSize: const Size(double.infinity, 50),
      padding: const EdgeInsets.all(16.0),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
      textStyle: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
    );

    final bool canCancel = onTapCancel != null;
    final bool showCondition = !isHistory &&
        (bookingData.status == BookingStatus.approved ||
            bookingData.status == BookingStatus.pending ||
            bookingData.status == BookingStatus.waiting);

    return AlertDialog(
      clipBehavior: Clip.antiAlias,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.all(Radius.circular(6)),
      ),
      titlePadding: const EdgeInsets.all(0.0),
      insetPadding: const EdgeInsets.all(24.0),
      contentPadding: const EdgeInsets.symmetric(vertical: 20, horizontal: 20),
      actionsPadding:
          const EdgeInsets.only(top: 0, left: 20, right: 20, bottom: 5),
      title: BookingListItem(bookingData: bookingData, useAsTitle: true),
      content: SizedBox(
        width: MediaQuery.of(context).size.width,
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          _BookingContact(name: bookingData.name, phone: bookingData.phone),
          if (showCondition) ...[
            const SizedBox(height: 24),
            _BookingConditionScroll(bookingRemarks: bookingData.bookingRemarks),
          ]
        ]),
      ),
      actions: [
        ElevatedButton(
          style: closeButtonStyle,
          onPressed: () {
            Navigator.pop(context);
          },
          child: const Text(Locales.Close),
        ),
        if (canCancel) ...[
          const SizedBox(height: 12),
          TextButton(
            style: cancelButtonStyle,
            onPressed: () {
              Navigator.pop(context);
              onTapCancel!(bookingData.id);
            },
            child: const Text(Locales.CancelBooking),
          ),
        ]
      ],
    );
  }
}

class BookingCancelDialog extends StatelessWidget {
  final int bookingID;
  final Function(int) onCancelBooking;

  const BookingCancelDialog(
      {Key? key, required this.bookingID, required this.onCancelBooking})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    final closeButtonStyle = ElevatedButton.styleFrom(
      elevation: 8,
      backgroundColor: ChongjaroenColors.redColor,
      shadowColor: ChongjaroenColors.secondaryColors.shade200,
      minimumSize: const Size(double.infinity, 50),
      padding: const EdgeInsets.all(16.0),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
      textStyle: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
    );
    final cancelButtonStyle = TextButton.styleFrom(
      backgroundColor: ChongjaroenColors.grayColor,
      minimumSize: const Size(double.infinity, 50),
      padding: const EdgeInsets.all(16.0),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
      textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
    );

    return AlertDialog(
      clipBehavior: Clip.antiAlias,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.all(Radius.circular(6)),
      ),
      titlePadding: const EdgeInsets.only(top: 30.0),
      insetPadding: const EdgeInsets.all(24.0),
      contentPadding: const EdgeInsets.symmetric(vertical: 20, horizontal: 20),
      actionsPadding:
          const EdgeInsets.only(top: 0, left: 20, right: 20, bottom: 0),
      title: Ink(
          width: 70,
          height: 70,
          decoration: const ShapeDecoration(
            color: ChongjaroenColors.redColor,
            shape: CircleBorder(),
          ),
          child: const Icon(
            ChongjaroenIcons.bin,
            color: ChongjaroenColors.whiteColor,
            size: 32.0,
          )),
      content: SizedBox(
        width: MediaQuery.of(context).size.width,
        child: Column(mainAxisSize: MainAxisSize.min, children: [
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
          const Text('Cancel Booking',
              style: TextStyle(
                  fontSize: 20,
                  height: 3,
                  color: ChongjaroenColors.blackColor,
                  fontWeight: FontWeight.bold),
              textAlign: TextAlign.center),
          const SizedBox(height: 6),
          const Text(
              'หลังจากยืนยันการลบข้อมูลการจองแล้ว\nคุณจะไม่สามารนำข้อมูลการจองนี้กลับมาได้อีก',
              style: TextStyle(
                  fontSize: 15,
                  height: 1.8,
                  color: ChongjaroenColors.grayColor,
                  fontWeight: FontWeight.w400),
              textAlign: TextAlign.center),
        ]),
      ),
      actions: [
        ElevatedButton(
          style: closeButtonStyle,
          onPressed: () {
            Navigator.pop(context);
            onCancelBooking(bookingID);
          },
          child: const Text(Locales.ConfirmCancellation),
        ),
        TextButton(
          style: cancelButtonStyle,
          onPressed: () {
            Navigator.pop(context);
          },
          child: const Text(Locales.Cancel),
        ),
      ],
    );
  }
}

class _BookingContact extends StatelessWidget {
  const _BookingContact({
    Key? key,
    required this.name,
    required this.phone,
  }) : super(key: key);

  final String name;
  final String phone;

  @override
  Widget build(BuildContext context) {
    const TextStyle labelFormStyle =
        TextStyle(fontSize: 18, fontWeight: FontWeight.normal);
    final TextStyle nameStyle = TextStyle(
        color: ChongjaroenColors.darkGrayColors.shade600,
        fontWeight: FontWeight.bold);

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
            child: Text.rich(
          TextSpan(
            style: labelFormStyle,
            children: <TextSpan>[
              TextSpan(text: 'Name\n', style: nameStyle),
              TextSpan(text: name),
            ],
          ),
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
        )),
        Expanded(
            child: Text.rich(
          TextSpan(
            style: labelFormStyle,
            children: <TextSpan>[
              TextSpan(text: 'Phone\n', style: nameStyle),
              TextSpan(text: phone),
            ],
          ),
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
        )),
      ],
    );
  }
}

// ignore: must_be_immutable
class _BookingConditionScroll extends StatelessWidget {
  List<dynamic> bookingRemarks;

  _BookingConditionScroll({
    Key? key,
    required this.bookingRemarks,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    const TextStyle conditionTitleStyle = TextStyle(
        fontSize: 18,
        color: ChongjaroenColors.blackColor,
        fontWeight: FontWeight.bold);
    final TextStyle conditionStyle = TextStyle(
        fontSize: 14,
        color: ChongjaroenColors.darkGrayColors.shade500,
        fontWeight: FontWeight.w500,
        height: 1.6);
    const TextStyle spaceStyle = TextStyle(fontSize: 8, height: 1);

    List<InlineSpan> strBookingRemark() {
      List<InlineSpan> resp = [];
      bookingRemarks.asMap().forEach((index, row) {
        if (index > 0) {
          resp.add(const TextSpan(text: ' \n', style: spaceStyle));
        }
        resp.add(TextSpan(text: "${index + 1}. ${row["content"]}\n"));
      });
      return resp;
    }

    return Container(
      padding: const EdgeInsetsDirectional.all(15.0),
      decoration: BoxDecoration(
        color: ChongjaroenColors.lightGrayColors.shade100,
        borderRadius: const BorderRadius.all(Radius.circular(6)),
      ),
      child: ConstrainedBox(
        constraints: const BoxConstraints(
          maxHeight: 150,
        ),
        child: SingleChildScrollView(
          clipBehavior: Clip.antiAlias,
          child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text('เงื่อนไขการรับโต๊ะของสาขา',
                    style: conditionTitleStyle, textAlign: TextAlign.center),
                const SizedBox(height: 10),
                Text.rich(TextSpan(
                  style: conditionStyle,
                  children: strBookingRemark(),
                ))
              ]),
        ),
      ),
    );
  }
}
