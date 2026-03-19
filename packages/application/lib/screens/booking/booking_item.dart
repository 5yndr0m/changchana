import 'package:chongchana/services/booking.dart';
import 'package:flutter/material.dart';
import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/utils/string_extension.dart';
import 'package:jiffy/jiffy.dart';

Color _statusToColor(BookingStatus status) {
  Color color;
  switch (status) {
    case BookingStatus.cancelled:
    case BookingStatus.reject:
      color = ChongjaroenColors.redColors;
      break;
    case BookingStatus.approved:
      color = ChongjaroenColors.secondaryColor;
      break;
    case BookingStatus.pending:
    case BookingStatus.waiting:
    default:
      color = ChongjaroenColors.grayColors.shade500;
      break;
  }
  return color;
}

class _BookingDate extends StatelessWidget {
  final int day;
  final String monthName;
  final BookingStatus status;
  final bool useAsTitle;

  const _BookingDate(
      {Key? key,
      required this.day,
      required this.monthName,
      required this.status,
      required this.useAsTitle})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    Color bgColor = _statusToColor(status);

    return Container(
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: useAsTitle
            ? const BorderRadius.only(bottomRight: Radius.circular(6))
            : null,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Text(
            '$day',
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 40.0,
              height: 1.1,
              color: ChongjaroenColors.whiteColor,
            ),
          ),
          Text(
            monthName,
            style: const TextStyle(
              fontSize: 11.0,
              height: 1.1,
              color: ChongjaroenColors.whiteColor,
              letterSpacing: 1.0,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}

class _BookingDescription extends StatelessWidget {
  final BookingStatus status;
  final String branchName;
  final int id;
  final int peopleAmount;

  const _BookingDescription({
    Key? key,
    required this.status,
    required this.branchName,
    required this.id,
    required this.peopleAmount,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Color statusColor = _statusToColor(status);

    final TextStyle footerStyle = TextStyle(
      fontSize: 13.0,
      height: 1.6,
      color: ChongjaroenColors.grayColors.shade800,
      letterSpacing: 2.0,
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: <Widget>[
        Text(
          status.toValue().capitalize(),
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 14.0,
            height: 1.2,
            color: statusColor,
          ),
        ),
        FittedBox(
          child: Text(
            branchName,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 18.0,
              height: 1.5,
              color: ChongjaroenColors.blackColors,
              letterSpacing: 1.0,
            ),
          ),
        ),
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: <Widget>[
            Text(
              'BOOKING ID - #$id',
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: footerStyle,
            ),
            Text(
              '$peopleAmount คน',
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: footerStyle,
            ),
          ],
        ),
      ],
    );
  }
}

@immutable
class BookingListItem extends StatelessWidget {
  final BookingData bookingData;
  final bool? useAsTitle;
  final Function(BookingData)? onTapBooking;

  const BookingListItem(
      {Key? key,
      required this.bookingData,
      this.onTapBooking,
      this.useAsTitle = false})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    final String monthName = Jiffy.parseFromDateTime(bookingData.date).MMMM.toString().toUpperCase();

    return GestureDetector(
      onTap: () {
        if (onTapBooking != null) onTapBooking!(bookingData);
      },
      child: Container(
        margin: useAsTitle == true
        ? null
        : const EdgeInsets.only(bottom: 23.0),
        clipBehavior: Clip.antiAlias,
        decoration: BoxDecoration(
          color: ChongjaroenColors.whiteColors,
          boxShadow: useAsTitle == true
          ? null
          : [
            BoxShadow(
              color: ChongjaroenColors.primaryColors.shade50,
              spreadRadius: 2,
              blurRadius: 16,
              offset: const Offset(0, 10),
            ),
          ],
          borderRadius: useAsTitle == true
              ? null
              : const BorderRadius.all(Radius.circular(12)),
          border: useAsTitle == true
              ? null
              : Border.all(
                  color: ChongjaroenColors.lightGrayColors.shade300,
                  width: 1,
                ),
        ),
        child: SizedBox(
          height: 88,
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              AspectRatio(
                  aspectRatio: 1.0,
                  child: _BookingDate(
                      day: bookingData.date.day,
                      monthName: monthName,
                      status: bookingData.status,
                      useAsTitle: useAsTitle as bool)),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16.0, 10.0, 13.0, 10.0),
                  child: _BookingDescription(
                    status: bookingData.status,
                    branchName: bookingData.branchName,
                    id: bookingData.id,
                    peopleAmount: bookingData.peopleAmount,
                  ),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
