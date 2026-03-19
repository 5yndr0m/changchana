const { sanitizeEntity } = require('strapi-utils')

const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query('user', 'users-permissions').model
  })

module.exports = {
  async me(ctx) {
    const user = ctx.state.user

    if (!user) {
      return ctx.badRequest(null, [
        { messages: [{ id: 'No authorization header was found' }] }
      ])
    }

    const userQuery = await strapi.query('user', 'users-permissions')
    const userWithMedia = await userQuery.findOne({ id: ctx.state.user.id })
    const data = sanitizeUser(userWithMedia, { model: userQuery.model })
    ctx.send(data)
  },
  async destroy(ctx) {
    try {
      const { id: deleted_by } = ctx.state.user;
      const { id } = ctx.params;
      const data = await strapi.plugins['users-permissions'].services.user.remove({ id });

      if(data) {
        strapi.services['users-deleted'].createdUserDeleted({
          ...data,
          deleted_by,
        });
      }

      ctx.send(sanitizeUser(data));
    } catch (error) {
      strapi.log.error('[User deleted] error:', error.message);
    }
  },
}
