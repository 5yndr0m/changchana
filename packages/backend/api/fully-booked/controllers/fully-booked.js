"use strict";
const moment = require("moment-timezone");

/**
 * Retrieve records.
 *
 * @return {Array}
 */
const branchAvailable = async (ctx) => {
  try {
    const { date } = ctx.request.body;

    if (!date) {
      throw strapi.errors.badRequest("Please select date");
    }
    const checkDate = moment(date).tz("Asia/Bangkok").format("YYYY-MM-DD");

    const events = await strapi.services["fully-booked"]
      .find({
        date: checkDate,
      });
    const ids = events.map((row) => row.branch.id);
    const branchs = await strapi.query("branch")
      .find({
        published_at_null: false,
        id_nin: ids,
      });

    const resp = branchs.map(row => ({ id: row.id, name: row.name }));
    ctx.body = resp;
  } catch (error) {
    throw strapi.errors.badRequest(error.message);
  }
}
module.exports = {
  branchAvailable,
};
