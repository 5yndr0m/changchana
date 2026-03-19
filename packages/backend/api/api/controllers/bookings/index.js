'use strict'

const moment = require("moment-timezone")

const ctxError = (ctx, erorMesssage, code) => {
  ctx.status = code
  ctx.body = {
    success: false,
    message: erorMesssage,
  }
}

const createBooking = async (ctx) => {
  const userID = parseInt(ctx.state.user.id)
  const { date, branch, name, phone, people_amount } = ctx.request.body
  console.log(ctx.request.body)
  console.log(userID)
  // validate input
  const targetDate = moment(date).tz('Asia/Bangkok')
  if (!date) return ctxError(ctx, 'Please select booking date', 400)
  if (!targetDate.isValid()) return ctxError(ctx, 'Invalid booking date', 400)
  if (!branch) return ctxError(ctx, 'Please select a branch', 400)
  if (!name) return ctxError(ctx, 'Please enter name', 400)
  if (!phone) return ctxError(ctx, 'Please enter phone', 400)
  if (!people_amount) return ctxError(ctx, 'Please select amount of people', 400)

  const today = moment().tz('Asia/Bangkok')

  // Booking available before 3pm today 
  if (targetDate.isSame(today, 'date')) {
    if (today.hour() >= 15) return ctxError(ctx, 'Booking cannot be created after 3 p.m. There is walk-in table at on-site.', 400)
  } else {
    // Cann't booking in the past
    if (targetDate.isBefore(today)) return ctxError(ctx, 'cannot book days in the past', 400)
  }


  const checkFullyDate = await strapi.query('fully-booked').count({
    date: targetDate.toDate(),
    branch,
  });
  if (checkFullyDate > 0) {
    return ctxError(ctx, 'Creating a booking is not allowed, because this date are fully/event', 400);
  }

  // User can have only 5 pending booking
  const pendingCount = await strapi.query('booking').count({
    user: userID,
    status: 'pending',
  })
  if (pendingCount >= 5) return ctxError(ctx, 'booking with pending status limit exceed', 400)

  // 1 Booking / date
  let existedCount = await strapi.query('booking').findOne({
    user: userID,
    date: targetDate.toDate(),
    status_in: ['pending', 'approved', 'waiting', 'reject'],
  })
  if (existedCount) return ctxError(ctx, 'cannot book more than once in a day', 400)

  // Create Booking
  try {
    let bookingResponse = await strapi.query('booking').create({
      user: userID,
      name,
      phone,
      branch,
      date,
      people_amount,
      status: 'pending',
    })
    ctx.body = bookingResponse
  } catch (err) {
    console.log('[Error] createBooking', err)
    return ctxError(ctx, 'Failed to create booking', 500)
  }
}

const getBookings = async (ctx) => {
  const userID = parseInt(ctx.state.user.id)
  const today = moment().tz('Asia/Bangkok')

  try {
    const bookingData = await strapi.query('booking').find({
      user: userID,
    })

    let pastBookings = bookingData.filter((val) => {
      return moment(val.date, 'YYYY-MM-DD').isBefore(today, 'date')
    })

    let bookings = bookingData.filter((val) => {
      return moment(val.date, 'YYYY-MM-DD').isSameOrAfter(today, 'date')
    })

    ctx.body = {
      pastBookings,
      bookings,
    }
  } catch (err) {
    console.log('[Error] getBookings', err)
    return ctxError(ctx, 'Failed to load bookings', 500)
  }
}

const cancelBooking = async (ctx) => {
  const userID = parseInt(ctx.state.user.id)
  const { id: bookingId } = ctx.request.query

  if (!bookingId) return ctxError(ctx, 'no booking id provided', 400)

  const booking = await strapi.query('booking').findOne({
    id: bookingId,
    user: userID,
  })
  if (!booking) return ctxError(ctx, 'this booking is not exists', 400)

  if (booking.status === 'reject'
    || booking.status === 'cancelled') return ctxError(ctx, 'this booking already cancelled or rejected', 400)

  try {
    await strapi.query('booking').update(
      { id: bookingId },
      {
        status: 'cancelled',
      }
    )
    ctx.body = {
      success: true,
      message: `cancel booking #${bookingId} successfully`,
    }
  } catch (err) {
    console.log('[Error] cancelBooking', err)
    return ctxError(ctx, 'Failed to cancel bookings', 500)
  }

}

const countBookings = async (ctx) => {
  let { date, branch } = ctx.request.query

  let approved = await strapi
    .query('booking')
    .find({ _limit: -1, status: 'approved', date: date, ...(branch ? { branch } : {}) })
  let approvedAmount = approved.length
    ? approved.length > 1
      ? approved.map(val => val.people_amount ? val.people_amount : 0).reduce((a, b) => a + b)
      : approved[0].people_amount
    : 0

  let reject = await strapi
    .query('booking')
    .find({ _limit: -1, status: 'reject', date: date, ...(branch ? { branch } : {}) })
  let rejectAmount = reject.length
    ? reject.length > 1
      ? reject.map(val => val.people_amount ? val.people_amount : 0).reduce((a, b) => a + b)
      : reject[0].people_amount
    : 0

  console.log(rejectAmount)

  // console.log('rejectAmount', reject, rejectAmount, reject ? reject : 0)

  let pending = await strapi
    .query('booking')
    .find({ _limit: -1, status: 'pending', date: date, ...(branch ? { branch } : {}) })
  let pendingAmount = pending.length
    ? pending.length > 1
      ? pending.map(val => val.people_amount ? val.people_amount : 0).reduce((a, b) => a + b)
      : pending[0].people_amount
    : 0

  let cancelled = await strapi
    .query('booking')
    .find({ _limit: -1, status: 'cancelled', date: date, ...(branch ? { branch } : {}) })
  let cancelledAmount = cancelled.length
    ? cancelled.length > 1
      ? cancelled.map(val => val.people_amount ? val.people_amount : 0).reduce((a, b) => a + b)
      : cancelled[0].people_amount
    : 0

  ctx.body = {
    approved: {
      count: approved.length,
      amount: approvedAmount,
    },
    reject: {
      count: reject.length,
      amount: rejectAmount,
    },
    pending: {
      count: pending.length,
      amount: pendingAmount,
    },
    cancelled: {
      count: cancelled.length,
      amount: cancelledAmount,
    },
  }
}

module.exports = {
  createBooking,
  getBookings,
  cancelBooking,
  countBookings,
}
