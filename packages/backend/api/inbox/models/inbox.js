'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async afterUpdate(result, params, data) {
      if (data.read_at && result.read_at) {
        await strapi
          .query('notification')
          .model.query((qb) => {
            qb.where("id", result.notification.id);
            qb.increment("read_count", 1);
          }).fetch();
      } else if (data.deleted_at && result.deleted_at) {
        await strapi
          .query('notification')
          .model.query((qb) => {
            qb.where("id", result.notification.id);
            qb.increment("delete_count", 1);
          }).fetch();
      }
    },
  }
};
