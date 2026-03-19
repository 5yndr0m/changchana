import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/constants/locales.dart';
import 'package:chongchana/screens/inbox_detail.dart';
import 'package:chongchana/services/inbox.dart';
import 'package:chongchana/widgets/appbar_button_back.dart';
import 'package:flutter/material.dart';
import 'package:flutter_slidable/flutter_slidable.dart';
import 'package:flutter_svg/svg.dart';
import 'package:provider/provider.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';

class InboxScreen extends StatelessWidget {
  final RefreshController _refreshController =
      RefreshController(initialRefresh: false);
  InboxScreen({Key? key}) : super(key: key);

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
      body: Consumer<InboxService>(
        builder: (ctx, inbox, _widget) => SmartRefresher(
          enablePullDown: true,
          enablePullUp: inbox.canLoadMore,
          header: const MaterialClassicHeader(
            backgroundColor: Colors.transparent,
          ),
          footer: const ClassicFooter(
            height: 0,
          ),
          controller: _refreshController,
          onRefresh: () async {
            inbox.fetchInboxList(true);
            _refreshController.refreshCompleted();
          },
          onLoading: () {
            inbox.fetchInboxList(false);
            _refreshController.loadComplete();
          },
          child: Container(
            child: inbox.list.isNotEmpty
                ? ListView.builder(
                    controller: ScrollController(),
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: inbox.list.length,
                    itemBuilder: (BuildContext _ctx, int index) {
                      return Slidable(
                        key: ValueKey(inbox.list[index].id),
                        endActionPane: ActionPane(
                          motion: const StretchMotion(),
                          children: [
                            SlidableAction(
                              onPressed: (BuildContext ctx) async {
                                inbox.updateInboxStatus(
                                    inbox.list[index].notificationID, "delete");
                              },
                              backgroundColor: ChongjaroenColors.redColor,
                              foregroundColor: ChongjaroenColors.whiteColor,
                              label: 'Delete',
                            ),
                          ],
                        ),
                        child: Container(
                          padding: const EdgeInsets.all(16.0),
                          decoration: const BoxDecoration(
                            border: Border(
                              bottom: BorderSide(
                                width: 1,
                                color: ChongjaroenColors.lightGrayColors,
                              ),
                            ),
                          ),
                          child: TextButton(
                            onPressed: () {
                              inbox.updateInboxStatus(
                                inbox.list[index].notificationID,
                                "read",
                              );
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (context) {
                                  return InboxDetailScreen(
                                    notificationID: inbox.list[index].notificationID,
                                  );
                                }),
                              );
                            },
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisAlignment: MainAxisAlignment.start,
                              children: [
                                Expanded(
                                  flex: 5,
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        inbox.list[index].title,
                                        style: Theme.of(context)
                                            .textTheme
                                            .titleSmall,
                                      ),
                                      Text(
                                        inbox.list[index].shortDescription,
                                        style: Theme.of(context)
                                            .textTheme
                                            .bodyMedium!
                                            .merge(
                                              const TextStyle(
                                                fontSize: 15,
                                              ),
                                            ),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ],
                                  ),
                                ),
                                Expanded(
                                  child: Column(
                                    children: [
                                      inbox.list[index].publishAtDisplay(),
                                      inbox.list[index].statusDisplay()
                                    ],
                                  ),
                                )
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  )
                : const Center(
                    child: Text(Locales.InboxEmptyData),
                  ),
          ),
        ),
      ),
    );
  }
}
