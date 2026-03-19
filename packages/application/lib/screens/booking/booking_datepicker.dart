import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/constants/locales.dart';
import 'package:chongchana/services/booking.dart';
import 'package:chongchana/widgets/appbar_button_back.dart';
import 'package:chongchana/widgets/page_title.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:jiffy/jiffy.dart';

import '../../widgets/day_picker_calender.dart';

// Initialize Data for Date Picker Calendar
const Color colorFullyBooking = ChongjaroenColors.redColors;
const Color colorEventBooking = ChongjaroenColors.orangeColors;
const Color colorClosedBooking = ChongjaroenColors.grayColors;

class EventLegend {
  final FullyBookingStatus type;
  final String name;
  final Color color;
  EventLegend(this.name, this.color, this.type);
}

final List<EventLegend> eventLegends = [
  EventLegend('Fully Booked', colorFullyBooking, FullyBookingStatus.full),
  EventLegend('Special Event', colorEventBooking, FullyBookingStatus.event),
  EventLegend('Closed', colorClosedBooking, FullyBookingStatus.closed),
];

class BookingDatePicker extends StatefulWidget {
  const BookingDatePicker({
    Key? key,
    required this.eventsBooking,
    required this.getBranchAvailable,
    required this.defaultDate,
  }) : super(key: key);

  final List<EventDate> eventsBooking;
  final Function getBranchAvailable;
  final DateTime defaultDate;

  @override
  State<BookingDatePicker> createState() => _BookingDatePickerState();
}

class _BookingDatePickerState extends State<BookingDatePicker> {
  DateTime selectedDate = Jiffy.now().dateTime;

  @override
  void initState() {
    selectedDate = widget.defaultDate;
    super.initState();
  }

  onSelectDate(DateTime selectDate, {EventDate? event}) {
    if (event?.eventType != null) {
      widget.getBranchAvailable(event);
    } else {
      setState(() {
        selectedDate = selectDate;
      });
      Navigator.pop(context, selectDate);
    }
  }

  Widget eventLegendBuilder(EventLegend legend) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Container(
          margin: const EdgeInsets.only(top: 4.0),
          padding: const EdgeInsets.only(right: 16.0),
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: legend.color,
          ),
          child: const SizedBox(width: 8, height: 8),
        ),
        Text(
          legend.name,
          style: const TextStyle(
            fontSize: 16.0,
            color: ChongjaroenColors.grayColor,
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    List<Widget> listEventLegends =
        eventLegends.map((e) => eventLegendBuilder(e)).toList();

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
          padding: const EdgeInsets.fromLTRB(32, 10, 32, 32),
          child: Column(
            children: [
              const Center(
                child: PageTitle(
                  text: Locales.PickingDate,
                ),
              ),
              DayPickerCalendar(
                events: widget.eventsBooking,
                onSelectDate: onSelectDate,
                selectedDate: selectedDate,
              ),
              const SizedBox(height: 30),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: listEventLegends,
              )
            ],
          ),
        ));
  }
}
