'use strict';

const _ = require("lodash")

const EVENT_TABLE_RESERVEDS_TABLE = "event_table_reserveds";
const EVENT_TRANSACTION_TABLE = "event_transaction";
const USER_TABLE = "users-permissions_user";
const EVENT_ZONE_TABLE = "components_event_zones_zones";


/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

const queryAdminGetEventReserved = (qb, conditions, options) => {
  qb.innerJoin(EVENT_TRANSACTION_TABLE, `${EVENT_TABLE_RESERVEDS_TABLE}.event_transaction`, `${EVENT_TRANSACTION_TABLE}.id`)
  qb.innerJoin(USER_TABLE, `${EVENT_TABLE_RESERVEDS_TABLE}.users_permissions_user`, `${USER_TABLE}.id`)
  qb.join(EVENT_ZONE_TABLE, `${EVENT_TABLE_RESERVEDS_TABLE}.zone_id`, `${EVENT_ZONE_TABLE}.id`)
  if (options.keyword) {
    qb.where( function (){
      this.where(`${USER_TABLE}.first_name`, "like", `${options.keyword}%`)
        .orWhere(`${USER_TABLE}.last_name`, "like", `${options.keyword}%`)
        .orWhere(`${USER_TABLE}.email`, "like", `${options.keyword}%`)
        .orWhere(`${USER_TABLE}.phone`, "like", `${options.keyword}%`)
    })
  }
  if (options.zone_name) {
    qb.where( function (){
      this.where(`${EVENT_ZONE_TABLE}.name`, "=", `${options.zone_name}`)
    })
  }
  qb.where(conditions)
}

module.exports = {
  model() {
    const knex = strapi.connections.default;
    const bookshelf = require("bookshelf")(knex);

    const User = bookshelf.model("User", {
      tableName: USER_TABLE,
    });
    const EventTableReserved = bookshelf.model(EVENT_TABLE_RESERVEDS_TABLE, {
      tableName: EVENT_TABLE_RESERVEDS_TABLE,
      user() {
        return this.hasOne(User, "id", "user_id");
      },
    });
    return EventTableReserved;
  },
  async findTableByEventID(eventID, filter) {
    const { round_id, user_id } = filter || {};
    const knex = strapi.connections.default;

    const condition = {
      event: eventID,
      ...round_id && { round_id },
      ...user_id && { users_permissions_user: user_id },
    };

    const reservedTables = await knex(EVENT_TABLE_RESERVEDS_TABLE)
      .select("zone_id", "round_id", "table_number")
      .where(condition);
    const count = await strapi.query("event-table-reserved")
      .count(condition);

    return { count, data: reservedTables };
  },
  async countUserReservedTable(eventID, userID) {
    const count = await strapi.query("event-table-reserved")
      .count({ event: eventID, users_permissions_user: userID });

    return count;
  },
  async reserveTables({ reqTransID, userID, eventID, tables }) {
    try {
      const knex = strapi.connections.default;

      await knex(EVENT_TABLE_RESERVEDS_TABLE).insert(
        tables.map((table) => ({
          req_trans_id: reqTransID,
          users_permissions_user: userID,
          event: parseInt(eventID, 10),
          round_id: parseInt(table.roundID, 10),
          zone_id: parseInt(table.zoneID, 10),
          table_number: parseInt(table.tableIndex, 10),
          price: table.price,
        }))
      );

      // Fix issue MySql returns last id only
      // Ref: https://github.com/knex/knex/issues/1828
      const reservedIDs = await knex(EVENT_TABLE_RESERVEDS_TABLE)
        .select("id")
        .where({
          req_trans_id: reqTransID,
          users_permissions_user: userID,
          event: parseInt(eventID, 10),
        });

      return reservedIDs.map((r) => r.id);
    } catch (e) {
      let code = "unknown";
      let message = e.message;
      if (e.code === "ER_DUP_ENTRY") {
        code = "reserve_table_failed";
        message = "Some tables have already been reserved.";
      } else {
        strapi.log.error(`[ReserveTable] error ${reqTransID}:`, e);
      }
      
      throw strapi.errors.badRequest(message, { code, message });
    }
  },
  async cancelReservedTables({ reqTransID, eventID, userID, remark }) {
    const knex = strapi.connections.default;
    const reservedTables = await knex(EVENT_TABLE_RESERVEDS_TABLE)
      .where({
        req_trans_id: reqTransID,
        users_permissions_user: userID,
        event: parseInt(eventID, 10),
      });

    if (reservedTables?.length > 0) {
      await strapi.query("event-table-reserved").delete({
        req_trans_id: reqTransID,
        event: eventID,
        users_permissions_user: userID,
      });

      const validData = reservedTables.map((table) => ({
        event_transaction_id: table.event_transaction,
        req_trans_id: table.req_trans_id,
        user_id: table.users_permissions_user,
        event_id: table.event,
        round_id: table.round_id,
        zone_id: table.zone_id,
        table_number: table.table_number,
        price: table.price,
        remark,
      }));

      await knex("event_table_reserved_canceleds").insert(validData);
    }
  },
  async adminGetTableReservedByEventID(eventID, options) {
    let pageSize = undefined;
    let page = undefined;
    const EventTableReserveds = strapi.services["event-table-reserved"].model();
    let sort = ["created_at", "DESC"];

    if (options._sort) {
      sort = options._sort.split(":");
    }

    if (options.page) {
      pageSize = options.page.pageSize;
      page = options.page.page;
    }
    
    let conditions = { event: eventID };

    if(options.filter) {
      conditions  = Object.assign(conditions, options.filter);
    }

    // Count with filter and keyword
    const countStr = await EventTableReserveds.query( qb => {
      queryAdminGetEventReserved(qb, conditions, options);
    })
    .count();
    const count = parseInt(countStr);

    if(!pageSize) {
      pageSize = count;
    }

    const rows = await EventTableReserveds.query( qb => {
        queryAdminGetEventReserved(qb, conditions, options);
      })
      .orderBy(sort[0], sort[1])
      .fetchPage({
        pageSize,
        page,
        debugger: true,
        columns: [
          `${EVENT_TABLE_RESERVEDS_TABLE}.id`,
          "event as event_id",
          "event_transaction as event_transaction_id",
          "users_permissions_user as user_id",
          `${EVENT_TRANSACTION_TABLE}.status`,
          `${EVENT_TRANSACTION_TABLE}.payment_transaction_id`,
          `${EVENT_TRANSACTION_TABLE}.net_amount`,
          `${EVENT_TRANSACTION_TABLE}.description`,
          `${EVENT_ZONE_TABLE}.name as zone_name`,
          `${EVENT_TABLE_RESERVEDS_TABLE}.created_at`,
          `${EVENT_TABLE_RESERVEDS_TABLE}.updated_at`,
        ],
        withRelated: [{
          user: function (query) {
            query.select(["id", "username", "email", "phone", "first_name", "last_name"]);
          },
        }]
      });
    return {
      count,
      rows,
    };
  }
};
