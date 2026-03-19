import 'package:chongchana/constants/chongjaroen_icons.dart';
import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/constants/locales.dart';
import 'package:chongchana/services/booking.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'booking_item.dart';

// ignore: must_be_immutable
class BookingList extends StatelessWidget {
  BookingList({
    Key? key,
    required this.items,
    required this.onTapBooking,
    required this.pullToFetchData,
  }) : super(key: key);

  Function pullToFetchData;
  final List<BookingData> items;
  final Function(BookingData) onTapBooking;

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: () async {
        pullToFetchData();
      },
      child: items.isEmpty
          ? Center(
              child: Column(
                // crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Icon(
                    ChongjaroenIcons.calendar_times_o,
                    size: 16,
                    color: ChongjaroenColors.grayColors,
                  ),
                  Padding(padding: EdgeInsets.only(bottom: 8)),
                  Text(Locales.BookingEmptyData),
                ],
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(30.0),
              itemCount: items.length,
              itemBuilder: (context, index) {
                final item = items[index];
                return BookingListItem(
                  bookingData: item,
                  onTapBooking: onTapBooking,
                );
              },
            ),
    );
  }
}
