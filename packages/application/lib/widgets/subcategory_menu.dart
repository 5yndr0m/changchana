import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/constants/locales.dart';
import 'package:chongchana/models/menu/menu_sub_categories.dart';
import 'package:chongchana/services/menu.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class SubcategoryMenuWidget extends StatefulWidget {
  const SubcategoryMenuWidget({Key? key}) : super(key: key);

  @override
  _SubcategoryMenuWidgetsState createState() => _SubcategoryMenuWidgetsState();
}

class _SubcategoryMenuWidgetsState extends State<SubcategoryMenuWidget> {
  final String title = 'ListSubCategory';

  @override
  Widget build(BuildContext context) {
    return Consumer<ChongjaroenMenus>(
      builder: (context, menus, _widget) => LayoutBuilder(builder: (
        BuildContext context,
        BoxConstraints constraints,
      ) {
        List<MenuSubCategory> sub = menus.getSubCategoryListByCatagoryID();
        if (sub.where((sub) => sub.id == 0).isEmpty) {
          MenuSubCategory all = MenuSubCategory.fromJson({
            "id": 0,
            "name": Locales.All,
            "menu_category": 0,
          });
          sub.insert(0, all);
        }

        return Container(
          width: constraints.maxWidth,
          height: 50,
          margin: const EdgeInsets.only(bottom: 32),
          decoration: BoxDecoration(
            color: ChongjaroenColors.whiteColors,
            boxShadow: [
              BoxShadow(
                color: ChongjaroenColors.secondaryColors.shade50,
                spreadRadius: 2,
                blurRadius: 10,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            controller: ScrollController(),
            itemCount: sub.length,
            itemBuilder: (context, index) {
              int subID = sub[index].id;
              return SizedBox(
                width:
                    (constraints.maxWidth + 10) / (sub.length < 4 ? sub.length : 3.5),
                child: TextButton(
                  onPressed: () {
                    menus.setSubCategoryIDActive(subID);
                  },
                  child: Text(
                    sub[index].name,
                    overflow: TextOverflow.ellipsis,
                    style: Theme.of(context).textTheme.titleSmall!.merge(
                          TextStyle(
                            color: subID == menus.activeSubCategoryID
                                ? ChongjaroenColors.secondaryColors.shade900
                                : ChongjaroenColors.secondaryColors.shade400,
                          ),
                        ),
                    textAlign: TextAlign.center,
                  ),
                ),
              );
            },
          ),
        );
      }),
    );
  }
}
