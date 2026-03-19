'use strict';

const { isDraft } = require('strapi-utils').contentTypes;

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  /**
   * Promise to add record
   *
   * @return {Promise}
   */
   async create(data, { files } = {}) {
    const validData = await strapi.entityValidator.validateEntityCreation(
      strapi.models.notification,
      data,
      { isDraft: isDraft(data, strapi.models.notification) }
    );

    const entry = await strapi.query('notification').create(validData);

    if (files) {
      // automatically uploads the files based on the entry and the model
      await strapi.entityService.uploadFiles(entry, files, {
        model: 'notification',
        // if you are using a plugin's model you will have to add the `source` key (source: 'users-permissions')
      });
      return this.findOne({ id: entry.id });
    }

    return entry;
  },
  /**
   * Promise to edit record
   *
   * @return {Promise}
   */
  async update(params, data, { files } = {}) {
    const existingEntry = await strapi.query('notification').findOne(params);

    const validData = await strapi.entityValidator.validateEntityUpdate(
      strapi.models.notification,
      data,
      { isDraft: isDraft(existingEntry, strapi.models.notification) }
    );

    const entry = await strapi.query('notification').update(params, validData);

    if (files) {
      // automatically uploads the files based on the entry and the model
      await strapi.entityService.uploadFiles(entry, files, {
        model: 'notification',
        // if you are using a plugin's model you will have to add the `source` key (source: 'users-permissions')
      });
      return this.findOne({ id: entry.id });
    }

    return entry;
  },
};
