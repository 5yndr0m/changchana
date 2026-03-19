"use strict";

const { isDraft } = require("strapi-utils").contentTypes;

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

/*
* payloads: { points: number; userID: number; remark: string; issueBy: number; }
*/
const adjustPoints = async (payloads) => {
  try {
    await strapi.services["point-logs"].create({
      amount: payloads.points,
      issue_by: payloads.issueBy,
      target_user: payloads.userID,
      remark: payloads.remark,
    });

    await strapi
      .query("user", "users-permissions")
      .model.query((qb) => {
        qb.where("id", payloads.userID);
        qb.increment("points", payloads.points);
      }).fetch();

    return {
      success: true,
    };
  } catch (error) {
    strapi.log.error("[AdjustPoints] Error:", error);
    return {
      success: false,
      error: error.message,
    }
  }
}

const pointsRedemption = async (payloads, transaction) => {
  try {
    const conn = transaction || strapi.connections.default;
    const rows = await conn("point_logs")
      .where("target_user", payloads.userID)
      .sum("amount as points");

    const userPoints = rows[0]?.points ?? 0;

    if (payloads.points > userPoints) {
      throw strapi.errors.badRequest("User points not enough for redemption");
    }

    const data = {
      amount: payloads.points * -1,
      issue_by: payloads.issueBy,
      target_user: payloads.userID,
      remark: payloads.remark,
    };
    const validData = await strapi.entityValidator.validateEntityCreation(
      strapi.models["point-logs"],
      data,
      { isDraft: isDraft(data, strapi.models["point-logs"]) }
    );
    await strapi.query("point-logs")
      .create(validData, { transacting: transaction });

    await strapi
      .query("user", "users-permissions")
      .model.query((qb) => {
        qb.where("id", payloads.userID);
        qb.decrement("points", payloads.points);
      }).fetch({ transacting: transaction });
    return {
      success: true,
    };
  } catch (error) {
    strapi.log.error("[PointsRedemption] Error:", error);
    return {
      success: false,
      error: error.message,
    }
  }
}

module.exports = {
  adjustPoints,
  pointsRedemption,
};
