'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const { slugify, sendPushNotification } = require('../../helpers')

module.exports = {
  lifecycles: {
    beforeCreate(data) {
      if (Object.keys(data).length > 0) {
        if (data.title) {
          data.slug = slugify(data.title)
        } else {
          data.slug = new Date().getTime()
        }
      }
    },
    afterCreate: async (result, data) => {
      if (result.published_at) {
        console.log('New article published! Sending push notification')

        let specialUsers = await strapi
          .query('user', 'users-permissions')
          .find({ special: true, _limit: -1 })
        sendPushNotification({
          content: 'Check it out in the application',
          heading: 'New article published!',
          ...(result.special
            ? { external_ids: specialUsers.map((val) => `${val.id}`) }
            : {}),
        })
      }
    },
    beforeUpdate(params, data) {
      if (Object.keys(data).length > 0) {
        if (data.title) {
          data.slug = slugify(data.title)
        }
      }
    },
    afterUpdate: async (result, params, data) => {
      let { id } = params
      let previousData = await strapi.query('article').findOne({ id })
      if (data.published_at) {
        if (previousData.published_at !== data.published_at) {
          console.log('New article published! Sending push notification')

          let specialUsers = await strapi
            .query('user', 'users-permissions')
            .find({ special: true, _limit: -1 })
          sendPushNotification({
            content: 'Check it out in the application',
            heading: 'New article published!',
            ...(result.special
              ? { external_ids: specialUsers.map((val) => `${val.id}`) }
              : {}),
          })
        }
      }
    },
  },
}
