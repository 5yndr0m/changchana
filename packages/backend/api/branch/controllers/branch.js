'use strict';

const { sanitizeEntity } = require("strapi-utils");
const { transform } = require("../common/branch.dto");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    /**
   * Retrieve records.
   *
   * @return {Array}
   */
  async findByApp(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.branch.search(ctx.query);
    } else {
      entities = await strapi.services.branch.find(ctx.query, ["cover_image", "logo"]);
    }

    return entities.map(entity => transform(sanitizeEntity(entity, { model: strapi.models.branch })));
  },
};
