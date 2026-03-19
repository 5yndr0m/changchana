'use strict';

const moment = require("moment-timezone");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  find: async (ctx) => {

    const rows = await strapi.services["booking"].find(ctx.query);
    const now = moment
    return rows.map(row => ({
      ...row,
      "approved_at": row.approved_at ? moment(row.approved_at).tz('Asia/Bangkok').format('DD/MM/YYYY HH:mm') : null,
      "waiting_time": row.status === "pending" ? moment(row.created_at).local('Asia/Bangkok').fromNow() : null,
    }));
  },
};
