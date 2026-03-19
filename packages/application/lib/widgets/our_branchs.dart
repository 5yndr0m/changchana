import 'package:cached_network_image/cached_network_image.dart';
import 'package:chongchana/screens/branch_menu.dart';
import 'package:chongchana/services/app_init.dart';
import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/constants/locales.dart';
import 'package:chongchana/services/menu.dart';
import 'package:chongchana/widgets/page_title.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class OurBranchsWidgets extends StatefulWidget {
  const OurBranchsWidgets({Key? key}) : super(key: key);

  @override
  _OurBranchsWidgetsState createState() => _OurBranchsWidgetsState();
}

class _OurBranchsWidgetsState extends State<OurBranchsWidgets> {
  late ChongjaroenMenus _menuNotify;

   @override
  void initState() {
    _menuNotify = Provider.of<ChongjaroenMenus>(context, listen: false);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<ChongjaroenAppInit>(
      builder: (context, appinit, widget) => SingleChildScrollView(
        child: Column(
          children: [
            const PageTitle(
              text: Locales.OurBranchs,
            ),
            _branchList(appinit),
          ],
        ),
      ),
    );
  }

  Widget _branchList(ChongjaroenAppInit appinit) {
    return ListView.builder(
      controller: ScrollController(),
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: appinit.branchs.length,
      itemBuilder: (BuildContext ctx, int index) {
        return Padding(
          padding: const EdgeInsets.only(left: 32, right: 32, bottom: 24),
          child: Card(
            shadowColor: ChongjaroenColors.lightGrayColors.shade200,
            elevation: 2,
            child: Column(
              children: [
                GestureDetector(
                  onTap: () {
                    _menuNotify.setBranchActive(appinit.branchs[index], appinit.caregories);
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) {
                        return const BranchMenuScreen();
                      }),
                    );
                  }, // handle your image tap here
                  child: AspectRatio(
                    aspectRatio: 16 / 4.5,
                    child: CachedNetworkImage(
                      imageUrl: appinit.branchs[index].coverImage,
                      imageBuilder: (context, imageProvider) => Container(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(6),
                          image: DecorationImage(
                            image: imageProvider,
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                      placeholder: (context, url) =>
                          const Center(child: CircularProgressIndicator()),
                      errorWidget: (context, url, error) =>
                          const Icon(Icons.error),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
