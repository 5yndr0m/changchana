import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/models/menu/menu.dart';
import 'package:chongchana/services/menu.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:provider/provider.dart';

class MenuItemWidget extends StatefulWidget {
  const MenuItemWidget({
    Key? key,
  }) : super(key: key);

  @override
  _MenuItemWidgetState createState() => _MenuItemWidgetState();
}

class _MenuItemWidgetState extends State<MenuItemWidget> {
  final String title = 'MenuWidget';
  final ScrollController _controller = ScrollController();

  @override
  Widget build(BuildContext context) {
    return Consumer<ChongjaroenMenus>(
      builder: (context, menus, widget) {
        List<Menu> mennuList = menus.getMenuListByActiveSubCatagoryID();
        return Expanded(
          child: SingleChildScrollView(
            controller: _controller,
            child: ListView.builder(
              controller: _controller,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: mennuList.length,
              itemBuilder: (BuildContext ctx, int index) {
                GlobalKey itemKey = GlobalKey();
                return Container(
                  margin:
                      const EdgeInsets.only(left: 32, right: 32, bottom: 16),
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
                    borderRadius: const BorderRadius.all(Radius.circular(6)),
                    border: Border.all(
                      color: ChongjaroenColors.lightGrayColors.shade300,
                      width: 1,
                    ),
                  ),
                  child: WidgetSize(
                    key: itemKey,
                    img: mennuList[index].coverUrl,
                    name: mennuList[index].name,
                    description: mennuList[index].description,
                  ),
                );
              },
            ),
          ),
        );
      },
    );
  }
}

class WidgetSize extends StatefulWidget {
  final String img;
  final String name;
  final String description;

  const WidgetSize({
    Key? key,
    required this.img,
    required this.name,
    required this.description,
  }) : super(key: key);

  @override
  _WidgetSizeState createState() => _WidgetSizeState();
}

class _WidgetSizeState extends State<WidgetSize> {
  GlobalKey widgetKey = GlobalKey();
  Size? _size = const Size(0, 0);

  @override
  void initState() {
    SchedulerBinding.instance?.addPostFrameCallback(postFrameCallback);
    super.initState();
  }

  void postFrameCallback(_) {
    var context = widgetKey.currentContext;
    if (context == null) return;

    Size? newSize = context.size;
    setState(() {
      _size = newSize;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      key: widgetKey,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Container(
            constraints: const BoxConstraints(
              maxHeight: 350,
              maxWidth: 70,
              minHeight: 70,
            ),
            height: _size?.height,
            margin: const EdgeInsets.only(right: 16),
            child: AspectRatio(
              aspectRatio: 16 / 9,
              child: ClipRRect(
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(6.0),
                  bottomLeft: Radius.circular(6.0),
                ),
                child: CachedNetworkImage(
                  imageUrl: widget.img,
                  imageBuilder: (context, imageProvider) => Container(
                    decoration: BoxDecoration(
                      image: DecorationImage(
                        image: imageProvider,
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  placeholder: (context, url) => const Center(
                    child: CircularProgressIndicator(),
                  ),
                  errorWidget: (context, url, error) => const Image(
                    image: AssetImage(
                      "assets/images/default_menu.png",
                    ),
                    fit: BoxFit.cover,
                  ),
                ),
              ),
            ),
          ),
          Container(
            width: MediaQuery.of(context).size.width - 165,
            padding: const EdgeInsets.only(top: 14, bottom: 14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.name,
                  style: Theme.of(context).textTheme.titleSmall,
                  textAlign: TextAlign.left,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const Padding(
                  padding: EdgeInsets.only(bottom: 5),
                ),
                Text(
                  widget.description,
                  style: Theme.of(context).textTheme.bodyMedium!.merge(
                        const TextStyle(
                          fontSize: 12,
                          color: ChongjaroenColors.grayColors,
                        ),
                      ),
                  textAlign: TextAlign.left,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
