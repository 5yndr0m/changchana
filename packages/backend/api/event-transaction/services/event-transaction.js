'use strict';

const omise = require("omise");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */
const OMISE_CONFIG = {
  secretKey: process.env.OMISE_SECRET_KEY,
  omiseVersion: "2019-05-29",
  promptPayExpire: process.env.OMISE_PROMPT_PAY_EXPIRE ? Number(process.env.OMISE_PROMPT_PAY_EXPIRE) : 900,
};

const getOmiseReturnUrl = (eventSlug, reqTrxID) => `${process.env.WEBSITE_ENDPOINT_URL}/event/${eventSlug}/complete?rtrxid=${reqTrxID}`;
const omsChargesRetrieve = async (chargeID) => {
  try {
    const oms = omise(OMISE_CONFIG);
    const result = await oms.charges.retrieve(chargeID);
    return result;
  } catch (e) {
    strapi.log.error(`[omsChargesRetrieve] error:`, e);
    return null;
  }
}

const queryAdminGetEventTransaction = (qb, conditions, options) => {
  qb.innerJoin("users-permissions_user", "event_transaction.user_id", "users-permissions_user.id")
  if (options.keyword) {
    qb.where( function (){
      this.where("users-permissions_user.first_name", "like", `${options.keyword}%`)
        .orWhere("users-permissions_user.last_name", "like", `${options.keyword}%`)
        .orWhere("users-permissions_user.email", "like", `${options.keyword}%`)
        .orWhere("users-permissions_user.phone", "like", `${options.keyword}%`)
    })
  }
  qb.where(conditions)
}

