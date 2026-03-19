'use strict';

const { sanitizeEntity } = require('strapi-utils');
const { transform } = require('../common/inboxes.dto');

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
  async findByUserID(ctx) {
    let entities;
    const { id: userID } = ctx.state.user

    const query = {
      deleted_at_null: true,
      ...ctx.query,
      published_at_null: false,
      'notification.published_at_null': false,
      users_permissions_user: userID,
    };

    if (ctx.query._q) {
      entities = await strapi.services.inbox.search(query);
    } else {
      entities = await strapi.services.inbox.find(query, ['notification', 'notification.cover_image']);
    }

    return entities.map(entity => transform(sanitizeEntity(entity, { model: strapi.models.inbox })));
  },
  async findByID(ctx) {
    const { id } = ctx.params;
    const { id: userID } = ctx.state.user

    const entity = await strapi.services.inbox.findOne({ id, users_permissions_user: userID }, ['notification', 'notification.cover_image']);
    return transform(sanitizeEntity(entity, { model: strapi.models.inbox }));
  },
  async updateActivity(ctx) {
    const { id: userID } = ctx.state.user;
    const { inboxID, notificationID, action } = ctx.request.body;

    const entity = await strapi.services.inbox.updateActivity({ userID, inboxID, notificationID, action });

    const result = sanitizeEntity(entity, { model: strapi.models.inbox });
    result.users_permissions_user = result.users_permissions_user.id;

    return transform(result);
  }
};
