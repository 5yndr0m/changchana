import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/constants/locales.dart';
import 'package:chongchana/models/user.dart';
import 'package:chongchana/screens/profile/delete_account.dart';
import 'package:chongchana/screens/profile/profile_image.dart';
import 'package:chongchana/widgets/application_version.dart';
import 'package:chongchana/widgets/page_title.dart';
import 'package:chongchana/widgets/singin_description.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:provider/provider.dart';
import 'package:chongchana/services/auth.dart';

class ProfileWidgets extends StatefulWidget {
  const ProfileWidgets({Key? key}) : super(key: key);

  @override
  _ProfileWidgetsState createState() => _ProfileWidgetsState();
}

class _ProfileWidgetsState extends State<ProfileWidgets> {
  @override
  Widget build(BuildContext context) {
    return Consumer<ChongjaroenAuth>(
      builder: (context, auth, widget) => SingleChildScrollView(
        child: Center(
          child: profileCard(context, auth.user),
        ),
      ),
    );
  }

  Widget profileCard(BuildContext context, User user) {
    final authState = ChongjaroenAuthScope.of(context);
    return Container(
      margin: const EdgeInsets.only(top: 7, bottom: 36),
      child: Column(
        children: [
          const PageTitle(
            text: Locales.Profile,
          ),
          Column(
            children: [
              ProfileImage(user: user),
              const Padding(
                padding: EdgeInsets.only(top: 24),
              ),
              Text(
                "${user.firstName} ${user.lastName}",
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              const Padding(
                padding: EdgeInsets.only(top: 12),
                // child: ,
              ),
              Text(
                "USER ID - #${user.userId}",
                style: Theme.of(context).textTheme.bodyMedium!.merge(
                      const TextStyle(
                        fontSize: 11,
                        color: ChongjaroenColors.grayColors,
                      ),
                    ),
              ),
              const Padding(
                padding: EdgeInsets.only(top: 12),
                // child: ,
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    child: user.special
                        ? Container(
                            padding: const EdgeInsets.only(
                                left: 4, right: 4, bottom: 4, top: 0),
                            margin: const EdgeInsets.only(right: 5, top: 2),
                            decoration: const BoxDecoration(
                              borderRadius: BorderRadius.all(
                                Radius.circular(4),
                              ),
                              color: ChongjaroenColors.primaryColors,
                            ),
                            child: Text(
                              Locales.Partner,
                              style:
                                  Theme.of(context).textTheme.bodyMedium!.merge(
                                        const TextStyle(
                                          fontSize: 14,
                                          color: ChongjaroenColors.whiteColors,
                                        ),
                                      ),
                            ),
                          )
                        : null,
                  ),
                  Text(
                    "${user.points} ${Locales.Points}",
                    style: Theme.of(context).textTheme.bodyMedium!.merge(
                          const TextStyle(
                            fontSize: 14,
                          ),
                        ),
                  )
                ],
              ),
              const Padding(
                padding: EdgeInsets.only(top: 24),
              ),
              Container(
                width: MediaQuery.of(context).size.width,
                padding: const EdgeInsets.only(
                  left: 24,
                  top: 14,
                  right: 24,
                  bottom: 14,
                ),
                decoration: const BoxDecoration(
                  border: Border(
                    top: BorderSide(
                      width: 1,
                      color: ChongjaroenColors.lightGrayColors,
                    ),
                    bottom: BorderSide(
                      width: 1,
                      color: ChongjaroenColors.lightGrayColors,
                    ),
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      Locales.MobileNumber,
                      style: Theme.of(context).textTheme.bodyMedium!.merge(
                            const TextStyle(
                              color: ChongjaroenColors.blackColors,
                            ),
                          ),
                    ),
                    Text(
                      user.phone,
                      style: Theme.of(context).textTheme.bodyMedium!.merge(
                            const TextStyle(
                              color: ChongjaroenColors.darkGrayColors,
                            ),
                          ),
                    ),
                  ],
                ),
              ),
              Container(
                width: MediaQuery.of(context).size.width,
                padding: const EdgeInsets.only(
                  left: 24,
                  top: 14,
                  right: 24,
                  bottom: 14,
                ),
                decoration: const BoxDecoration(
                  border: Border(
                    bottom: BorderSide(
                      width: 1,
                      color: ChongjaroenColors.lightGrayColors,
                    ),
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      Locales.Email,
                      style: Theme.of(context).textTheme.bodyMedium!.merge(
                            const TextStyle(
                              color: ChongjaroenColors.blackColors,
                            ),
                          ),
                    ),
                    Text(
                      user.email,
                      style: Theme.of(context).textTheme.bodyMedium!.merge(
                            const TextStyle(
                              color: ChongjaroenColors.darkGrayColors,
                            ),
                          ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const Padding(
            padding: EdgeInsets.only(top: 32),
          ),
          TextButton(
            onPressed: () async {
              authState.signOut();
              // routeState.go('/home');
              Navigator.pop(context);
            },
            child: Text(
              Locales.Signout,
              style: Theme.of(context).textTheme.titleSmall!.merge(
                    const TextStyle(
                      color: ChongjaroenColors.redColors,
                    ),
                  ),
            ),
          ),
          const SigninDescriptionWidget(),
          const DeleteAccountWidgets(),
          const ApplicationVersion(),
        ],
      ),
    );
  }
}
