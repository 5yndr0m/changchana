'use strict';

const moment = require('moment');
const utils = require('./utils');

/**
 * Wallet Service
 * Core wallet operations and balance management
 */

module.exports = {
  /**
   * Get or create user wallet
   * @param {number} userId - User ID
   * @returns {Promise<object>} Wallet object
   */
  async getOrCreateWallet(userId) {
    const wallet = await strapi.connections.default.raw(`
      SELECT * FROM wallets WHERE user_id = ? LIMIT 1
    `, [userId]);

    if (wallet[0].length > 0) {
      return wallet[0][0];
    }

    // Create wallet if doesn't exist
    await strapi.connections.default.raw(`
      INSERT INTO wallets (user_id, balance, status, created_at)
      VALUES (?, 0.00, 'active', NOW())
    `, [userId]);

    const newWallet = await strapi.connections.default.raw(`
      SELECT * FROM wallets WHERE user_id = ? LIMIT 1
    `, [userId]);

    return newWallet[0][0];
  },

  /**
   * Get wallet balance
   * @param {number} userId - User ID
   * @returns {Promise<object>} Balance information
   */
  async getBalance(userId) {
    const wallet = await this.getOrCreateWallet(userId);

    // Get user points (optional - table may not exist)
    let totalPoints = 0;
    try {
      const points = await strapi.connections.default.raw(`
        SELECT SUM(point) as total_points
        FROM point_log
        WHERE user_id = ?
      `, [userId]);
      totalPoints = points[0][0]?.total_points || 0;
    } catch (error) {
      // point_log table doesn't exist - use 0 points
      strapi.log.debug('[Wallet] point_log table not found, defaulting to 0 points');
    }

    // Get last transaction
    const lastTrans = await strapi.connections.default.raw(`
      SELECT created_at
      FROM wallet_transactions
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `, [userId]);

    return {
      userId: wallet.user_id,
      balance: parseFloat(wallet.balance),
      pendingBalance: parseFloat(wallet.pending_balance),
      frozenBalance: parseFloat(wallet.frozen_balance),
      totalBalance: parseFloat(wallet.balance) + parseFloat(wallet.pending_balance) + parseFloat(wallet.frozen_balance),
      currency: 'THB',
      status: wallet.status,
      points: totalPoints,
      lastTransaction: lastTrans[0][0]?.created_at || null,
    };
  },

  /**
   * Create wallet transaction with database transaction for atomicity
   * @param {object} transactionData - Transaction data
   * @returns {Promise<object>} Created transaction
   */
  async createTransaction(transactionData) {
    const {
      userId,
      type,
      amount,
      paymentMethod = null,
      paymentTransactionId = null,
      referenceType = null,
      referenceId = null,
      description = null,
      fee = 0,
      adminId = null,
      adminReason = null,
      metadata = null,
      ipAddress = null,
      userAgent = null,
    } = transactionData;

    // Start database transaction
    const knex = strapi.connections.default;
    const trx = await knex.transaction();

    try {
      // Lock wallet row for update
      const wallet = await trx.raw(`
        SELECT * FROM wallets WHERE user_id = ? FOR UPDATE
      `, [userId]);

      if (wallet[0].length === 0) {
        throw new Error('Wallet not found');
      }

      const currentWallet = wallet[0][0];

      // Check if wallet is frozen
      if (currentWallet.status === 'frozen' || currentWallet.status === 'suspended') {
        throw new Error('WALLET_002');
      }

      const currentBalance = parseFloat(currentWallet.balance);
      const transactionAmount = parseFloat(amount);
      const netAmount = transactionAmount - parseFloat(fee);

      // Calculate new balance based on transaction type
      let newBalance = currentBalance;

      if (['top_up', 'refund', 'bonus', 'conversion'].includes(type)) {
        newBalance = currentBalance + netAmount;
      } else if (['payment', 'withdrawal', 'adjustment'].includes(type)) {
        if (type === 'adjustment' && transactionAmount < 0) {
          // Negative adjustment (deduction)
          newBalance = currentBalance + transactionAmount; // amount is already negative
        } else if (type === 'payment' || type === 'withdrawal') {
          // Check sufficient balance
          if (currentBalance < transactionAmount) {
            throw new Error('WALLET_001');
          }
          newBalance = currentBalance - transactionAmount;
        } else if (type === 'adjustment' && transactionAmount > 0) {
          // Positive adjustment (addition)
          newBalance = currentBalance + transactionAmount;
        }
      }

      // Generate transaction ID
      const transactionId = await utils.generateTransactionId();

      // Create transaction record
      await trx.raw(`
        INSERT INTO wallet_transactions (
          id, user_id, type, amount, balance_before, balance_after,
          status, payment_method, payment_transaction_id,
          reference_type, reference_id, description, fee, net_amount,
          admin_id, admin_reason, metadata, ip_address, user_agent,
          created_at, completed_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        transactionId,
        userId,
        type,
        transactionAmount,
        currentBalance,
        newBalance,
        'completed',
        paymentMethod,
        paymentTransactionId,
        referenceType,
        referenceId,
        description,
        fee,
        netAmount,
        adminId,
        adminReason,
        metadata ? JSON.stringify(metadata) : null,
        ipAddress,
        userAgent,
      ]);

      // Update wallet balance
      await trx.raw(`
        UPDATE wallets
        SET balance = ?, updated_at = NOW()
        WHERE user_id = ?
      `, [newBalance, userId]);

      // Create audit log
      await trx.raw(`
        INSERT INTO wallet_audit_logs (
          wallet_id, transaction_id, action, actor_id, actor_type,
          balance_before, balance_after, changes, ip_address, user_agent, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `, [
        currentWallet.id,
        transactionId,
        type,
        adminId || userId,
        adminId ? 'admin' : 'user',
        currentBalance,
        newBalance,
        JSON.stringify({ type, amount: transactionAmount, fee, netAmount }),
        ipAddress,
        userAgent,
      ]);

      // Commit transaction
      await trx.commit();

      // Fetch and return created transaction
      const result = await strapi.connections.default.raw(`
        SELECT * FROM wallet_transactions WHERE id = ?
      `, [transactionId]);

      return result[0][0];
    } catch (error) {
      // Rollback on error
      await trx.rollback();
      throw error;
    }
  },

  /**
   * Get user transactions
   * @param {object} params - Query parameters
   * @returns {Promise<object>} Transactions and pagination
   */
  async getTransactions(params) {
    const {
      userId,
      limit = 20,
      offset = 0,
      type = null,
      status = null,
      fromDate = null,
      toDate = null,
    } = params;

    let query = `
      SELECT * FROM wallet_transactions
      WHERE user_id = ?
    `;
    const queryParams = [userId];

    if (type) {
      query += ` AND type = ?`;
      queryParams.push(type);
    }

    if (status) {
      query += ` AND status = ?`;
      queryParams.push(status);
    }

    if (fromDate) {
      query += ` AND created_at >= ?`;
      queryParams.push(fromDate);
    }

    if (toDate) {
      query += ` AND created_at <= ?`;
      queryParams.push(toDate);
    }

    // Get total count
    const countQuery = query.replace('*', 'COUNT(*) as total');
    const countResult = await strapi.connections.default.raw(countQuery, queryParams);
    const total = countResult[0][0].total;

    // Get transactions with pagination
    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit), parseInt(offset));

    const transactions = await strapi.connections.default.raw(query, queryParams);

    return {
      transactions: transactions[0].map(t => ({
        id: t.id,
        type: t.type,
        amount: parseFloat(t.amount),
        balanceBefore: parseFloat(t.balance_before),
        balanceAfter: parseFloat(t.balance_after),
        status: t.status,
        paymentMethod: t.payment_method,
        referenceId: t.reference_id,
        description: t.description,
        createdAt: t.created_at,
        completedAt: t.completed_at,
      })),
      pagination: {
        total: total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + parseInt(limit)) < total,
      },
    };
  },

  /**
   * Freeze or unfreeze wallet
   * @param {number} userId - User ID
   * @param {object} freezeData - Freeze data
   * @returns {Promise<object>} Updated wallet
   */
  async freezeWallet(userId, freezeData) {
    const {
      action, // 'freeze' or 'unfreeze'
      reason,
      adminId,
      autoUnfreezeAt = null,
    } = freezeData;

    const wallet = await this.getOrCreateWallet(userId);

    if (action === 'freeze') {
      await strapi.connections.default.raw(`
        UPDATE wallets
        SET status = 'frozen',
            frozen_reason = ?,
            frozen_by = ?,
            frozen_at = NOW(),
            auto_unfreeze_at = ?,
            updated_at = NOW()
        WHERE user_id = ?
      `, [reason, adminId, autoUnfreezeAt, userId]);

      return {
        userId: userId,
        status: 'frozen',
        frozenBy: { adminId: adminId },
        reason: reason,
        frozenAt: moment().format(),
        autoUnfreezeAt: autoUnfreezeAt,
      };
    } else {
      await strapi.connections.default.raw(`
        UPDATE wallets
        SET status = 'active',
            frozen_reason = NULL,
            frozen_by = NULL,
            frozen_at = NULL,
            auto_unfreeze_at = NULL,
            updated_at = NOW()
        WHERE user_id = ?
      `, [userId]);

      return {
        userId: userId,
        status: 'active',
        unfrozenBy: { adminId: adminId },
        unfrozenAt: moment().format(),
      };
    }
  },

  /**
   * Adjust wallet balance manually (admin only)
   * @param {object} adjustmentData - Adjustment data
   * @returns {Promise<object>} Created transaction
   */
  async adjustBalance(adjustmentData) {
    const {
      userId,
      amount,
      type, // 'credit' or 'debit'
      reason,
      adminId,
      ipAddress,
      userAgent,
    } = adjustmentData;

    const adjustmentAmount = type === 'credit' ? Math.abs(amount) : -Math.abs(amount);

    return await this.createTransaction({
      userId,
      type: 'adjustment',
      amount: adjustmentAmount,
      description: reason,
      adminId,
      adminReason: reason,
      ipAddress,
      userAgent,
    });
  },

  /**
   * Redeem voucher code
   * @param {object} redemptionData - Redemption data
   * @returns {Promise<object>} Created transaction
   */
  async redeemVoucher(redemptionData) {
    const { userId, code, ipAddress, userAgent } = redemptionData;

    const knex = strapi.connections.default;
    const trx = await knex.transaction();

    try {
      // Get voucher with lock
      const voucher = await trx.raw(`
        SELECT * FROM wallet_vouchers
        WHERE code = ? AND status = 'active'
        FOR UPDATE
      `, [code]);

      if (voucher[0].length === 0) {
        throw new Error('WALLET_007');
      }

      const voucherData = voucher[0][0];
      const now = moment();

      // Check validity period
      if (now.isBefore(voucherData.valid_from) || now.isAfter(voucherData.valid_until)) {
        throw new Error('WALLET_007');
      }

      // Check max redemptions
      if (voucherData.max_redemptions && voucherData.used_count >= voucherData.max_redemptions) {
        throw new Error('WALLET_008');
      }

      // Check per-user limit
      const userRedemptions = await trx.raw(`
        SELECT COUNT(*) as count
        FROM wallet_voucher_redemptions
        WHERE voucher_id = ? AND user_id = ?
      `, [voucherData.id, userId]);

      if (userRedemptions[0][0].count >= voucherData.per_user_limit) {
        throw new Error('WALLET_008');
      }

      await trx.commit();

      // Create transaction for voucher redemption
      const transaction = await this.createTransaction({
        userId,
        type: 'bonus',
        amount: parseFloat(voucherData.amount),
        description: `Voucher: ${voucherData.description || voucherData.code}`,
        referenceType: 'voucher',
        referenceId: voucherData.id,
        ipAddress,
        userAgent,
      });

      // Record redemption
      await strapi.connections.default.raw(`
        INSERT INTO wallet_voucher_redemptions (voucher_id, user_id, transaction_id, amount, redeemed_at)
        VALUES (?, ?, ?, ?, NOW())
      `, [voucherData.id, userId, transaction.id, voucherData.amount]);

      // Update voucher used count
      await strapi.connections.default.raw(`
        UPDATE wallet_vouchers
        SET used_count = used_count + 1, updated_at = NOW()
        WHERE id = ?
      `, [voucherData.id]);

      return transaction;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  },
};
