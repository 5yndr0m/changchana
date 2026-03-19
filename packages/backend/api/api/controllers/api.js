'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
 const { sanitizeEntity } = require('strapi-utils');

const {
  signup,
  changePassword,
  changeProfileImage,
  generateQR,
  requestOTP,
  verifyOTP,
  checkUser,
  forgetPassword,
  checkOut,
  otpVerifyForgetPassword,
  deleteAccount,
} = require('./users')

const {
  createBooking,
  getBookings,
  cancelBooking,
  countBookings,
} = require('./bookings')

const { createLog } = require('./log')
const { staffSignin, pointReduction } = require('./staff')
const { confirmVaccinated, checkVaccinatedSubmitted } = require('./vaccinated')
const { exportCSV } = require('./csv')
const {
  listWallets,
  getWalletDetail,
  adjustBalance,
  freezeWallet,
  getAllTransactions,
  refundTransaction,
  getReports,
  createVoucher,
  getAllTransfers,
  getAllPointRedemptions,
  cancelTransfer,
  approvePointRedemption,
  rejectPointRedemption,
  getTransferSettings,
  updateTransferSettings,
} = require('./wallet-admin')
const {
  transferFunds,
  redeemPoints,
  getUserTransfers,
  getUserPointRedemptions,
  getWalletBalance,
  getWalletTransactions,
  createPaymentSource,
  checkPaymentStatus,
  handlePaymentWebhook,
  getPaymentMethods,
} = require('./wallet')

const appInit = async (ctx) => {
  const branches = await strapi.services.branch
    .find({ _publicationState: 'live' });
  const menus = await strapi.services.menu
    .find({ _publicationState: 'live' });
  const menuCategories = await strapi.services['menu-category']
    .find({ _publicationState: 'live' });
  const articles = await strapi.services.article
    .find({ _publicationState: 'live' });
  const appSettings = await strapi.services['app-settings']
    .find();

  ctx.body = {
    branches: branches.map(branch => sanitizeEntity(branch, { model: strapi.models.branch })),
    menus: menus.map(menu => sanitizeEntity(menu, { model: strapi.models.menu })),
    articles: articles.map(article => sanitizeEntity(article, { model: strapi.models.article })),
    menuCategories: menuCategories.map(mc => sanitizeEntity(mc, { model: strapi.models['menu-category'] })),
    settings: sanitizeEntity(appSettings, { model: strapi.models['app-settings'] }),
  };
}

const init = async (ctx) => {
  const websiteSettings = await strapi.services['website-settings']
    .find();

  ctx.body = {
    settings: sanitizeEntity(websiteSettings, { model: strapi.models['website-settings'] }),
  };
}

module.exports = {
  // Website
  init,
  // User Account
  signup,
  changePassword,
  changeProfileImage,
  generateQR,
  requestOTP,
  verifyOTP,
  checkOut,
  deleteAccount,
  // Application
  appInit,
  // Booking Related
  createBooking,
  getBookings,
  cancelBooking,
  createLog,
  staffSignin,
  checkUser,
  forgetPassword,
  countBookings,
  // Staff
  pointReduction,
  confirmVaccinated,
  checkVaccinatedSubmitted,
  // Exports
  exportCSV,
  otpVerifyForgetPassword,
  // Wallet User
  transferFunds,
  redeemPoints,
  getUserTransfers,
  getUserPointRedemptions,
  getWalletBalance,
  getWalletTransactions,
  createPaymentSource,
  checkPaymentStatus,
  handlePaymentWebhook,
  getPaymentMethods,
  // Wallet Admin
  listWallets,
  getWalletDetail,
  adjustBalance,
  freezeWallet,
  getAllTransactions,
  refundTransaction,
  getReports,
  createVoucher,
  getAllTransfers,
  getAllPointRedemptions,
  cancelTransfer,
  approvePointRedemption,
  rejectPointRedemption,
  getTransferSettings,
  updateTransferSettings,
}
