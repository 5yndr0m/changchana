'use strict'

const moment = require("moment-timezone")

const createLog = async ctx => {
  let today = moment().tz('Asia/Bangkok')
  let { userId, branch } = ctx.request.body

  if (userId) {
    let user = await strapi.query('user', 'users-permissions').findOne({ id: userId })

    if (user) {
      try {
        let response = await strapi.query('user-log').create({
          user: userId,
          branch,
          type: 'checked_in',
          datetime: today.toDate()
        })
        ctx.body = {
          data: response,
          date: today.toDate()
        }
      } catch (err) {
        console.log(err)
      }
    }
    else {
      ctx.status = 403
      ctx.body = {
        success: false,
        message: `user not found, unauthorized`
      }
    }
  }
  else {
    ctx.status = 500
    ctx.body = {
      success: false,
      message: 'no user id provided'
    }
  }
}

module.exports = {
  createLog
}