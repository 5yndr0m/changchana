'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const { sendPushNotification } = require('../../helpers')

module.exports = {
  lifecycles: {
    beforeUpdate: async (params, data) => {
      let { id } = params

      const previousData = await strapi.query('booking').findOne({ id })

      if (data.status && previousData.status !== data.status) {
        strapi.log.info(`[Booking][beforeUpdate] Booking ${id} change status ${previousData.status} => ${data.status}`);

        if (previousData.user) {
          let notificationData = {
            content: `Your booking status had been changed to ${data.status[0].toUpperCase() + data.status.slice(1)
              }`,
            heading: 'Booking status updated',
            external_ids: [`${previousData.user.id}`],
          }
          await sendPushNotification(notificationData)
        }
      }
    },
    afterUpdate: async (result, params, data) => {
      const { status } = data;
      if (status === "approved") {
        await strapi.query('booking').update({ id: params.id }, {
          approved_at: new Date(),
        });
      }
    }
  },
}
