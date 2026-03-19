'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  /**
 * Promise to check exist activate date
 *
 * @return {Promise<bool>}
 */
  checkExistActiveDate: async (data, excludeID) => {
    const result = await strapi.query('lucky-number')
      .count({
        begin_date_lte: data.end_date,
        end_date_gte: data.begin_date,
        id_nin: excludeID,
        active: true,
      })

    return result > 0
  },

};
