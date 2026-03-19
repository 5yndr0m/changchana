'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

const { isDraft } = require('strapi-utils').contentTypes;
const _ = require('lodash');

module.exports = {
  /**
   * Promise to add/update the record
   *
   * @return {Promise}
   */

  async createOrUpdate(data, { files } = {}) {
    try {
      const results = await strapi.query('atk-management').find({ _limit: 1 });
      const entity = _.first(results) || null;

      let entry;
      if (!entity) {
        const validData = await strapi.entityValidator.validateEntityCreation(
          strapi.models['atk-management'],
          data,
          { isDraft: isDraft(data, strapi.models['atk-management']) }
        );
        entry = await strapi.query('atk-management').create(validData);
      } else {
        const validData = await strapi.entityValidator.validateEntityUpdate(
          strapi.models['atk-management'],
          data,
          { isDraft: isDraft(results, strapi.models['atk-management']) }
        );
        entry = await strapi.query('atk-management').update({ id: entity.id }, validData);
      }

      if (files) {
        // automatically uploads the files based on the entry and the model
        await strapi.entityService.uploadFiles(entry, files, {
          model: 'atk-management',
          // if you are using a plugin's model you will have to add the `plugin` key (plugin: 'users-permissions')
        });
        return this.findOne({ id: entry.id });
      }

      return entry;
    } catch (e) {
      if (e.message === 'Duplicate entry') {
        throw strapi.errors.badRequest(e.message);
      }

      throw e;
    }
  },
};
