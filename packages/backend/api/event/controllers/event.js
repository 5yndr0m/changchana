const moment = require('moment');

module.exports = {
  list: async (ctx) => {
    const entities = await strapi.query("event").find({ _sort: "id:DESC", ...ctx.query }, []);
    return entities.map((entity) => ({
      id: entity.id,
      title: entity.title,
    }));
  },
  findRounds: async (ctx) => {
    const id = ctx.params.id;
    const entities = await strapi.query("event").findOne({ id }, []);
    return entities?.rounds ?? [];
  },
  findZones: async (ctx) => {
    const id = ctx.params.id;
    const entities = await strapi.query("event").findOne({ id });
    return entities?.zones ?? [];
  },
  findReservedTables: async (ctx) => {
    const { id } = ctx.params;
    const { round_id } = ctx.query;

    return await strapi.services["event-table-reserved"].findTableByEventID(id, { round_id });
  },
  countUserReservedTable: async (ctx) => {
    const { id } = ctx.params;
    const { id: userID } = ctx.state.user;

    const count = await strapi.services["event-table-reserved"].countUserReservedTable(id, userID);
    return { count };
  },
  getTransactions: async (ctx) => {
    const { id } = ctx.params;
    const { objectReturn, _sort, page = null, pageSize = null, round_id = null, status = null, keyword = null } = ctx.query;
    const resp = await strapi.services["event"].getTransactions({
      id,
      sort: _sort,
      page,
      pageSize,
      round_id,
      status,
      keyword,
    });

    if (objectReturn) {
      const result = {};
      objectReturn.forEach(key => result[key] = resp[key]);
      return result;
    }

    return resp;
  },
  getZoneTransactions: async (ctx) => {
    const { id } = ctx.params;
    const { _sort, page = null, pageSize = null, zone = null, status = null, keyword = null } = ctx.query;
    const resp = await strapi.services["event"].getTransactions({
      id,
      sort: _sort,
      page,
      pageSize,
      zone,
      status,
      keyword,
      isByZone: true,
    });
    return resp;
  },
  exportTransactionReport: async (ctx) => {
    const { id } = ctx.params;
    const { rows, event } = await strapi.services["event"].getTransactions({ id });
    const rounds = event.rounds;
    const list = rows.toJSON();

    const constent = list.map(row => ({
      "first_name": row.user.first_name,
      "last_name": row.user.last_name,
      "phone": `'${row.user.phone}`,
      "email": row.user.email,
      "table": row.description,
      "round": rounds.find(round => round.id === row.round_id)?.date || "-",
      "price": row.price,
      "point": row.points,
      "transaction_id": row.payment_transaction_id,
      "status": row.status,
      "req_trans_id": row.req_trans_id,
      "created_at": moment(row.created_at).local().format('DD/MM/YYYY HH:mm'),
    }));
    return constent;
  },
  getSummary: async (ctx) => {
    const { id } = ctx.params;
    const { round_id, date_from, date_to } = ctx.query;
    const result =  await strapi.services["event"]
      .getSummary(id, {
        round_id,
        date_from,
        date_to,
      });

    return result;
  },
  getCompare: async (ctx) => {
    const { events } = ctx.query;
    const result = await strapi.services["event"]
      .getEventCompare(events);

    return result;
  },
};
