'use strict';

const moment = require('moment');
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async wrapTask(callback, { cron, key }) {
    // Check if task already exists to prevent duplicate key error
    let cronTask = await strapi.services['cron-tasks']
      .findOne({ transaction_key: key });

    if (!cronTask) {
      try {
        cronTask = await strapi.services['cron-tasks']
          .create({
            name: cron,
            transaction_key: key,
          });
      } catch (e) {
        // If duplicate key error, find the existing one
        if (e.message && e.message.includes('Duplicate entry')) {
          cronTask = await strapi.services['cron-tasks']
            .findOne({ transaction_key: key });
        } else {
          throw e;
        }
      }
    }

    let taskStatus = "completed";
    let message = "";
    try {
      await callback();
    } catch (e) {
      taskStatus = "failed";
      message = e.message;
    }

    if (cronTask && cronTask.id) {
      await strapi.services['cron-tasks']
        .update({ id: cronTask.id }, { status: taskStatus, message });
    }
  },
  async cleanHistory() {
    try {
      await strapi.services['cron-tasks']
        .delete({
          created_at_lte: moment(nowLocal).subtract(7, 'days').format('YYYY-MM-DD'),
        });
    } catch (e) {
      strapi.log.error(`[CronTasks][cleanHistory] error:`, e);
    }
  }
};
