'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */
const createdUserDeleted = async (userData) => {
  try {
    const { username, email, phone, id: user_id, deleted_by } = userData;
    await strapi.query('users-deleted').create({
      username,
      email,
      phone,
      user_id,
      created_by: deleted_by,
      updated_by: deleted_by,
    });
  } catch (error) {
    strapi.log.error('[Create user deleted] error:', error.message);
  }
}

module.exports = {
  createdUserDeleted
};
