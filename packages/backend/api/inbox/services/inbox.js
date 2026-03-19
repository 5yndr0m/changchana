'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async addNotification({ notificationID }) {
    const chunkSize = 10000;
    const userTotal = await strapi
      .query('user', 'users-permissions')
      .count();

    const chunkTotal = Math.ceil(userTotal / chunkSize);
    let lastID = 0;

    for (let index = 0; index < chunkTotal; index++) {
      const users = await strapi
        .query('user', 'users-permissions')
        .find({
          _limit: chunkSize,
          _sort: 'id:asc',
          id_gt: lastID,
        });

      if (users.length > 0) {
        const knex = strapi.connections.default;
        const now = new Date();

        await knex('inboxes').insert(
          users.map((user) => ({
            users_permissions_user: user.id,
            notification: notificationID,
            published_at: now,
          }))
        );
  
        lastID = users[users.length - 1].id;

        // TODO: Update process state with lastID to database for retry process
      }
    }

    return { sentTotal: userTotal }
  },
  async updateActivity(payload) {
    const { userID, inboxID, notificationID, action } = payload;

    const existingEntry = await strapi.query('inbox').findOne({
      id: inboxID,
      notification: notificationID,
      users_permissions_user: userID,
    });

    if (!existingEntry) {
      throw strapi.errors.badRequest('inbox not found');
    }

    if (['delete', 'read'].indexOf(action) === -1) {
      throw strapi.errors.badRequest('action should be "read" or "delete"');
    }

    const now = new Date();
    let data;

    if (action === 'delete' && !existingEntry.deleted_at) {
      data = { deleted_at: now };
    } else if (action === 'read' && !existingEntry.read_at) {
      data = { read_at: now };
    }

    const result = data ? await strapi.query('inbox').update({
      id: existingEntry.id,
      users_permissions_user: userID,
    }, data) : existingEntry;

    return result;
  }
};
