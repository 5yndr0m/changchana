'use strict';

const moment = require('moment');

/**
 * Wallet Utility Functions
 */

module.exports = {
  /**
   * Generate unique transaction ID
   * Format: TX-YYYYMMDD-XXXXX
   * @returns {Promise<string>} Transaction ID
   */
  async generateTransactionId() {
    const date = moment().format('YYYYMMDD');
    const prefix = `TX-${date}-`;

    // Get count of transactions created today
    const count = await strapi.connections.default.raw(`
      SELECT COUNT(*) as count
      FROM wallet_transactions
      WHERE id LIKE ?
    `, [`${prefix}%`]);

    const sequence = String((count[0][0].count || 0) + 1).padStart(5, '0');
    return `${prefix}${sequence}`;
  },

  /**
   * Generate unique voucher ID
   * Format: VC-XXXXX
   * @returns {Promise<string>} Voucher ID
   */
  async generateVoucherId() {
    const count = await strapi.connections.default.raw(`
      SELECT COUNT(*) as count FROM wallet_vouchers
    `);

    const sequence = String((count[0][0].count || 0) + 1).padStart(5, '0');
    return `VC-${sequence}`;
  },

  /**
   * Generate unique withdrawal ID
   * Format: WD-XXXXX
   * @returns {Promise<string>} Withdrawal ID
   */
  async generateWithdrawalId() {
    const count = await strapi.connections.default.raw(`
      SELECT COUNT(*) as count FROM wallet_withdrawals
    `);

    const sequence = String((count[0][0].count || 0) + 1).padStart(5, '0');
    return `WD-${sequence}`;
  },

  /**
   * Generate unique bank account ID
   * Format: BA-XXXXX
   * @returns {Promise<string>} Bank Account ID
   */
  async generateBankAccountId() {
    const count = await strapi.connections.default.raw(`
      SELECT COUNT(*) as count FROM user_bank_accounts
    `);

    const sequence = String((count[0][0].count || 0) + 1).padStart(5, '0');
    return `BA-${sequence}`;
  },

  /**
   * Generate unique transfer ID
   * Format: TRF-YYYYMMDD-XXXXX
   * @returns {Promise<string>} Transfer ID
   */
  async generateTransferId() {
    const date = moment().format('YYYYMMDD');
    const prefix = `TRF-${date}-`;

    const count = await strapi.connections.default.raw(`
      SELECT COUNT(*) as count
      FROM wallet_transfers
      WHERE transfer_id LIKE ?
    `, [`${prefix}%`]);

    const sequence = String((count[0][0].count || 0) + 1).padStart(5, '0');
    return `${prefix}${sequence}`;
  },

  /**
   * Generate unique redemption ID
   * Format: PTS-YYYYMMDD-XXXXX
   * @returns {Promise<string>} Redemption ID
   */
  async generateRedemptionId() {
    const date = moment().format('YYYYMMDD');
    const prefix = `PTS-${date}-`;

    const count = await strapi.connections.default.raw(`
      SELECT COUNT(*) as count
      FROM point_redemptions
      WHERE redemption_id LIKE ?
    `, [`${prefix}%`]);

    const sequence = String((count[0][0].count || 0) + 1).padStart(5, '0');
    return `${prefix}${sequence}`;
  },

  /**
   * Calculate payment processing fee
   * @param {number} amount - Transaction amount
   * @param {string} paymentMethod - Payment method (card, promptpay, etc.)
   * @returns {number} Fee amount
   */
  calculateFee(amount, paymentMethod) {
    const fees = {
      card: (amount) => amount * 0.03 + 2.00, // 3% + 2 THB
      promptpay: () => 0.00, // Free
      bank_transfer: () => 0.00, // Free
    };

    const feeCalculator = fees[paymentMethod] || (() => 0);
    return parseFloat(feeCalculator(amount).toFixed(2));
  },

  /**
   * Validate transaction amount
   * @param {number} amount - Amount to validate
   * @param {string} type - Transaction type
   * @returns {{valid: boolean, error: string|null}}
   */
  validateAmount(amount, type = 'top_up') {
    const limits = {
      top_up: { min: 50, max: 50000 },
      withdrawal: { min: 100, max: 10000 },
      payment: { min: 0.01, max: 999999 },
    };

    const limit = limits[type] || limits.payment;

    if (!amount || isNaN(amount) || amount <= 0) {
      return { valid: false, error: 'Invalid amount' };
    }

    if (amount < limit.min) {
      return { valid: false, error: `Minimum amount is ฿${limit.min}` };
    }

    if (amount > limit.max) {
      return { valid: false, error: `Maximum amount is ฿${limit.max}` };
    }

    return { valid: true, error: null };
  },

  /**
   * Get request metadata (IP, user agent)
   * @param {object} ctx - Koa context
   * @returns {object} Metadata object
   */
  getRequestMetadata(ctx) {
    return {
      ip_address: ctx.request.ip || ctx.request.header['x-forwarded-for'] || null,
      user_agent: ctx.request.header['user-agent'] || null,
    };
  },

  /**
   * Format error response
   * @param {string} code - Error code
   * @param {string} message - Error message
   * @returns {object} Error response
   */
  errorResponse(code, message) {
    const errors = {
      WALLET_001: 'Insufficient balance',
      WALLET_002: 'Wallet frozen',
      WALLET_003: 'Transaction limit exceeded',
      WALLET_004: 'Invalid amount',
      WALLET_005: 'Payment gateway error',
      WALLET_006: 'Duplicate transaction',
      WALLET_007: 'Voucher expired',
      WALLET_008: 'Voucher limit reached',
      WALLET_009: 'Bank account not verified',
      WALLET_010: 'Withdrawal limit exceeded',
    };

    return {
      success: false,
      error: {
        code: code,
        message: message || errors[code] || 'Unknown error',
      },
    };
  },

  /**
   * Format success response
   * @param {object} data - Response data
   * @returns {object} Success response
   */
  successResponse(data) {
    return {
      success: true,
      data: data,
    };
  },
};
