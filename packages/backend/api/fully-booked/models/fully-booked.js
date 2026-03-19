'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      const { branch, type, date } = data;
      const resp = await strapi.query('fully-booked').findOne({ branch, type, date });
      if(resp) {
        throw strapi.errors.badRequest("can't create fully booked, because already data in this date/ branch.");
      }
    },
  },
};
