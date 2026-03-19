import 'package:chongchana/constants/colors.dart';
import 'package:flutter/material.dart';
import 'package:package_info_plus/package_info_plus.dart';

class ApplicationVersion extends StatelessWidget {
  const ApplicationVersion({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: PackageInfo.fromPlatform(),
      builder: (BuildContext context, AsyncSnapshot<PackageInfo> snapshot) {
        if (snapshot.hasData) {
          return Column(
            children: [
              const Padding(
                padding: EdgeInsets.only(top: 24),
              ),
              Text(
                "Version: ${snapshot.data!.version} (${snapshot.data!.buildNumber})",
                style: Theme.of(context).textTheme.bodyMedium!.merge(
                      const TextStyle(
                        fontSize: 12,
                        color: ChongjaroenColors.lightGrayColors,
                      ),
                    ),
              )
            ],
          );
        }
        return const SizedBox();
      },
    );
  }
}
