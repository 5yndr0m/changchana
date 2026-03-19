'use strict';

const { sendPushNotification } = require('../../helpers')

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    // Called after an entry is created
    async afterCreate(result, data) {
      if (data.published_at && result.published_at && result.status === 'prepare') {
        strapi.log.info('[Notification] prepare to send message');
        const { sending_method: sendingMethod, cover_image } = result
        let sentResult = {
          status: 'completed',
          sent_count: 0,
        };

        await strapi.query('notification').update(
          { id: result.id },
          { status: 'sending' },
        );

        try {
          if (sendingMethod.indexOf('inbox') >= 0) {
            strapi.log.info('[Notification] start add message to inboxs');
            const { sentTotal } = await strapi.services.inbox.addNotification({ notificationID: result.id });
            sentResult.status = "completed";
            sentResult.sent_count = sentTotal;
          }

          if (sendingMethod.indexOf('push') >= 0) {
            strapi.log.info('[Notification] push notification to user');
            sendPushNotification({
              heading: result.title,
              content: result.short_description,
              additionalData: {
                notificationID: result.id,
                contentType: result.type,
                sendingMethod,
                coverImage: cover_image && cover_image.url || null,
                // NOTE: this fake id from notification, that application use this for generate as id of notification
                timestamp: Date.now(),
              }
            });
          }
        } catch (e) {
          console.log(e);
          strapi.log.error('[Notification] Error', e);
          sentResult.status = "falied";
        }

        await strapi.query('notification').update({ id: result.id }, sentResult);
        strapi.log.info('[Notification] end sending message');
      }
    },
    // Called after an entry is updated
    async afterUpdate(result, params, data) {
      if (data.published_at && result.published_at && result.status === 'prepare') {
        strapi.log.info('[Notification] prepare to send message');
        const { sending_method: sendingMethod, cover_image } = result;
        let sentResult = {
          status: 'completed',
          sent_count: 0,
        };

        await strapi.query('notification').update(
          { id: result.id },
          { status: 'sending' },
        );

        try {
          if (sendingMethod.indexOf('inbox') >= 0) {
            strapi.log.info('[Notification] start add message to inboxs');
            const { sentTotal } = await strapi.services.inbox.addNotification({ notificationID: result.id });
            strapi.log.info('[Notification] end add message to inboxs');
            sentResult.status = "completed";
            sentResult.sent_count = sentTotal;
          }

          if (sendingMethod.indexOf('push') >= 0) {
            strapi.log.info('[Notification] push notification to user');
            sendPushNotification({
              heading: result.title,
              content: result.short_description,
              additionalData: {
                notificationID: result.id,
                contentType: result.type,
                sendingMethod,
                coverImage: cover_image && cover_image.url || null,
                // NOTE: this fake id from notification, that application use this for generate as id of notification
                timestamp: Date.now(),
              }
            });
          }
        } catch (e) {
          strapi.log.error('[Notification] Error', e);
          sentResult.status = "falied";
        }

        await strapi.query('notification').update({ id: result.id }, sentResult);
        strapi.log.info('[Notification] end sending message');
      }
    },
  },
};
