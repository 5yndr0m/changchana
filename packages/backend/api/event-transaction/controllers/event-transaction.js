"use strict";
const _ = require("lodash");
const moment = require("moment-timezone");
const { v4: uuid } = require("uuid");
const ticket = require("./user/ticket");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const modelName = "event-transaction";

const BadRequestException = (code, message) =>
  strapi.errors.badRequest(message, { code, message });

const calculateTablePayment = async (eventID, tables) => {
  const event = await strapi.services.event.findOne({ id: eventID });
  if (!event) {
    throw BadRequestException("event_not_found", "event not found");
  } else if (!tables || tables.length === 0) {
    throw BadRequestException("no_reserved_tables", "No reserved tables data");
  }

  let amount = 0;
  let redeemPoints = 0;
  let eventRoundID;

  const tablesSummary = tables.map((table) => {
    const { zoneID, roundID, tableIndex } = table;

    eventRoundID = roundID;
    const round = event.rounds.find((data) => `${data.id}` === `${roundID}`);
    const zone = event.zones.find((data) => `${data.id}` === `${zoneID}`);

    if (!round || !zone || tableIndex < 0 || tableIndex >= zone.number_of_table) {
      throw BadRequestException("tables_invalid", "Invalid tables");
    } else if (round.date < moment().tz("Asia/Bangkok").format("YYYY-MM-DD")) {
      throw BadRequestException("round_invalid", "Invalid round");
    }

    amount += zone.price;
    redeemPoints += zone.points;

    return {
      ...table,
      roundID,
      roundDate: round.date,
      name: `${zone.name}${Number(tableIndex) + 1}`,
      price: zone.price,
    };
  });

  return {
    eventName: event.title,
    eventSlug: event.slug,
    amount,
    redeemPoints,
    roundID: eventRoundID,
    tables: tablesSummary,
  };
};

