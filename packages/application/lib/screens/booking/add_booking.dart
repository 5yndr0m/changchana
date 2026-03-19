import 'package:chongchana/constants/chongjaroen_icons.dart';
import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/constants/locales.dart';
import 'package:chongchana/models/branch.dart';
import 'package:chongchana/screens/booking/booking_success.dart';
import 'package:chongchana/services/app_init.dart';
import 'package:chongchana/services/booking.dart';
import 'package:chongchana/widgets/appbar_button_back.dart';
import 'package:chongchana/widgets/day_picker_calender.dart';
import 'package:chongchana/widgets/form_input.dart';
import 'package:chongchana/widgets/page_title.dart';
import 'package:chongchana/widgets/show_snackbar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_html/flutter_html.dart';
import 'package:flutter_svg/svg.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:jiffy/jiffy.dart';
import 'package:page_transition/page_transition.dart';
import 'package:provider/provider.dart';
import 'package:quiver/strings.dart';
import 'package:tuple/tuple.dart';
import 'booking_datepicker.dart';

const int maxPeopleAmount = 30;

class AddBookingPage extends StatefulWidget {
  const AddBookingPage({Key? key, required this.bookingModel})
      : super(key: key);

  final BookingModel bookingModel;

  @override
  State<AddBookingPage> createState() => _AddBookingPageState();
}

