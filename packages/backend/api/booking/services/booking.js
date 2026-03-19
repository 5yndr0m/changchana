'use strict';

const { sendPushNotification } = require('../../../api/helpers');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async bookingReminder() {
    try {
      let bookings = await strapi
        .query('booking')
        .find({
          date_eq: nowLocal.format('YYYY-MM-DD'),
          status_eq: "approved",
        }, []);

      let rawUsers = bookings.map((val) => val.user);
      let filterUsers = [...new Set(rawUsers)].map((val) => `${val}`);

      if (filterUsers.length) {
        strapi.log.info("[Booking][bookingReminder] Sending Notification!", filterUsers);
        sendPushNotification({
          content: `Don't forget your booking today!`,
          heading: 'Booking Reminder',
          external_ids: filterUsers,
        });
      } else {
        strapi.log.info("[Booking][bookingReminder] No booking matched today!");
      }
    } catch (e) {
      strapi.log.error(`[Booking][bookingReminder] error:`, e);
    }
  },
  async cleanBooking() {
    try {
      const bookings = await strapi
        .query('booking')
        .find({
          date_lt: nowLocal.format('YYYY-MM-DD'),
          status_in: ['waiting', 'pending'],
        });
      strapi.log.info(`[Booking][cleanBooking] Booking status waiting and pending ${bookings.length} total`);
      if (bookings.length) {
        await strapi
          .query('booking')
          .model
          .where('id', 'in', bookings.map(b => b.id))
          .save(
            { status: 'reject' },
            { method: 'update', patch: true }
          );

        strapi.log.info(`[Booking][cleanBooking] Booking changed to reject ${bookings.length} total`, bookings.map(b => b.id));
      }
    } catch (e) {
      strapi.log.error(`[Booking][cleanBooking] error:`, e);
    }
  },
};
