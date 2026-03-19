'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    // Called after an entry is updated
    async beforeUpdate(params, data) {
      if (data.Reward) {
        const branchIDs = data.Reward.map((r) => r.branch);
        const branchs = await strapi.query('branch').find({ id_in: branchIDs });

        for (let index = 0; index < data.Reward.length; index++) {
          const reward = data.Reward[index];
          if (reward.branch) {
            reward.title = branchs.find((b) => b.id === reward.branch)?.name;
          }
        }
      }
    },
  },
};