class _AddBookingPageState extends State<AddBookingPage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  late AddBookingData _addBookingData;
  late List<DropdownMenuItem<String>> peopleAmountItems;
  late final Future<int> Function(AddBookingData addBooking) onAddBooking;
  late List<EventDate> eventsBooking = [];
  late EventDate dateEventSelected;
  late String branchAvailableSelected = "-";
  final dropdownBranchState = GlobalKey<FormFieldState>();
  late List<Branch> _branchs = [];

  @override
  void initState() {
    onAddBooking = widget.bookingModel.addBooking;
    _addBookingData = AddBookingData();

    peopleAmountItems =
        List<DropdownMenuItem<String>>.generate(maxPeopleAmount, (int index) {
      return DropdownMenuItem<String>(
        value: '${index + 1}',
        child: Text('${index + 1}'),
      );
    });

    super.initState();
  }

  callAddBooking() async {
    try {
      final int bookingID = await onAddBooking(_addBookingData);
      Navigator.pop(context);
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) {
            return BookingSuccess(
                bookingID: bookingID, bookingData: _addBookingData);
          },
        ),
      );
    } catch (eMSG) {
      showErrorSnackBar(context, eMSG.toString());
    }
  }

  updateEventCalendarByBranch() {
    eventsBooking.clear();
    for (FullyBookingData fullbookdata in widget.bookingModel.fullyBookings) {
      if ('${fullbookdata.branchID}' == _addBookingData.branchID) {
        late Color color = colorFullyBooking;
        if (fullbookdata.type == FullyBookingStatus.full) {
          color = colorFullyBooking;
        } else if (fullbookdata.type == FullyBookingStatus.event) {
          color = colorEventBooking;
        } else if (fullbookdata.type == FullyBookingStatus.closed) {
          color = colorClosedBooking;
        }
        eventsBooking.add(
          EventDate(fullbookdata.date, color, fullbookdata.type),
        );
      }
    }
  }

  getBranchAvailable(EventDate event) async {
    setState(() {
      dateEventSelected = event;
    });
    String selectedDate = Jiffy.parseFromDateTime(event.date).format(pattern: "dd MMMM yyyy");
    List<BranchAvailable> branchs =
        await widget.bookingModel.getBranchAvailableByDate(event.date);
    List<DropdownMenuItem<String>> branchsDropdownItems = [
      const DropdownMenuItem(
        child: Text(
          Locales.LabelSelectBranch,
          style: TextStyle(
            fontSize: 16,
          ),
        ),
        value: "-",
      ),
      ...branchs
          .map((e) => DropdownMenuItem(
                alignment: Alignment.topLeft,
                child: SizedBox(
                  width: MediaQuery.of(context).size.width - 155,
                  child: Text(
                    e.name,
                    maxLines: 1,
                    softWrap: false,
                    overflow: TextOverflow.fade,
                    style: const TextStyle(
                      fontSize: 16,
                    ),
                  ),
                ),
                value: "${e.id}",
              ))
          .toList(),
    ];
    EventLegend legend =
        eventLegends.singleWhere((row) => row.type == event.eventType);
    Branch b =
        _branchs.firstWhere((row) => "${row.id}" == _addBookingData.branchID);
    String branchSelectedName = b.name;
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) => AlertDialog(
        actionsPadding: const EdgeInsets.only(left: 16, right: 16, top: 0),
        contentPadding: const EdgeInsets.only(left: 16, right: 16, bottom: 0),
        title: Center(
          child: Container(
            width: 70,
            height: 70,
            margin: const EdgeInsets.only(bottom: 10),
            decoration: BoxDecoration(
              borderRadius: const BorderRadius.all(Radius.circular(50)),
              color: event.color,
            ),
            child: const Icon(
              ChongjaroenIcons.cancel,
              color: ChongjaroenColors.whiteColors,
              size: 28,
            ),
          ),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              "$selectedDate - ${legend.name}",
              style: Theme.of(context).textTheme.bodyMedium!.merge(
                    const TextStyle(
                      fontSize: 12,
                      color: ChongjaroenColors.grayColor,
                    ),
                  ),
            ),
            const Padding(
              padding: EdgeInsets.only(top: 20),
            ),
            Text(
              branchSelectedName,
              style: Theme.of(context).textTheme.titleSmall!.merge(
                    const TextStyle(
                      color: ChongjaroenColors.blackColors,
                    ),
                  ),
            ),
            const Padding(
              padding: EdgeInsets.only(top: 20),
            ),
            Text(
              "คุณต้องการจองสาขาอื่นสำหรับ",
              style: Theme.of(context).textTheme.bodyLarge!.merge(
                    const TextStyle(
                      fontSize: 15,
                      color: ChongjaroenColors.grayColors,
                    ),
                  ),
            ),
            Text(
              "วันที่ $selectedDate ไหม?",
              style: Theme.of(context).textTheme.bodyLarge!.merge(
                    const TextStyle(
                      fontSize: 15,
                      color: ChongjaroenColors.grayColors,
                    ),
                  ),
            ),
            CJRDropdowntormField(
              initValue: '-',
              onSaved: (value) {
                setState(() {
                  branchAvailableSelected = value!;
                });
              },
              onChanged: (value) {
                setState(() {
                  branchAvailableSelected = value!;
                });
                updateEventCalendarByBranch();

                // reset date to avoid event Date by Branch conflict
                _dateTextFormController.clear();
              },
              dropdownItems: branchsDropdownItems,
            )
          ],
        ),
        actions: [
          ElevatedButton(
            style: submitButtonStyle,
            onPressed: () {
              if (branchAvailableSelected == "-" ||
                  branchAvailableSelected == _addBookingData.branchID) {
                Fluttertoast.showToast(
                  timeInSecForIosWeb: 5,
                  msg: Locales.ErrorSelectBranch,
                  backgroundColor: ChongjaroenColors.redColors,
                );
              } else {
                setState(() {
                  _addBookingData.date =
                      Jiffy.parseFromDateTime(dateEventSelected.date).format(pattern: 'yyyy-MM-dd');
                  _addBookingData.branchID = branchAvailableSelected;

                  updateEventCalendarByBranch();
                });
                dropdownBranchState.currentState
                    ?.didChange(branchAvailableSelected);
                Navigator.pop(context, Locales.Confirm);
              }
            },
            child: const Text(Locales.Confirm),
          ),
          Center(
            child: TextButton(
              child: Text(
                Locales.Cancel,
                style: Theme.of(context).textTheme.bodyLarge,
              ),
              onPressed: () {
                Navigator.pop(context, false);
              },
            ),
          )
        ],
      ),
    ).then((value) => {
          if (value == Locales.Confirm)
            {Navigator.pop(context, dateEventSelected.date)}
        });
  }

  final submitButtonStyle = ElevatedButton.styleFrom(
    elevation: 8,
    backgroundColor: ChongjaroenColors.secondaryColor,
    shadowColor: ChongjaroenColors.secondaryColors.shade200,
    minimumSize: const Size(double.infinity, 50),
    padding: const EdgeInsets.all(16.0),
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
    textStyle: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
  );

  final TextEditingController _dateTextFormController = TextEditingController();

  @override
  void dispose() {
    // Clean up the controller when the widget is removed from the
    // widget tree.
    _dateTextFormController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          centerTitle: true,
          toolbarHeight: 72.0,
          title: SvgPicture.asset('assets/images/logo.svg', height: 36.0),
          backgroundColor: ChongjaroenColors.primaryColors,
          leadingWidth: 100,
          leading: const AppBarButtonBack(),
        ),
        body: Selector<ChongjaroenAppInit,
                Tuple2<List<DropdownMenuItem<String>>, String>>(
            selector: (BuildContext _, appinit) {
          _branchs = appinit.branchs;
          if (_addBookingData.branchID == "") {
            _addBookingData.branchID = '${appinit.branchs.first.id}';
            updateEventCalendarByBranch();
          }
          return Tuple2(
            appinit.branchs.map<DropdownMenuItem<String>>((Branch branchData) {
              int branchID = branchData.id;
              return DropdownMenuItem<String>(
                value: '$branchID',
                child: Text(branchData.name),
              );
            }).toList(),
            appinit.settings.bookingConditions,
          );
        }, builder: (context, dataSelectedAppInt, widget) {
          List<DropdownMenuItem<String>> branchsDropdownItems =
              dataSelectedAppInt.item1;
          String bookingConditions = dataSelectedAppInt.item2;

          return GestureDetector(
            excludeFromSemantics: true,
            onTap: () {
              FocusScopeNode currentFocus = FocusScope.of(context);
              if (!currentFocus.hasPrimaryFocus) {
                currentFocus.unfocus();
              }
            },
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(24, 7, 27, 36),
              child: ConstrainedBox(
                constraints: const BoxConstraints(
                    // minHeight: MediaQuery.of(context).size.height,
                    ),
                child: Form(
                  key: _formKey,
                  autovalidateMode: AutovalidateMode.disabled,
                  child: Column(children: [
                    const Center(
                      child: PageTitle(
                        text: Locales.Booking,
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          Locales.LabelBranch,
                          style: labelFormStyle,
                        ),
                        Padding(
                          padding: const EdgeInsets.only(top: 8, bottom: 0),
                          child: DropdownButtonFormField(
                            key: dropdownBranchState,
                            autovalidateMode: AutovalidateMode.disabled,
                            value: branchsDropdownItems.first.value!,
                            items: branchsDropdownItems,
                            style: textFormStyle,
                            decoration: textFormDecoration,
                            onSaved: (String? value) {
                              setState(() {
                                _addBookingData.branchID = value!;
                              });
                            },
                            onChanged: (String? value) {
                              setState(() {
                                _addBookingData.branchID = value!;
                                branchAvailableSelected = value;
                              });
                              updateEventCalendarByBranch();

                              // reset date to avoid event Date by Branch conflict
                              _dateTextFormController.clear();
                            },
                          ),
                        ),
                      ],
                    ),
                    CJRTextFormField(
                      labelText: 'Name (ชื่อ)',
                      validator: (String? value) {
                        if (value == null || value.isEmpty) {
                          return Locales.ErrorSelectName;
                        }
                        return null;
                      },
                      onSaved: (value) {
                        setState(() {
                          _addBookingData.name = value!;
                        });
                      },
                      keyboardType: TextInputType.name,
                      limitLength: 36,
                    ),
                    CJRTextFormField(
                      labelText: 'Mobile Number (เบอร์โทรศัพท์)',
                      validator: (String? value) {
                        if (value == null || value.isEmpty) {
                          return Locales.ErrorSelectMobile;
                        }
                        RegExp regExp = RegExp(r'^(?:[+0]9)?[0-9]{10}$');
                        if (!regExp.hasMatch(value)) {
                          return Locales.ErrorInvalidMobile;
                        }
                        return null;
                      },
                      onSaved: (value) {
                        setState(() {
                          _addBookingData.phone = value!;
                        });
                      },
                      keyboardType: TextInputType.phone,
                      limitLength: 10,
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Flexible(
                          child: CJRDropdowntormField(
                            labelText: Locales.LabelAmount,
                            initValue: peopleAmountItems[0].value!,
                            onSaved: (value) {
                              setState(() {
                                _addBookingData.peopleAmount = value!;
                              });
                            },
                            dropdownItems: peopleAmountItems,
                          ),
                        ),
                        const SizedBox(width: 18),
                        Flexible(
                            child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                              Text(
                                Locales.LabelSelectDate,
                                style: labelFormStyle,
                              ),
                              Padding(
                                padding:
                                    const EdgeInsets.only(top: 8, bottom: 0),
                                child: TextFormField(
                                  controller: _dateTextFormController,
                                  readOnly: true,
                                  autovalidateMode:
                                      AutovalidateMode.onUserInteraction,
                                  style: textFormStyle,
                                  decoration: textFormDecoration,
                                  onSaved: (value) {
                                    setState(() {
                                      _addBookingData.date = value!;
                                    });
                                  },
                                  validator: (String? value) {
                                    if (value == null || value.isEmpty) {
                                      return Locales.ErrorSelectDate;
                                    }
                                    return null;
                                  },
                                  onTap: () async {
                                    FocusScopeNode currentFocus =
                                        FocusScope.of(context);
                                    if (!currentFocus.hasPrimaryFocus) {
                                      currentFocus.unfocus();
                                    }
                                    DateTime? selectDate = await Navigator.push(
                                      context,
                                      PageTransition(
                                        type: PageTransitionType.bottomToTop,
                                        child: BookingDatePicker(
                                          eventsBooking: eventsBooking,
                                          getBranchAvailable:
                                              getBranchAvailable,
                                          defaultDate:
                                              isNotEmpty(_addBookingData.date)
                                                  ? Jiffy.parse(_addBookingData.date,
                                                          pattern: 'yyyy-MM-dd')
                                                      .dateTime
                                                  : Jiffy.now().dateTime,
                                        ),
                                        curve: Curves.easeInOut,
                                        // duration: const Duration(milliseconds: 300),
                                        // reverseDuration: const Duration(milliseconds: 300),
                                      ),
                                    );
                                    if (selectDate != null) {
                                      setState(() {
                                        _addBookingData.date = Jiffy.parseFromDateTime(selectDate)
                                            .format(pattern: 'yyyy-MM-dd');
                                      });
                                      _dateTextFormController.value =
                                          _dateTextFormController.value
                                              .copyWith(
                                        text: _addBookingData.date,
                                        selection: TextSelection(
                                            baseOffset:
                                                _addBookingData.date.length,
                                            extentOffset:
                                                _addBookingData.date.length),
                                        composing: TextRange.empty,
                                      );
                                    }
                                  },
                                ),
                              ),
                            ])),
                      ],
                    ),
                    Padding(
                      padding: const EdgeInsets.only(top: 8, bottom: 14),
                      child: ElevatedButton(
                        style: submitButtonStyle,
                        onPressed: () {
                          FocusScopeNode currentFocus = FocusScope.of(context);
                          if (!currentFocus.hasPrimaryFocus) {
                            currentFocus.unfocus();
                          }

                          if (_formKey.currentState!.validate()) {
                            _formKey.currentState!.save();
                            callAddBooking();
                          }
                        },
                        child: const Text(Locales.Submit),
                      ),
                    ),
                    _AddBookingCondition(bookingConditions: bookingConditions),
                  ]),
                ),
              ),
            ),
          );
        }));
  }
}

