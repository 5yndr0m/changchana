import 'package:chongchana/models/menu/menu_category.dart';
import 'package:chongchana/services/app_init.dart';
import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/services/menu.dart';
import 'package:chongchana/widgets/appbar_button_back.dart';
import 'package:chongchana/widgets/menu_item.dart';
import 'package:chongchana/widgets/subcategory_menu.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:provider/provider.dart';

// ignore: must_be_immutable
class BranchMenuScreen extends StatefulWidget {
  const BranchMenuScreen({Key? key}) : super(key: key);

  @override
  _BranchMenuScreenState createState() => _BranchMenuScreenState();
}

class _BranchMenuScreenState extends State<BranchMenuScreen>
    with TickerProviderStateMixin {
  late ChongjaroenMenus _menuNotify;
  late TabController _tabController;
  late List<MenuCategory> _menuCategories;
  final List<Tab> _menuCategoriesTabs = [];
  final List<Widget> _menuCategoriesViews = [];
  int tabTabCategoryIndex = 0;

  @override
  void initState() {
    _menuNotify = Provider.of<ChongjaroenMenus>(context, listen: false);
    setState(() {
      _menuCategories = _menuNotify.categories;
    });

    _menuCategories.sort((a, b) => a.id.compareTo(b.id));
    _menuNotify.activeCategoryID = _menuCategories[0].id;

    _tabController = TabController(
      vsync: this,
      length: _menuCategories.length,
    );
    _tabController.addListener(_onChangeTab);

    _genaterTabData();
    super.initState();
  }

  void _onChangeTab() {
    setState(() {
      tabTabCategoryIndex = _tabController.index;
    });
    _menuNotify.setCategoryIDActive(_menuCategories[tabTabCategoryIndex].id);

    // Reset tab subcategory to 'All'
    _menuNotify.setSubCategoryIDActive(0);
  }

  _genaterTabData() {
    for (var category in _menuCategories) {
      Widget view = _tabBodyView(category.id);
      _menuCategoriesTabs.add(Tab(text: category.name));
      _menuCategoriesViews.add(view);
    }
  }

  @override
  void dispose() {
    _menuNotify.categories = [];
    _menuNotify.availableSubCategory = [];
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<ChongjaroenAppInit>(
      builder: (context, appinit, widget) => Scaffold(
        appBar: AppBar(
          centerTitle: true,
          toolbarHeight: 72.0,
          title: SvgPicture.asset('assets/images/logo.svg', height: 36.0),
          backgroundColor: ChongjaroenColors.primaryColors,
          leadingWidth: 100,
          leading: const AppBarButtonBack(),
          bottom: TabBar(
            controller: _tabController,
            labelStyle: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
            labelColor: Colors.white,
            unselectedLabelColor: const Color(0xFFBDBDBD),
            indicatorColor: ChongjaroenColors.secondaryColors,
            indicatorWeight: 4,
            overlayColor: WidgetStateProperty.all(Colors.transparent),
            splashFactory: NoSplash.splashFactory,
            tabs: _menuCategoriesTabs,
          ),
        ),
        body: TabBarView(
          controller: _tabController,
          children: _menuCategoriesViews,
        ),
      ),
    );
  }

  Widget _tabBodyView(int categoryID) {
    return SizedBox(
      width: double.infinity,
      height: double.infinity,
      child: Column(
        children: const [
          SubcategoryMenuWidget(),
          MenuItemWidget(),
        ],
      ),
    );
  }
}
