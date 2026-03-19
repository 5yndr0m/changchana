import 'package:chongchana/constants/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

TextStyle labelFormStyle = const TextStyle(
  color: ChongjaroenColors.grayColors,
  fontWeight: FontWeight.w700,
  fontSize: 16,
);

TextStyle textFormStyle = const TextStyle(
  color: ChongjaroenColors.blackColor,
  fontWeight: FontWeight.w400,
  fontSize: 20,
);

InputDecoration textFormDecoration = const InputDecoration(
  // constraints: BoxConstraints(maxHeight: 90),
  counterText: ' ',
  contentPadding: EdgeInsets.symmetric(vertical: 4.0, horizontal: 13.0),
  border: OutlineInputBorder(
    borderSide: BorderSide(
      width: 1.0,
    ),
  ),
  enabledBorder: OutlineInputBorder(
    borderSide: BorderSide(
      color: ChongjaroenColors.lightGrayColors,
    ),
  ),
  errorBorder: OutlineInputBorder(
    borderSide: BorderSide(
      color: ChongjaroenColors.redColors,
    ),
  ),
  focusedBorder: OutlineInputBorder(
    borderSide: BorderSide(
      color: ChongjaroenColors.primaryColors,
    ),
  ),
);

class CJRTextFormField extends StatelessWidget {
  const CJRTextFormField({
    Key? key,
    required this.labelText,
    required this.onSaved,
    required this.validator,
    this.keyboardType = TextInputType.text,
    this.initValue = "",
    this.limitLength = 100,
    this.onChanged,
  }) : super(key: key);

  final String labelText;
  final void Function(String?)? onChanged;
  final void Function(String?) onSaved;
  final String? Function(String?) validator;
  final TextInputType? keyboardType;
  final String? initValue;
  final int? limitLength;

  @override
  Widget build(BuildContext context) {
    final List<TextInputFormatter> inputFormat = <TextInputFormatter>[
      LengthLimitingTextInputFormatter(limitLength),
    ];
    if (keyboardType == TextInputType.number ||
        keyboardType == TextInputType.phone) {
      inputFormat.add(FilteringTextInputFormatter.digitsOnly);
    }

    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(labelText, style: labelFormStyle),
      Padding(
        padding: const EdgeInsets.only(top: 8, bottom: 0),
        child: TextFormField(
          initialValue: initValue,
          autovalidateMode: AutovalidateMode.onUserInteraction,
          style: textFormStyle,
          decoration: textFormDecoration,
          keyboardType: keyboardType,
          inputFormatters: inputFormat,
          onSaved: onSaved,
          onChanged: (String? value) {
            if (onChanged != null) onChanged!(value);
          },
          validator: validator,
        ),
      ),
    ]);
  }
}

class CJRDropdowntormField extends StatefulWidget {
  const CJRDropdowntormField({
    Key? key,
    this.labelText,
    required this.onSaved,
    required this.dropdownItems,
    required this.initValue,
    this.onChanged,
  }) : super(key: key);

  final String? labelText;
  final void Function(String?)? onChanged;
  final void Function(String?) onSaved;
  final List<DropdownMenuItem<String>> dropdownItems;
  final String initValue;

  @override
  State<CJRDropdowntormField> createState() => _CJRDropdowntormFieldState();
}

class _CJRDropdowntormFieldState extends State<CJRDropdowntormField> {
  late String selectedValue;
  @override
  void initState() {
    selectedValue = widget.initValue;
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(widget.labelText ?? "", style: labelFormStyle),
        Padding(
          padding: const EdgeInsets.only(top: 8, bottom: 0),
          child: DropdownButtonFormField(
            autovalidateMode: AutovalidateMode.disabled,
            value: selectedValue,
            items: widget.dropdownItems,
            style: textFormStyle,
            decoration: textFormDecoration,
            onChanged: (String? value) {
              setState(() {
                selectedValue = value!;
              });
              if (widget.onChanged != null) widget.onChanged!(value);
            },
            onSaved: (String? value) {
              if (value != null) widget.onSaved(value);
            },
          ),
        ),
      ],
    );
  }
}
