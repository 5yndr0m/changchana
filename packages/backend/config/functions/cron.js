'use strict'

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#cron-tasks
 */

const moment = require('moment');

module.exports = {
  '30 10 * * *': {
    task: async () => {
      strapi.services["cron-tasks"].wrapTask(async () => {
        // Task: Booking Reminder
        strapi.log.info(`[Task][bookingReminder] Checking booking for ${moment().utcOffset('+0700').format('YYYY-MM-DD')}`);
        await strapi.services.booking.bookingReminder()
      }, {
        cron: "30 10 * * *",
        key: `every-10:30-${moment().utcOffset('+0700').format('YYYYMMDDHHmm')}`,
      });
    },
    options: {
      tz: 'Asia/Bangkok',
    },
  },
  '0 0 * * *': {
    task: async () => {
      strapi.services["cron-tasks"].wrapTask(async () => {
        // Task: CleanBooking - update status old booking to reject
        strapi.log.info('[Task][cleanBooking] Running task update old booking to reject');
        strapi.services.booking.cleanBooking();

        // Task: Clean History CronTasks
        strapi.log.info('[Task][cleanCronTask] Running task clean history cron tasks');
        strapi.services["cron-tasks"].cleanHistory();
      }, {
        cron: "0 0 * * *",
        key: `every-00:00-${moment().utcOffset('+0700').format('YYYYMMDDHHmm')}`,
      });
    },
    options: {
      tz: 'Asia/Bangkok',
    }
  },
  "*/3 * * * *": {
    task: async () => {
      strapi.services["cron-tasks"].wrapTask(async () => {
        // Task: ResolvePaymentPending - query payment pending to check status with omise
        strapi.log.info('[Task][resolvePaymentPending] Running task resolve payment pending');
        await strapi.services["event-transaction"].resolvePaymentPending();
      }, {
        cron: "*/3 * * * *",
        key: `every-3-min-${moment().utcOffset('+0700').format('YYYYMMDDHHmm')}`,
      });
    },
    options: {
      tz: 'Asia/Bangkok',
    }
  },
}
