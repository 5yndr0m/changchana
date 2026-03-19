'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const afterCreate = async (result, data) => {
  if (data.status === "approved") {
    const reward = await strapi.components['atk-management.reward']
      .query(qb => {
        qb.where("branch", "=", data.branch)
      })
      .fetch()
      .then(resp => resp.attributes);


    await Promise.all([
      strapi.services['point-logs'].adjustPoints({
        points: reward.points,
        issueBy: -1,
        userID: data.users_permissions_user,
        remark: `atk_logs::atk approved (${data.branch})`,
      }),
      strapi.query('user', 'users-permissions').update(
        {
          id: data.users_permissions_user,
        },
        {
          atk_expired_at: result.expired_at,
        }
      )
    ]);
  }
}
module.exports = {
  lifecycles: {
    // beforeCreate,
    afterCreate,
  }
};
