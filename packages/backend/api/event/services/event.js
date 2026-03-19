'use strict';

const moment = require("moment-timezone");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

const BadRequestException = (code, message) =>
  strapi.errors.badRequest(message, { code, message });

const calculateSummary = (event, transactions, filters = {}) => {
  const { round_id } = filters;
  const result = {
    event: {
      id: event.id,
      saleDate: null, // Asia/Bangkok timezone
      firstTransactionDate: null, // Asia/Bangkok timezone
      lastTransactionDate: null, // Asia/Bangkok timezone
    },
    ticket: {
      total: 0,
      paid: 0,
      pending: 0,
    },
    sales: {
      transactionTotal: transactions.length,
      amount: 0,
      net: 0,
      fee: 0,
      paymentGatewayFee: 0,
    },
    points: {
      used: 0,
      transactionTotal: 0,
    },
    ticketByZone: [],
    graphData: [],
    graphDataPerHours: [],
    buyerGender: {
      male: 0,
      female: 0,
      other: 0,
    },
  };
  const ticketStatsByZone = {};
  const graphDataByDate = {};
  const graphDataByHours = {};
  const zones = [];

  event.zones.forEach((z) => {
    const tableTotal = round_id ? z.number_of_table : z.number_of_table * event.rounds.length;

    result.ticket.total += tableTotal;
    ticketStatsByZone[z.name] = {
      id: z.id,
      name: z.name,
      price: z.price,
      ticket: {
        total: tableTotal,
        paid: 0,
        pending: 0,
      },
    };
    zones.push(z.name);
  });

  for (let index = 0; index < transactions.length; index++) {
    const tx = transactions[index];
    const createAt = moment(tx.created_at).tz("Asia/Bangkok");
    const txDate = createAt.format("YYYY-MM-DD");
    const txDateHours = createAt.format("YYYYMMDDHH");
    // Graph Data
    if (!graphDataByDate[txDate]) {
      graphDataByDate[txDate] = {
        date: txDate,
        saleTotal: 0,
        seatTotal: 0
      };
    }

    if (!graphDataByHours[txDateHours]) {
      graphDataByHours[txDateHours] = {
        label: createAt.format("DD/MM/YYYY HH:00"),
        saleTotal: 0,
      };
    }

    if (tx.status === "successful") {
      result.sales.amount += tx.price || 0;
      result.sales.net += tx.net_amount || 0;
      result.sales.fee += tx.fee_vat || 0;
      result.sales.paymentGatewayFee += tx.fee || 0;

      if (tx.points) {
        result.points.used += tx.points;
        result.points.transactionTotal++;
      }

      graphDataByDate[txDate].saleTotal++;
    }

    tx.description.split(", ").forEach((tb) => {
      const zoneName = zones.find((z) => tb.indexOf(z) === 0);

      if (ticketStatsByZone[zoneName]) {
        const status = tx.status === "successful" ? "paid" : "pending"
        ticketStatsByZone[zoneName].ticket[status]++;
        result.ticket[status]++;

        if (tx.status === "successful") {
          graphDataByDate[txDate].seatTotal++;
          graphDataByHours[txDateHours].saleTotal++;

          result.buyerGender[tx.user_id.gender]++;
        }
      }
    });
  }

  const transactionDates = Object.keys(graphDataByDate);
  transactionDates.sort((a, b) => new Date(a) - new Date(b));
  result.graphData = transactionDates
    .map((date) => graphDataByDate[date]);
  result.ticketByZone = Object.keys(ticketStatsByZone)
    .map((zone) => ticketStatsByZone[zone]);

  result.event.firstTransactionDate = transactionDates[0];
  result.event.lastTransactionDate = transactionDates[transactionDates.length - 1];
  result.event.saleDate = event.first_published_at || event.published_at;

  if (result.event.saleDate && result.event.saleDate <= result.event.firstTransactionDate) {
    result.event.saleDate = moment(result.event.saleDate).tz("Asia/Bangkok").format("YYYY-MM-DD")
  } else {
    result.event.saleDate = result.event.firstTransactionDate;
  }

  result.graphDataPerHours = Object.keys(graphDataByHours)
    .map((row) => graphDataByHours[row]);

  return result;
};