module.exports = {
  /**
   * Create records.
   *
   * @return{Array}
   */
  create: async (ctx) => {
    const knex = strapi.connections.default;
    const pointsTransaction = await knex.transaction();
    const userID = parseInt(ctx.state.user.id);
    const { omiseToken, omiseSource, tables, eventID, transactionID } = ctx.request.body;
    const reqTransID = transactionID || uuid();
    let isReservedTable = false;

    try {
      strapi.log.info(`[EventTransaction][create] ${reqTransID}:`, { transactionID, reqTransID, eventID, userID });
      const summary = await calculateTablePayment(eventID, tables);
      const reservedTableIDs = await strapi.services["event-table-reserved"].reserveTables({
        reqTransID,
        userID,
        eventID,
        tables: summary.tables,
      });
      isReservedTable = true;

      if (summary.redeemPoints > 0) {
        const redempResult = await strapi.services["point-logs"].pointsRedemption({
          points: summary.redeemPoints,
          issueBy: -1,
          userID,
          remark: "event reserved table",
        }, pointsTransaction);

        if (!redempResult.success) {
          throw BadRequestException("redeem_point_failed", redempResult.error);
        }
      }

      const chargeResp = await strapi.services[modelName].createChargeToOmise({
        omiseToken,
        omiseSource,
        amount: summary.amount,
        eventID,
        eventSlug: summary.eventSlug,
        requestTransactionID: reqTransID,
      });

      if (!chargeResp.success) {
        throw chargeResp.error;
      }

      const { data } = chargeResp;
      const paymentMethod = data.source?.type || "card";
      const resp = await strapi.services[modelName].create({
        user_id: userID,
        req_trans_id: reqTransID,
        event_id: `${eventID}`,
        payment_charge_id: data.id,
        payment_card_id: data.card?.id,
        payment_transaction_id: data.transaction,
        payment_created: data.created,
        payment_method: paymentMethod,
        price: summary.amount,
        net_amount: data.net * 0.01,
        fee: data.fee * 0.01,
        fee_vat: data.fee_vat * 0.01,
        points: summary.redeemPoints,
        status: data.status,
        created_by: userID,
        updated_by: userID,
        event_table_reserveds: reservedTableIDs,
        round_id: summary.roundID,
        description: summary.tables.map((t) => t.name).join(", "),
      });

      if (data.status === "failed") {
        throw BadRequestException(data.failure_code, data.failure_message);
      }

      pointsTransaction.commit();

      ctx.body = {
        success: true,
        data: {
          id: resp.id,
          reqTransID,
          description: resp.description,
          eventID: resp.event_id,
          eventName: summary.eventName,
          points: resp.points,
          price: resp.price,
          paymentChargeID: resp.payment_charge_id,
          paymentTransactionID: resp.payment_transaction_id,
          status: resp.status,
          paymentFailureCode: data.failure_code,
          paymentFailureMessage: data.failure_message,
          paymentCreated: resp.payment_created,
          paymentMethod,
          qrcodeUrl: data.source?.scannable_code?.image.download_uri,
          authorizeUrl: data.authorize_uri,
        },
      };
    } catch (e) {
      strapi.log.error(`[EventTransaction][create] error ${reqTransID}:`, JSON.stringify(e));

      if (!pointsTransaction.isCompleted()) {
        pointsTransaction.rollback();
      }

      if (isReservedTable) {
        await strapi.services["event-table-reserved"].cancelReservedTables({
          reqTransID,
          eventID,
          userID,
          remark: `create event transaction failed: ${e.message}`,
        });
      }

      throw e;
    }
  },
  refund: async (ctx) => {
    const { id: transactionID } = ctx.params;
    const { payment_transaction } = ctx.request.body;

    const redempResult = await strapi.services[modelName].refundService({
      userID: ctx.state.user.id,
      transactionID: transactionID,
      paymentTransactionID: payment_transaction
    });
    return redempResult;
  },
  bookingToday: async (ctx) => {
    const knex = strapi.connections.default;
    const today = moment();
    const tomorrow = today.add(1, "day").format("YYYY-MM-DD");
    const yesterday = today.subtract(1, "day").format("YYYY-MM-DD");

    const {
      branch,
      expandPeriod = false,
      status = ["successful", "refunded", "pending", "expired", "failed", "reversed", "partial_refunded"],
      name = "",
    } = ctx.query;

    const query = knex("events")
      .where("branch", branch)
      .join("events_components", "events.id", "events_components.event_id")
      .where("events_components.field", "rounds")
      .join("components_event_rounds_event_rounds", "events_components.component_id", "components_event_rounds_event_rounds.id");

    if (expandPeriod) {
      query.whereBetween("components_event_rounds_event_rounds.date", [yesterday, tomorrow]);
    } else {
      query.where("components_event_rounds_event_rounds.date", today.format("YYYY-MM-DD"));
    }

    const events = await query.select(
      "events.id as event_id",
      "events_components.component_id as round_id",
    );

    if (events) {
      const EventTransactions = strapi.services[modelName].model();
      let zoneIds = [];
      const resp = await EventTransactions
        .where(function () {
          this.where("event_id", "in", _.map(events, "event_id"));
          this.where("status", "in", status);
        })
        .fetchAll({
          debugger: true,
          columns: ["id", "event_id", "user_id", "price", "points", "status", "payment_created", "payment_transaction_id", "req_trans_id", "round_id", "description", "created_at", "updated_at"],
          withRelated: [{
            user: function (query) {
              query.select(["id", "username", "email", "phone", "first_name", "last_name"]);
            },
            event_table_reserveds: function (query) {
              query.where("round_id", "in", _.map(events, "round_id"));
              query.select(["id", "zone_id", "round_id", "table_number", "price", "event", "event_transaction"]);
            },
          }]
        })
        .filter(row => {
          const table = row.related("event_table_reserveds").toJSON();
          const user = row.related("user").toJSON();
          if (table.length > 0) {
            zoneIds = zoneIds.concat(_.map(table, "zone_id"));

            if (name) {
              return user.first_name === name;
            }
            return true;
          }
          return false;
        });
      return {
        bookings: resp,
      };
    }


    return [];
  },
  getPaymentStatus: async (ctx) => {
    const { id } = ctx.params;
    const eventTransaction = await strapi.services[modelName].findOne({
      req_trans_id: id,
      user_id: ctx.state.user.id
    }, []);

    if (!eventTransaction) {
      throw BadRequestException("event_transaction_not_found", "event transaction not found");
    }

    return {
      id: eventTransaction.id,
      status: eventTransaction.status,
      description: eventTransaction.description,
      eventID: eventTransaction.event_id,
      paymentMethod: eventTransaction.payment_method,
      paymentFailureCode: eventTransaction.payment_failure_code,
      paymentFailureMessage: eventTransaction.payment_failure_message,
    };
  },
  // Waiting to remove after deploy production
  getPaymentStatusOld: async (ctx) => {
    const { id } = ctx.params;
    const eventTransaction = await strapi.services[modelName].findOne({ id, user_id: ctx.state.user.id }, []);

    if (!eventTransaction) {
      throw BadRequestException("event_transaction_not_found", "event transaction not found");
    }

    return {
      id: eventTransaction.id,
      status: eventTransaction.status,
      description: eventTransaction.description,
      eventID: eventTransaction.event_id,
      paymentMethod: eventTransaction.payment_method,
      paymentFailureCode: eventTransaction.payment_failure_code,
      paymentFailureMessage: eventTransaction.payment_failure_message,
    };
  },
  getUserTickets: ticket.getUserTickets,
  cancelUserTicket: ticket.cancelUserTicket,
  omiseEvent: async (ctx) => {
    const { body } = ctx.request;

    if (body.key === "charge.complete" && body.data) {
      strapi.log.info(`[EventTransaction][omiseEvent] request`, { ...body });
      const result = await strapi.services[modelName].findOne({ payment_charge_id: body.data.id, status: "pending" }, []);

      if (result) {
        await strapi.services[modelName].update({ id: result.id }, {
          status: body.data.status,
          payment_failure_code: body.data.failure_code,
          payment_failure_message: body.data.payment_failure_message,
        });

        if (body.data.status === "failed") {
          const remark = `payment[${result.id}] failed: ${body.data.payment_failure_message}`;
          await strapi.services["event-table-reserved"].cancelReservedTables({
            reqTransID: result.req_trans_id,
            eventID: result.event_id,
            userID: result.user_id,
            remark,
          });

          if (result.points && result.points > 0) {
            await strapi.services["point-logs"].adjustPoints({
              points: result.points,
              issueBy: -1,
              userID: result.user_id,
              remark,
            });
          }
        }
      }
    }

    return { success: true };
  },
};
