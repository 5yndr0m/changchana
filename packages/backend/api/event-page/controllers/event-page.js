'use strict';

const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  async find(ctx) {
    const entity = await strapi.services['event-page'].find(undefined, ctx.query?.populate || undefined);
    return sanitizeEntity(entity, { model: strapi.models['event-page'] });
  },
};
