import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/constants/locales.dart';
import 'package:chongchana/services/auth.dart';
import 'package:chongchana/widgets/show_toast.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class DeleteAccountWidgets extends StatefulWidget {
  const DeleteAccountWidgets({Key? key}) : super(key: key);

  @override
  _DeleteAccountWidgetsState createState() => _DeleteAccountWidgetsState();
}

class _DeleteAccountWidgetsState extends State<DeleteAccountWidgets> {
  late BuildContext dialogContext;
  late ChongjaroenAuth auth;

  @override
  void initState() {
    auth = Provider.of<ChongjaroenAuth>(context, listen: false);
    super.initState();
  }

  Future<void> handleDeleteAccount() async {
    bool resp = await auth.accountDeleted();
    Navigator.pop(dialogContext);
    if (resp) {
      showToast(Locales.DeleteAccountSuccess, duration: 10);
      Navigator.pop(context, Locales.Close);
    }
  }

  confirmDeleted() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        dialogContext = context;
        return AlertDialog(
          shape: const RoundedRectangleBorder(
            borderRadius: BorderRadius.all(Radius.circular(6)),
          ),
          titlePadding: const EdgeInsets.only(top: 24),
          insetPadding: const EdgeInsets.only(left: 32, right: 32),
          // contentPadding: const EdgeInsets.only(left: 24, right: 24, top: 24),
          actionsPadding: const EdgeInsets.all(24),
          title: Center(
            child: Text(
              Locales.DeleteAccountConfirm,
              style: Theme.of(context).textTheme.headlineMedium!.merge(
                    const TextStyle(
                      color: ChongjaroenColors.redColors,
                    ),
                  ),
            ),
          ),
          content: SizedBox(
            child: Text(
              Locales.TextConfirmDeleteAccount,
              style: Theme.of(context).textTheme.bodyLarge!.merge(
                    const TextStyle(
                      fontSize: 16,
                      color: ChongjaroenColors.primaryColor,
                    ),
                  ),
              textAlign: TextAlign.center,
            ),
          ),
          actions: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                TextButton(
                  child: Text(
                    Locales.Cancel,
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),
                  onPressed: () {
                    Navigator.pop(context, Locales.Close);
                  },
                ),
                TextButton(
                  child: Text(
                    Locales.Confirm,
                    style: Theme.of(context).textTheme.bodyLarge!.merge(
                          const TextStyle(
                            color: ChongjaroenColors.redColor,
                          ),
                        ),
                  ),
                  onPressed: handleDeleteAccount,
                )
              ],
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const Padding(
          padding: EdgeInsets.only(top: 16),
        ),
        InkWell(
          child: Text(
            Locales.DeleteAccount,
            style: Theme.of(context).textTheme.bodyMedium!.merge(
                  const TextStyle(
                    fontSize: 12,
                    color: ChongjaroenColors.grayColors,
                  ),
                ),
          ),
          onTap: () => confirmDeleted(),
        )
      ],
    );
  }
}