module.exports = {
  model: () => {
    const knex = strapi.connections.default;
    const bookshelf = require("bookshelf")(knex);

    const EventReserveds = bookshelf.model("event_table_reserveds", {
      tableName: "event_table_reserveds",
    });
    const User = bookshelf.model("User", {
      tableName: "users-permissions_user",
    });
    const EventTransactions = bookshelf.model("event_transaction", {
      tableName: "event_transaction",
      event_table_reserveds() {
        return this.hasMany(EventReserveds, "event_transaction", "id")
      },
      user() {
        return this.hasOne(User, "id", "user_id");
      }
    });
    return EventTransactions;
  },
  adminGetTransactionByEventID: async (eventID, options) => {
    let pageSize = undefined;
    let page = undefined;
    const Events = strapi.services["event-transaction"].model();
    let sort = ["created_at", "DESC"];

    if (options._sort) {
      sort = options._sort.split(":");
    }

    if (options.page) {
      pageSize = options.page.pageSize;
      page = options.page.page;
    }
    
    let conditions = { event_id: eventID };

    if(options.filter) {
      conditions  = Object.assign(conditions, options.filter);
    }

    // Count with filter and keyword
    const countStr = await Events.query( qb => {
      queryAdminGetEventTransaction(qb, conditions, options);
    })
    .count();
    const count = parseInt(countStr);

    if(!pageSize) {
      pageSize = count;
    }

    const rows = await Events.query( qb => {
        queryAdminGetEventTransaction(qb, conditions, options);
      })
      .orderBy(sort[0], sort[1])
      .fetchPage({
        pageSize,
        page,
        debugger: true,
        columns: ["event_transaction.id", "event_id", "user_id", "price", "fee", "fee_vat", "net_amount", "event_transaction.points", "event_transaction.status", "payment_created", "payment_transaction_id", "payment_method", "req_trans_id", "round_id", "description", "event_transaction.created_at", "event_transaction.updated_at"],
        withRelated: [{
          user: function (query) {
            query.select(["id", "username", "email", "phone", "first_name", "last_name"]);
          },
          event_table_reserveds: function (query) {
            query.select(["id", "zone_id", "round_id", "table_number", "price", "event", "event_transaction"]);
          },
        }]
      });
    return {
      count,
      rows,
    };
  },
  createChargeToOmise: async (payloads) => {
    const {
      omiseToken,
      omiseSource,
      amount,
      eventID,
      eventSlug,
      requestTransactionID,
    } = payloads;

    try {
      const oms = omise(OMISE_CONFIG);
      const inputs = {
        description: `Charge for event ID: ${eventID} (${requestTransactionID})`,
        amount: amount * 100,
        currency: "THB",
        capture: true,
        return_uri: getOmiseReturnUrl(eventSlug, requestTransactionID),
      };

      if (omiseToken) {
        inputs.card = omiseToken;
      } else if (omiseSource) {
        inputs.source = omiseSource;
        // Check payment method from source?
        // ... omise-node lib not implement retrieve function for source
        const now = new Date();
        now.setSeconds(now.getSeconds() + OMISE_CONFIG.promptPayExpire);
        inputs.expires_at = now.toISOString();
      }

      const resp = await oms.charges.create(inputs)
      return {
        success: true,
        data: resp,
      };
    } catch (error) {
      strapi.log.error(`[EventTransaction][createChargeToOmise] error ${requestTransactionID}:`, JSON.stringify(error));
      return {
        success: false,
        error,
      };
    }
  },
  createOmiseRefund: async (payloads, createdBy) => {
    const oms = omise(OMISE_CONFIG);
    const {
      id,
      payment_transaction_id,
      status = "successful"
    } = payloads;
    const transaction = await strapi.query("event-transaction").findOne({
      id,
      payment_transaction_id,
      status,
    });

    if (!transaction) {
      return {
        success: false,
        description: "transaction not found",
      };
    }

    try {
      const resp = await oms.charges.createRefund(transaction.payment_charge_id, {
        amount: transaction.price * 100,
        metadata: {
          createdBy: createdBy ? `Created by: ${createdBy}` : null,
        }
      });

      if (resp) {
        return {
          success: true,
          data: {
            ...resp,
            eventID: transaction.event_id,
            reqTransID: transaction.req_trans_id,
            userID: transaction.user_id.id,
            points: transaction.points,
            price: transaction.price,
          },
        };
      }
    } catch (error) {
      return {
        success: false,
        description: error.message,
      };
    }

    return {
      success: false,
      description: "refund unsuccessful",
    };
  },
  refundService: async ({userID, transactionID, paymentTransactionID}) => {
    try {
      const resp = await strapi.services["event-transaction"].createOmiseRefund({ id: transactionID, payment_transaction_id: paymentTransactionID },userID);
      const { success, description, data } = resp;

      if (success) {
        const remark = `Refunded event transaction: ${transactionID}`;
        await strapi.query("event-transaction").update(
          { id: transactionID },
          {
            status: "refunded",
            payment_refund_transaction_id: data.transaction,
            payment_refuned_at: data.created,
          });
        await strapi.services["event-table-reserved"].cancelReservedTables({
          reqTransID: data.reqTransID,
          eventID: data.eventID,
          userID: data.userID,
          remark,
        });

        if(data.points && data.points > 0) {
          await strapi.services["point-logs"].adjustPoints({
            points: data.points,
            issueBy: -1,
            userID: data.userID,
            remark,
          });
        }
      }
      return {
        success,
        description,
        data: data && {
          refundID: data.id,
          transaction: data.transaction,
          created: data.created,
          price: data.price,
          points: data.points,
        },
      };
    } catch (error) {
      strapi.log.error(`[EventTransaction][refund] error:`, error);
      return {
        success: false,
        description: error.message,
      };
    }
  },
  resolvePaymentPending: async () => {
    try {
      const transactions = await strapi.query("event-transaction").find({ status: "pending" });

      for (let index = 0; index < transactions.length; index++) {
        const trx = transactions[index];
        const charge = await omsChargesRetrieve(trx.payment_charge_id);

        if (charge && charge.status !== "pending") {
          const eventTrx = await strapi.query("event-transaction")
            .update(
              { id: trx.id },
              {
                status: charge.status,
                payment_failure_code: charge.failure_code,
                payment_failure_message: charge.failure_message,
              },
            );

          if (eventTrx && charge.status !== "successful") {
            const remark = `payment[${trx.id}] ${charge.status}: ${charge.failure_message}`;
            await strapi.services["event-table-reserved"].cancelReservedTables({
              reqTransID: eventTrx.req_trans_id,
              eventID: eventTrx.event_id,
              userID: eventTrx.user_id.id,
              remark,
            });

            if (eventTrx.points && eventTrx.points > 0) {
              await strapi.services["point-logs"].adjustPoints({
                points: eventTrx.points,
                issueBy: -1,
                userID: eventTrx.user_id.id,
                remark,
              });
            }
          }
        }
      }
    } catch (e) {
      console.log(e);
      strapi.log.error(`[EventTransaction][resolvePaymentPending] error:`, e);
    }
  },
};
