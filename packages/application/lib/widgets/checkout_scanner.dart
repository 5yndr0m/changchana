import 'dart:io' show Platform;
import 'dart:io';

import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/constants/locales.dart';
import 'package:chongchana/services/checkout.dart';
import 'package:chongchana/widgets/loader.dart';
import 'package:chongchana/widgets/page_title.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:provider/provider.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';
import 'package:chongchana/constants/chongjaroen_icons.dart';

import 'appbar_button_back.dart';

class CheckoutScanner extends StatefulWidget {
  const CheckoutScanner({Key? key}) : super(key: key);

  @override
  _CheckoutScannerState createState() => _CheckoutScannerState();
}

class _CheckoutScannerState extends State<CheckoutScanner> {
  Barcode? result;
  QRViewController? controller;
  late CheckoutService _checkoutNotify;
  final GlobalKey qrKey = GlobalKey(debugLabel: 'qrScanner');

  @override
  void initState() {
    _checkoutNotify = Provider.of<CheckoutService>(context, listen: false);
    super.initState();
  }

  @override
  void reassemble() {
    super.reassemble();
    if (Platform.isAndroid) {
      controller!.pauseCamera();
    }
    controller!.resumeCamera();
  }

  void _onQRViewCreated(QRViewController controller) {
    setState(() {
      this.controller = controller;
    });
    controller.scannedDataStream.listen(_onHandleScannerListen);
  }

  Future<void> _onHandleScannerListen(Barcode scanData) async {
    controller?.pauseCamera();
    await _checkoutNotify.checkOut(scanData.code ?? "");
    Navigator.pop(context);
    _showDialog();
  }

  void _showDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) => AlertDialog(
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(6)),
        ),
        titlePadding: const EdgeInsets.only(top: 24, bottom: 0),
        insetPadding: const EdgeInsets.only(left: 32, right: 32),
        contentPadding: const EdgeInsets.only(left: 24, right: 24),
        actionsPadding: const EdgeInsets.only(left: 24, right: 24, bottom: 16),
        title: Center(
          child: Container(
            width: 70,
            height: 70,
            margin: const EdgeInsets.only(bottom: 10),
            decoration: BoxDecoration(
              borderRadius: const BorderRadius.all(Radius.circular(50)),
              color: _checkoutNotify.isSuccess
                  ? ChongjaroenColors.completeColor
                  : ChongjaroenColors.redColor,
            ),
            child: Icon(
              _checkoutNotify.isSuccess
                  ? ChongjaroenIcons.ok
                  : ChongjaroenIcons.cancel,
              color: ChongjaroenColors.whiteColors,
              size: 28,
            ),
          ),
        ),
        content: SizedBox(
          height: 110,
          child: Column(
            children: [
              Text(
                _checkoutNotify.checkOutTimeFormat(),
                style: const TextStyle(
                  fontSize: 12,
                  color: ChongjaroenColors.grayColors,
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(bottom: 10, top: 10),
                child: Text(
                  _checkoutNotify.subject,
                  style: const TextStyle(
                    fontSize: 18,
                    color: ChongjaroenColors.blackColor,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
              Text(
                _checkoutNotify.description,
                style: Theme.of(context).textTheme.bodyMedium!.merge(
                      const TextStyle(
                        fontSize: 14,
                        color: ChongjaroenColors.grayColor,
                      ),
                    ),
                textAlign: TextAlign.center,
              )
            ],
          ),
        ),
        actions: [
          Container(
            width: double.infinity,
            height: 40.0,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(6),
              color: ChongjaroenColors.secondaryColors,
            ),
            child: TextButton(
              onPressed: () => {Navigator.pop(context, Locales.Close)},
              child: Text(
                Locales.Close,
                style: Theme.of(context).textTheme.titleSmall!.merge(
                      const TextStyle(
                        color: ChongjaroenColors.whiteColors,
                      ),
                    ),
              ),
            ),
          )
        ],
      ),
    );
  }

  void _onPermissionSet(BuildContext context, QRViewController ctrl, bool p) {
    if (!p) {
      Navigator.pop(context);
      Fluttertoast.showToast(
        timeInSecForIosWeb: 5,
        msg: Locales.NoPermissionCamara,
        backgroundColor: ChongjaroenColors.lightBlackColors,
      );
    }
  }

  @override
  void dispose() {
    controller?.dispose();
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
      body: Stack(
        alignment: const Alignment(1, 1),
        children: [
          _buildQrView(context),
          const Center(
            child: PageTitle(
              text: Locales.ScannerQRForCheckout,
              textColor: ChongjaroenColors.whiteColors,
            ),
          ),
          if (_checkoutNotify.isLoading) const Loader(),
        ],
      ),
    );
  }

  Widget _buildQrView(BuildContext context) {
    return QRView(
      key: qrKey,
      onQRViewCreated: _onQRViewCreated,
      overlay: QrScannerOverlayShape(
        borderColor: ChongjaroenColors.primaryColor,
        borderRadius: 10,
        borderLength: 30,
        borderWidth: 10,
        cutOutSize: MediaQuery.of(context).size.width - 50,
      ),
      onPermissionSet: (ctrl, p) => _onPermissionSet(context, ctrl, p),
    );
  }
}