module.exports = {
  model: () => {
    const knex = strapi.connections.default;
    const bookshelf = require("bookshelf")(knex);

    const User = bookshelf.model("User", {
      tableName: "users-permissions_user",
    });

    const Branch = bookshelf.model("Branches", {
      tableName: "branches",
    });
    const EventRound = bookshelf.model("EventRounds", {
      tableName: "components_event_rounds_event_rounds",
    });
    const EventZone = bookshelf.model("EventZone", {
      tableName: "components_event_zones_zones",
    });
    
    const EventTransactions = bookshelf.model("event_transaction", {
      tableName: "event_transaction",
      user() {
        return this.hasOne(User, "id", "user_id")
        .query((query) => {
          query.column(["id", "first_name", "gender"]);
        });
      } 
    });

    const EventComponent = bookshelf.model("EventComponent", {
      tableName: "events_components",
      date() {
        return this.hasOne(EventRound, "id", "component_id")
      },
    });
    const EventComponentZone = bookshelf.model("EventComponentZone", {
      tableName: "events_components",
      zoneData() {
        return this.hasOne(EventZone, "id", "component_id")
        .query((query) => {
          query.column(["id", "name", "price", "points", "number_of_table"]);
        });
      },
    });

    const Event = bookshelf.model("Event", {
      tableName: "events",
      branch() {
        return this.hasOne(Branch, "id", "branch");
      },
      rounds() {
        return this.hasMany(EventComponent, "event_id", "id").query({ where: { field: "rounds" } });
      },
      zones() {
        return this.hasMany(EventComponentZone, "event_id", "id").query({ where: { field: "zones" } });
      },
      transactions() {
        return this.hasMany(EventTransactions, "event_id", "id")
        .query((query) => {
          query.where("status", "successful");
          query.column(["id", "event_id", "status", "description", "updated_at", "user_id", "points"]);
        });
      }
    });
    return Event;
  },
  getTransactions: async (payloads) => {
    const { id, sort, page = null, pageSize = null, round_id = null, status: ticketStatus = null, keyword = null, zone = null, isByZone = false } = payloads;

    const event = await strapi.query("event").findOne({ id });

    const options = {
      _sort: sort,
      filter: {},
    };

    if (page) {
      options.page = {
        page,
        pageSize,
      };
    }

    if (ticketStatus) {
      options.filter.status = ticketStatus;
    }

    if (keyword) {
      options.keyword = keyword;
    }

    let count = null, rows = null;
    if (!isByZone) {
      if (round_id) {
        options.filter.round_id = round_id;
      }
      const res = await strapi.services["event-transaction"].adminGetTransactionByEventID(id, options);
      count = res.count;
      rows = res.rows;
    } else {
      if (zone) {
        options.zone_name = zone;
      }
      const res = await strapi.services["event-table-reserved"].adminGetTableReservedByEventID(id, options);
      count = res.count;
      rows = res.rows;
    }

    const resp = {
      count,
      rows,
      event: {
        id,
        title: event.title,
        description: event.description,
        type: event.type,
        limit_per_user: event.limit_per_user,
        slug: event.slug,
        status: event.status,
        rounds: event.rounds,
        zones: event.zones,
        published_at: event.published_at,
      },
    };

    return resp;
  },
  getSummary: async (eventID, filters = {}) => {
    const { round_id, date_from, date_to } = filters;

    const event = await strapi.query("event").findOne({ id: eventID });
    if (!event) {
      throw BadRequestException("event_not_found", "event not found");
    }

    const transactions = await strapi.query("event-transaction").find({
      event_id: eventID,
      status_in: ["successful", "pending"],
      ...round_id && { round_id },
      ...date_from && { created_at_gte: date_from },
      ...date_to && { created_at_lte: date_to },
    });

    const summary = calculateSummary(event, transactions, filters);

    return summary;
  },
  getEventCompare: async (eventList) => {
    const event = strapi.services["event"].model();
    const data = await event.query((query) => {
      query.whereIn("id", eventList);
      // query.join("events_components", "events.id", "events_components.event_id")
      // .where("events_components.field", "rounds")
      // .join("components_event_rounds_event_rounds", "events_components.component_id", "components_event_rounds_event_rounds.id");
      // query.select(["id", "title"]);
    }).fetchAll({
      columns: ["id", "title", "branch"],
      withRelated: [
        "rounds.date",
        "zones.zoneData",
        "transactions.user",
        {
          branch: function (query) {
            query.columns(["id", "name"]);
          },
          rounds: function (query) {
            query.columns(["id", "component_id", "event_id"]);
          },
          zones: function (query) {
            query.columns(["id", "component_id", "event_id"]);
          }
        }]
    });

    return data;
  }
};
