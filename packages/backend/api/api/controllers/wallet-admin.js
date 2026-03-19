'use strict';

/**
 * Wallet Admin Functions
 * Re-export wallet admin controller methods for use in the api routes
 */

const adminController = require('../../wallet/controllers/admin');

module.exports = {
  listWallets: adminController.listWallets,
  getWalletDetail: adminController.getWalletDetail,
  adjustBalance: adminController.adjustBalance,
  freezeWallet: adminController.freezeWallet,
  getAllTransactions: adminController.getAllTransactions,
  refundTransaction: adminController.refundTransaction,
  getReports: adminController.getReports,
  createVoucher: adminController.createVoucher,
  getAllTransfers: adminController.getAllTransfers,
  getAllPointRedemptions: adminController.getAllPointRedemptions,
  cancelTransfer: adminController.cancelTransfer,
  approvePointRedemption: adminController.approvePointRedemption,
  rejectPointRedemption: adminController.rejectPointRedemption,
  getTransferSettings: adminController.getTransferSettings,
  updateTransferSettings: adminController.updateTransferSettings,
};
