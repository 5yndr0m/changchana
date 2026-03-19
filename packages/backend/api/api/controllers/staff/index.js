'use strict'

const crypto = require('crypto')
const _ = require('lodash')
const grant = require('grant-koa')
const { sanitizeEntity } = require('strapi-utils')

const emailRegExp =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const formatError = (error) => [
  { messages: [{ id: error.id, message: error.message, field: error.field }] },
]

module.exports = {
  async staffSignin(ctx) {
    console.log('[staffSignin] Request received:', {
      body: ctx.request.body,
      provider: ctx.params.provider
    });

    const provider = ctx.params.provider || 'local'
    const params = ctx.request.body

    const store = await strapi.store({
      environment: '',
      type: 'plugin',
      name: 'users-permissions',
    })

    if (provider === 'local') {
      if (!_.get(await store.get({ key: 'grant' }), 'email.enabled')) {
        return ctx.badRequest(null, 'This provider is disabled.')
      }

      // The identifier is required.
      if (!params.identifier) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.email.provide',
            message: 'Please provide your username or your e-mail.',
          })
        )
      }

      // The password is required.
      if (!params.password) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.password.provide',
            message: 'Please provide your password.',
          })
        )
      }

      const query = { provider }

      // Check if the provided identifier is an email or not.
      const isEmail = emailRegExp.test(params.identifier)

      // Set the identifier to the appropriate query field.
      if (isEmail) {
        query.email = params.identifier.toLowerCase()
      } else {
        query.username = params.identifier
      }

      // Debug: Check what users exist with this email regardless of provider
      const allUsersWithEmail = await strapi
        .query('user', 'users-permissions')
        .find({ email: params.identifier.toLowerCase() })

      console.log('[staffSignin] All users with this email:', allUsersWithEmail.map(u => ({ id: u.id, email: u.email, provider: u.provider, role: u.role?.type })));

      // Check if the user exists.
      const user = await strapi
        .query('user', 'users-permissions')
        .findOne(query)

      console.log('[staffSignin] User found with query:', query);
      console.log('[staffSignin] User found:', user ? `User ID ${user.id}, role: ${user.role?.type}` : 'No user found');

      if (!user) {
        console.log('[staffSignin] Returning 400: User not found');
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.invalid',
            message: 'Identifier or password invalid.',
          })
        )
      }

      if (!user.role) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.invalid',
            message: 'Invalid role.',
          })
        )
      }

      if (!(['admin', 'staff', "staff_atk"].indexOf(user.role.type) >= 0)) {
        console.log('[staffSignin] Returning 400: User role type not allowed:', user.role.type);
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.invalid',
            message: 'Not a staff or admin.',
          })
        )
      }

      if (
        _.get(await store.get({ key: 'advanced' }), 'email_confirmation') &&
        user.confirmed !== true
      ) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.confirmed',
            message: 'Your account email is not confirmed',
          })
        )
      }

      if (user.blocked === true) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.blocked',
            message: 'Your account has been blocked by an administrator',
          })
        )
      }

      // The user never authenticated with the `local` provider.
      if (!user.password) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.password.local',
            message:
              'This user never set a local password, please login with the provider used during account creation.',
          })
        )
      }

      const validPassword = await strapi.plugins[
        'users-permissions'
      ].services.user.validatePassword(params.password, user.password)

      if (!validPassword) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.invalid',
            message: 'Identifier or password invalid.',
          })
        )
      } else {
        ctx.send({
          jwt: strapi.plugins['users-permissions'].services.jwt.issue({
            id: user.id,
          }),
          user: sanitizeEntity(user.toJSON ? user.toJSON() : user, {
            model: strapi.query('user', 'users-permissions').model,
          }),
        })
      }
    } else {
      if (!_.get(await store.get({ key: 'grant' }), [provider, 'enabled'])) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'provider.disabled',
            message: 'This provider is disabled.',
          })
        )
      }

      // Connect the user with the third-party provider.
      let user, error
      try {
        ;[user, error] = await strapi.plugins[
          'users-permissions'
        ].services.providers.connect(provider, ctx.query)
      } catch ([user, error]) {
        return ctx.badRequest(null, error === 'array' ? error[0] : error)
      }

      if (!user) {
        return ctx.badRequest(null, error === 'array' ? error[0] : error)
      }

      ctx.send({
        jwt: strapi.plugins['users-permissions'].services.jwt.issue({
          id: user.id,
        }),
        user: sanitizeEntity(user.toJSON ? user.toJSON() : user, {
          model: strapi.query('user', 'users-permissions').model,
        }),
      })
    }
  },
  async pointReduction(ctx) {
    console.log(ctx.request.body)
    let { userId, points, issueBy } = ctx.request.body

    if (points < 0) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "points should be more than or equal to 0",
      };
      return;
    }

    if (userId) {
      let user = await strapi
        .query('user', 'users-permissions')
        .findOne({ id: userId })

      if (user) {
        try {
          let newPoints

          if (user.points !== undefined && user.points !== null) {
            if ((user.points - points) < 0) {
              ctx.status = 406
              ctx.body = {
                success: false,
                message: `Not enough point`
              }
              return
            } else {
              newPoints = (user.points - points) < 0 ? 0 : user.points - points
            }
          } else {
            newPoints = 0
          }

          await strapi.query('user', 'users-permissions').update(
            { id: userId },
            {
              points: newPoints,
            }
          )

          await strapi.query('point-logs').create({
            amount: points * -1,
            issue_by: issueBy,
            target_user: userId,
          })

          ctx.body = {
            newPoints: newPoints,
            user: user
          }
        } catch (err) {
          console.log(err)
        }
      } else {
        ctx.status = 403
        ctx.body = {
          success: false,
          message: `user not found, unauthorized`,
        }
      }
    } else {
      ctx.status = 500
      ctx.body = {
        success: false,
        message: 'no user id provided',
      }
    }
  },
}
