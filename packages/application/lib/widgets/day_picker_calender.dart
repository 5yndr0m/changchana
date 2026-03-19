import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/services/booking.dart';
import 'package:flutter/material.dart';
import 'package:flutter_date_pickers/flutter_date_pickers.dart' as dp;
import 'package:flutter_date_pickers/flutter_date_pickers.dart';
import 'package:jiffy/jiffy.dart';

class EventDate {
  final DateTime date;
  final Color color;
  late FullyBookingStatus eventType;
  EventDate(this.date, this.color, this.eventType);
}

/// Page with [dp.DayPicker].
class DayPickerCalendar extends StatefulWidget {
  final List<EventDate> events;
  final Function onSelectDate;
  final DateTime selectedDate;

  const DayPickerCalendar({
    Key? key,
    this.events = const [],
    required this.onSelectDate,
    required this.selectedDate,
  }) : super(key: key);

  @override
  State<StatefulWidget> createState() => _DayPickerCalendarState();
}

class _DayPickerCalendarState extends State<DayPickerCalendar> {
  DateTime _selectedDate = Jiffy.now().dateTime;
  final DateTime _firstDate = Jiffy.now().startOf(Unit.day).dateTime;
  final DateTime _lastDate = Jiffy.now().endOf(Unit.day).add(months: 3).dateTime;

  BoxDecoration selectedSingleDateDecorationStyle = const BoxDecoration(
    color: ChongjaroenColors.secondaryColor,
    shape: BoxShape.circle,
  );
  TextStyle selectedDateStyle = const TextStyle(
    fontSize: 18.0,
    fontWeight: FontWeight.w400,
    color: ChongjaroenColors.whiteColor,
  );

  // late List<DateTime> eventsDates;

  @override
  void initState() {
    _selectedDate = widget.selectedDate;
    EventDate? eventInCurrentDate = getEventDate(Jiffy.now().dateTime);
    if (eventInCurrentDate != null &&
        Jiffy.parseFromDateTime(_selectedDate).format(pattern: "yyyyMMdd") == Jiffy.now().format(pattern: "yyyyMMdd")) {
      selectedSingleDateDecorationStyle =
          getEventDateDecorationStyle(eventInCurrentDate.color);
      selectedDateStyle = const TextStyle(
        fontSize: 18.0,
        fontWeight: FontWeight.w400,
        color: ChongjaroenColors.lightGrayColor,
      );
    }
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    // add selected colors to default settings
    dp.DatePickerRangeStyles styles = dp.DatePickerRangeStyles(
      displayedPeriodTitle: const TextStyle(
        color: ChongjaroenColors.primaryColor,
        fontSize: 19,
      ),
      defaultDateTextStyle: const TextStyle(
        color: ChongjaroenColors.primaryColor,
        fontSize: 18,
      ),
      selectedDateStyle: selectedDateStyle,
      selectedSingleDateDecoration: selectedSingleDateDecorationStyle,
      disabledDateStyle: const TextStyle(
        color: ChongjaroenColors.lightGrayColor,
        fontSize: 18,
      ),
      // Sun - Sat Header Text
      dayHeaderStyle: DayHeaderStyle(
          textStyle: TextStyle(color: ChongjaroenColors.grayColors.shade700)),
      dayHeaderTitleBuilder: _dayHeaderTitleBuilder,
    );

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        dp.DayPicker.single(
          selectedDate: _selectedDate,
          initiallyShowDate: _selectedDate,
          onChanged: _onSelectedDateChanged,
          firstDate: _firstDate,
          lastDate: _lastDate,
          datePickerStyles: styles,
          datePickerLayoutSettings: const dp.DatePickerLayoutSettings(
            maxDayPickerRowCount: 5,
            dayPickerRowHeight: 44,
            showPrevMonthEnd: true,
            showNextMonthStart: true,
          ),
          // can't use disable, it will override event style
          eventDecorationBuilder: _eventDecorationBuilder,
        ),
      ],
    );
  }

  void _onSelectedDateChanged(DateTime newDate) {
    setState(() {
      _selectedDate = newDate;
    });
    EventDate? event = getEventDate(newDate);
    widget.onSelectDate(newDate, event: event);
    selectedSingleDateDecorationStyle = const BoxDecoration(
      color: ChongjaroenColors.secondaryColor,
      shape: BoxShape.circle,
    );
    selectedDateStyle = const TextStyle(
      fontSize: 18.0,
      fontWeight: FontWeight.w400,
      color: ChongjaroenColors.whiteColor,
    );
  }

  EventDate? getEventDate(DateTime date) {
    final event = widget.events.where((row) =>
        row.date.year == date.year &&
        row.date.month == date.month &&
        row.date.day == date.day);
    return event.isNotEmpty ? event.first : null;
  }

  BoxDecoration getEventDateDecorationStyle(Color col) {
    return BoxDecoration(
      shape: BoxShape.circle,
      boxShadow: [
        BoxShadow(
          color: col,
          offset: const Offset(0.0, 18.0),
          spreadRadius: -18.0,
        )
      ],
    );
  }

  dp.EventDecoration? _eventDecorationBuilder(DateTime date) {
    bool isEventDate = false;
    late BoxDecoration eventDateDecoration;

    for (final EventDate event in widget.events) {
      if (event.date.year == date.year &&
          event.date.month == date.month &&
          event.date.day == date.day) {
        isEventDate = true;
        eventDateDecoration = getEventDateDecorationStyle(event.color);
      }
    }

    return isEventDate
        ? dp.EventDecoration(
            textStyle: const TextStyle(color: ChongjaroenColors.lightGrayColor),
            boxDecoration: eventDateDecoration,
          )
        : null;
  }

  String _dayHeaderTitleBuilder(
          int dayOfTheWeek, List<String> localizedHeaders) =>
      localizedHeaders[dayOfTheWeek].substring(0, 3);
}
