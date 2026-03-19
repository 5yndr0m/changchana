'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const moment = require('moment');
const { json2csvAsync } = require('json-2-csv');
const { sanitizeEntity } = require('strapi-utils');
const { mappingResponse } = require('../common/mapping-response');

const modelName = "atk-log";
module.exports = {
  find: async (ctx) => {
    const entities = await strapi.services[modelName].find(ctx.query);

    return entities.map(entity => mappingResponse(sanitizeEntity(entity, { model: strapi.models[modelName] })));
  },
  exportReport: async (ctx) => {
    const { type } = ctx.params;
    const entities = await strapi.services[modelName].find(ctx.query);
    try {
      switch (type) {
        case "csv":
          const constent = entities.map(row => ({
            "first_name": row.users_permissions_user.first_name,
            "last_name": row.users_permissions_user.last_name,
            "phone": `'${row.users_permissions_user.phone}`,
            "email": row.users_permissions_user.email,
            "brance": row.branch.name,
            "status": row.status,
            "created_at": moment(row.created_at).local().format('DD/MM/YYYY HH:mm'),
          }));
          const csv = await json2csvAsync(constent);
          ctx.set('Content-disposition', `attachment; filename=atk-log-${moment().format('DD-MM-YY')}-export.csv`);
          ctx.set('Content-type', 'text/csv');
          ctx.body = csv
          break;

        default:
          ctx.body = {
            success: false,
            error: `report type: ${type}, unprocessable.`
          }
          break;
      }
    } catch (err) {
      ctx.status = 500
      ctx.body = {
        success: false,
        error: err.message
      }
    }

  },

  create: async (ctx) => {
    try {
      const now = moment().utc();
      const atkExpired = moment(now).add(12, "hours").format("YYYY-MM-DD HH:mm:ss");
      const { id: staffID } = ctx.state.user;
      const {
        status,
        branch: branchID,
        userID,
      } = ctx.request.body;
      const validData = await strapi.entityValidator.validateEntityCreation(
        strapi.models[modelName],
        {
          status,
          branch: branchID,
          users_permissions_user: userID,
          expired_at: status === "approved" ? atkExpired : null,
          created_by: staffID,
          updated_by: staffID,
        },
      );
      if (status === "approved") {
        const reward = await strapi.components['atk-management.reward']
          .query(qb => {
            qb.where("branch", "=", branchID)
          })
          .fetch()

        if (!reward) {
          throw strapi.errors.badRequest('Reward not set, please contact admin for setup reward for this branch.');
        }

        // Check ATK not expired ?
        const currentUser = await strapi.query('user', 'users-permissions').findOne({
          id: userID,
        });

        const userATK = moment(currentUser.atk_expired_at);
        if (now.isBefore(userATK)) {
          throw strapi.errors.badRequest(`ATK's user is active to ${userATK.utcOffset("+07:00").format("DD/MM/YYYY HH:mm:ss")}, Please try again later or contact admin.`);
        }
      }

      const { id, users_permissions_user: user, branch, expired_at } = await strapi.query(modelName).create(validData);
      ctx.body = {
        success: true,
        data: {
          id,
          expired_at,
          status,
          user: {
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            citizen_id: user.citizen_id,
            phone: user.phone,
            email: user.email,
          },
          branch: {
            id: branch.id,
            name: branch.name,
            phone: branch.phone,
            line: branch.line,
          }
        }
      }
    } catch (error) {
      ctx.body = {
        success: false,
        error: error.message,
      }
    }
  }

};