class _AddBookingCondition extends StatelessWidget {
  const _AddBookingCondition({Key? key, required this.bookingConditions})
      : super(key: key);

  final String bookingConditions;

  @override
  Widget build(BuildContext context) {
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      const SizedBox(height: 10),
      Html(
        data: bookingConditions,
        style: {
          "div": Style(
            textAlign: TextAlign.center,
            fontSize: FontSize.medium,
            color: ChongjaroenColors.darkGrayColors.shade600,
            fontWeight: FontWeight.w400,
          ),
          "b": Style(
            fontSize: FontSize.medium,
            color: ChongjaroenColors.darkGrayColors.shade600,
            fontWeight: FontWeight.bold,
          ),
          "ol": Style(
            padding: HtmlPaddings.only(left: 0),
          ),
          "li": Style(
            fontSize: FontSize.medium,
            color: ChongjaroenColors.darkGrayColors.shade600,
            fontWeight: FontWeight.w400,
          ),
          "a": Style(
            fontSize: FontSize.medium,
            color: ChongjaroenColors.darkGrayColor,
            fontWeight: FontWeight.w400,
          ),
          "p": Style(
            fontSize: FontSize.medium,
            color: ChongjaroenColors.darkGrayColors.shade600,
            fontWeight: FontWeight.w400,
          ),
          "span": Style(
            fontSize: FontSize.medium,
            color: ChongjaroenColors.darkGrayColors.shade600,
            fontWeight: FontWeight.w400,
          )
        },
      ),
    ]);
  }
}
