'use strict';

/**
 * Transfer Service
 * Handles wallet-to-wallet fund transfers
 */

const moment = require('moment');

module.exports = {
  /**
   * Get transfer settings from database
   * @returns {Promise<object>} Settings object
   */
  async getSettings() {
    const settings = await strapi.connections.default.raw(`
      SELECT setting_key, setting_value
      FROM wallet_transfer_settings
    `);

    const settingsMap = {};
    settings[0].forEach(row => {
      const value = row.setting_value;
      // Parse numeric values
      if (!isNaN(value)) {
        settingsMap[row.setting_key] = parseFloat(value);
      } else if (value === 'true' || value === 'false') {
        settingsMap[row.setting_key] = value === 'true';
      } else {
        settingsMap[row.setting_key] = value;
      }
    });

    return settingsMap;
  },

  /**
   * Update transfer settings
   * @param {object} updates - Settings to update
   * @returns {Promise<object>} Updated settings
   */
  async updateSettings(updates) {
    const allowedSettings = [
      'transfer_fee_percentage',
      'transfer_fee_fixed',
      'transfer_min_amount',
      'transfer_max_amount',
      'transfer_daily_limit',
    ];

    for (const key of Object.keys(updates)) {
      if (allowedSettings.includes(key)) {
        await strapi.connections.default.raw(`
          UPDATE wallet_transfer_settings
          SET setting_value = ?
          WHERE setting_key = ?
        `, [String(updates[key]), key]);
      }
    }

    return this.getSettings();
  },

  /**
   * Calculate transfer fee
   * @param {number} amount - Transfer amount
   * @returns {Promise<number>} Fee amount
   */
  async calculateFee(amount) {
    const settings = await this.getSettings();
    const percentageFee = (amount * settings.transfer_fee_percentage) / 100;
    const totalFee = percentageFee + settings.transfer_fee_fixed;
    return parseFloat(totalFee.toFixed(2));
  },

  /**
   * Check if user has exceeded daily transfer limit
   * @param {number} userId - User ID
   * @param {number} amount - Transfer amount to check
   * @returns {Promise<boolean>} True if within limit
   */
  async checkDailyLimit(userId, amount) {
    const settings = await this.getSettings();
    const today = moment().format('YYYY-MM-DD');

    const result = await strapi.connections.default.raw(`
      SELECT SUM(amount) as total
      FROM wallet_transfers
      WHERE sender_user_id = ?
      AND DATE(created_at) = ?
      AND status IN ('pending', 'completed')
    `, [userId, today]);

    const todayTotal = parseFloat(result[0][0]?.total || 0);
    return (todayTotal + amount) <= settings.transfer_daily_limit;
  },

  /**
   * Transfer funds between users
   * @param {number} senderUserId - Sender user ID
   * @param {number} receiverUserId - Receiver user ID
   * @param {number} amount - Amount to transfer
   * @param {string} description - Optional description
   * @returns {Promise<object>} Transfer result
   */
  async transferFunds(senderUserId, receiverUserId, amount, description = null) {
    const knex = strapi.connections.default;

    try {
      // Validate inputs
      if (senderUserId === receiverUserId) {
        throw new Error('Cannot transfer to yourself');
      }

      if (!amount || amount <= 0) {
        throw new Error('Invalid transfer amount');
      }

      // Get settings
      const settings = await this.getSettings();

      // Validate amount limits
      if (amount < settings.transfer_min_amount) {
        throw new Error(`Minimum transfer amount is ฿${settings.transfer_min_amount}`);
      }

      if (amount > settings.transfer_max_amount) {
        throw new Error(`Maximum transfer amount is ฿${settings.transfer_max_amount}`);
      }

      // Check daily limit
      const withinLimit = await this.checkDailyLimit(senderUserId, amount);
      if (!withinLimit) {
        throw new Error('Daily transfer limit exceeded');
      }

      // Calculate fee
      const fee = await this.calculateFee(amount);
      const totalDeduction = amount + fee;

      // Start transaction
      const trx = await knex.transaction();

      try {
        // Get sender wallet with lock
        const senderWallet = await trx.raw(`
          SELECT * FROM wallets WHERE user_id = ? FOR UPDATE
        `, [senderUserId]);

        if (!senderWallet[0][0]) {
          throw new Error('Sender wallet not found');
        }

        const sender = senderWallet[0][0];

        // Check sender balance
        if (parseFloat(sender.balance) < totalDeduction) {
          throw new Error('Insufficient balance');
        }

        // Check if sender wallet is frozen
        if (sender.status === 'frozen') {
          throw new Error('Sender wallet is frozen');
        }

        // Get receiver wallet with lock
        const receiverWallet = await trx.raw(`
          SELECT * FROM wallets WHERE user_id = ? FOR UPDATE
        `, [receiverUserId]);

        if (!receiverWallet[0][0]) {
          throw new Error('Receiver wallet not found');
        }

        const receiver = receiverWallet[0][0];

        // Check if receiver wallet is frozen
        if (receiver.status === 'frozen') {
          throw new Error('Receiver wallet is frozen');
        }

        // Generate IDs
        const transferId = await strapi.services.utils.generateTransferId();
        const senderTxId = await strapi.services.utils.generateTransactionId();
        const receiverTxId = await strapi.services.utils.generateTransactionId();

        const now = moment().format('YYYY-MM-DD HH:mm:ss');

        // Calculate new balances
        const senderBalanceBefore = parseFloat(sender.balance);
        const senderBalanceAfter = senderBalanceBefore - totalDeduction;
        const receiverBalanceBefore = parseFloat(receiver.balance);
        const receiverBalanceAfter = receiverBalanceBefore + amount;

        // Create transfer record
        await trx.raw(`
          INSERT INTO wallet_transfers (
            transfer_id, sender_user_id, receiver_user_id,
            amount, fee, sender_balance_before, sender_balance_after,
            receiver_balance_before, receiver_balance_after,
            status, description, sender_transaction_id, receiver_transaction_id,
            created_at, completed_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          transferId, senderUserId, receiverUserId,
          amount, fee, senderBalanceBefore, senderBalanceAfter,
          receiverBalanceBefore, receiverBalanceAfter,
          'completed', description, senderTxId, receiverTxId,
          now, now
        ]);

        // Create sender transaction (debit)
        await trx.raw(`
          INSERT INTO wallet_transactions (
            id, user_id, type, amount, balance_before, balance_after,
            status, description, metadata, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          senderTxId, senderUserId, 'transfer', -totalDeduction,
          senderBalanceBefore, senderBalanceAfter,
          'completed',
          `Transfer to user #${receiverUserId}${description ? ': ' + description : ''}${fee > 0 ? ' (Fee: ฿' + fee + ')' : ''}`,
          JSON.stringify({ transfer_id: transferId, receiver_user_id: receiverUserId, fee: fee }),
          now
        ]);

        // Create receiver transaction (credit)
        await trx.raw(`
          INSERT INTO wallet_transactions (
            id, user_id, type, amount, balance_before, balance_after,
            status, description, metadata, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          receiverTxId, receiverUserId, 'transfer', amount,
          receiverBalanceBefore, receiverBalanceAfter,
          'completed',
          `Transfer from user #${senderUserId}${description ? ': ' + description : ''}`,
          JSON.stringify({ transfer_id: transferId, sender_user_id: senderUserId }),
          now
        ]);

        // Update sender balance
        await trx.raw(`
          UPDATE wallets
          SET balance = ?, updated_at = ?
          WHERE user_id = ?
        `, [senderBalanceAfter, now, senderUserId]);

        // Update receiver balance
        await trx.raw(`
          UPDATE wallets
          SET balance = ?, updated_at = ?
          WHERE user_id = ?
        `, [receiverBalanceAfter, now, receiverUserId]);

        // Commit transaction
        await trx.commit();

        return {
          transferId,
          senderUserId,
          receiverUserId,
          amount,
          fee,
          netAmount: amount,
          totalDeduction,
          status: 'completed',
          senderTransactionId: senderTxId,
          receiverTransactionId: receiverTxId,
          createdAt: now,
          completedAt: now,
        };

      } catch (error) {
        await trx.rollback();
        throw error;
      }

    } catch (error) {
      strapi.log.error('[Transfer] transferFunds error:', error);
      throw error;
    }
  },

  /**
   * Get user transfers (sent and received)
   * @param {number} userId - User ID
   * @param {object} options - Query options (limit, offset)
   * @returns {Promise<object>} Transfer list and pagination
   */
  async getUserTransfers(userId, options = {}) {
    const limit = parseInt(options.limit) || 20;
    const offset = parseInt(options.offset) || 0;

    const transfers = await strapi.connections.default.raw(`
      SELECT
        t.*,
        sender.email as sender_email,
        sender.first_name as sender_first_name,
        sender.last_name as sender_last_name,
        receiver.email as receiver_email,
        receiver.first_name as receiver_first_name,
        receiver.last_name as receiver_last_name
      FROM wallet_transfers t
      LEFT JOIN \`users-permissions_user\` sender ON t.sender_user_id = sender.id
      LEFT JOIN \`users-permissions_user\` receiver ON t.receiver_user_id = receiver.id
      WHERE t.sender_user_id = ? OR t.receiver_user_id = ?
      ORDER BY t.created_at DESC
      LIMIT ? OFFSET ?
    `, [userId, userId, limit, offset]);

    const countResult = await strapi.connections.default.raw(`
      SELECT COUNT(*) as total
      FROM wallet_transfers
      WHERE sender_user_id = ? OR receiver_user_id = ?
    `, [userId, userId]);

    const total = countResult[0][0].total;

    const formattedTransfers = transfers[0].map(t => {
      const isSender = t.sender_user_id === userId;
      return {
        transferId: t.transfer_id,
        type: isSender ? 'sent' : 'received',
        amount: parseFloat(t.amount),
        fee: isSender ? parseFloat(t.fee) : 0,
        otherUser: isSender ? {
          id: t.receiver_user_id,
          email: t.receiver_email,
          name: `${t.receiver_first_name || ''} ${t.receiver_last_name || ''}`.trim()
        } : {
          id: t.sender_user_id,
          email: t.sender_email,
          name: `${t.sender_first_name || ''} ${t.sender_last_name || ''}`.trim()
        },
        status: t.status,
        description: t.description,
        createdAt: t.created_at,
        completedAt: t.completed_at,
      };
    });

    return {
      transfers: formattedTransfers,
      pagination: {
        total,
        limit,
        offset,
      },
    };
  },

  /**
   * Get all transfers (admin)
   * @param {object} filters - Filter options
   * @returns {Promise<object>} Transfer list and pagination
   */
  async getAllTransfers(filters = {}) {
    const limit = parseInt(filters.limit) || 50;
    const offset = parseInt(filters.offset) || 0;

    let whereConditions = [];
    let params = [];

    if (filters.status) {
      whereConditions.push('t.status = ?');
      params.push(filters.status);
    }

    if (filters.senderUserId) {
      whereConditions.push('t.sender_user_id = ?');
      params.push(filters.senderUserId);
    }

    if (filters.receiverUserId) {
      whereConditions.push('t.receiver_user_id = ?');
      params.push(filters.receiverUserId);
    }

    if (filters.fromDate) {
      whereConditions.push('DATE(t.created_at) >= ?');
      params.push(filters.fromDate);
    }

    if (filters.toDate) {
      whereConditions.push('DATE(t.created_at) <= ?');
      params.push(filters.toDate);
    }

    const whereClause = whereConditions.length > 0
      ? 'WHERE ' + whereConditions.join(' AND ')
      : '';

    const transfers = await strapi.connections.default.raw(`
      SELECT
        t.*,
        sender.email as sender_email,
        sender.first_name as sender_first_name,
        sender.last_name as sender_last_name,
        receiver.email as receiver_email,
        receiver.first_name as receiver_first_name,
        receiver.last_name as receiver_last_name
      FROM wallet_transfers t
      LEFT JOIN \`users-permissions_user\` sender ON t.sender_user_id = sender.id
      LEFT JOIN \`users-permissions_user\` receiver ON t.receiver_user_id = receiver.id
      ${whereClause}
      ORDER BY t.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    const countResult = await strapi.connections.default.raw(`
      SELECT COUNT(*) as total
      FROM wallet_transfers t
      ${whereClause}
    `, params);

    const total = countResult[0][0].total;

    const formattedTransfers = transfers[0].map(t => ({
      transferId: t.transfer_id,
      sender: {
        id: t.sender_user_id,
        email: t.sender_email,
        name: `${t.sender_first_name || ''} ${t.sender_last_name || ''}`.trim()
      },
      receiver: {
        id: t.receiver_user_id,
        email: t.receiver_email,
        name: `${t.receiver_first_name || ''} ${t.receiver_last_name || ''}`.trim()
      },
      amount: parseFloat(t.amount),
      fee: parseFloat(t.fee),
      status: t.status,
      description: t.description,
      createdAt: t.created_at,
      completedAt: t.completed_at,
      cancelledAt: t.cancelled_at,
      cancelledBy: t.cancelled_by,
      cancellationReason: t.cancellation_reason,
    }));

    return {
      transfers: formattedTransfers,
      pagination: {
        total,
        limit,
        offset,
      },
    };
  },

  /**
   * Cancel a transfer and refund
   * @param {string} transferId - Transfer ID
   * @param {number} adminUserId - Admin user ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<object>} Cancel result
   */
  async cancelTransfer(transferId, adminUserId, reason) {
    const knex = strapi.connections.default;

    try {
      const trx = await knex.transaction();

      try {
        // Get transfer with lock
        const transferResult = await trx.raw(`
          SELECT * FROM wallet_transfers WHERE transfer_id = ? FOR UPDATE
        `, [transferId]);

        if (!transferResult[0][0]) {
          throw new Error('Transfer not found');
        }

        const transfer = transferResult[0][0];

        // Can only cancel completed transfers
        if (transfer.status !== 'completed') {
          throw new Error('Can only cancel completed transfers');
        }

        // Get wallets with lock
        const senderWallet = await trx.raw(`
          SELECT * FROM wallets WHERE user_id = ? FOR UPDATE
        `, [transfer.sender_user_id]);

        const receiverWallet = await trx.raw(`
          SELECT * FROM wallets WHERE user_id = ? FOR UPDATE
        `, [transfer.receiver_user_id]);

        const sender = senderWallet[0][0];
        const receiver = receiverWallet[0][0];

        // Check if receiver has enough balance to refund
        const refundAmount = parseFloat(transfer.amount);
        if (parseFloat(receiver.balance) < refundAmount) {
          throw new Error('Receiver has insufficient balance for refund');
        }

        const now = moment().format('YYYY-MM-DD HH:mm:ss');

        // Generate refund transaction IDs
        const refundSenderTxId = await strapi.services.utils.generateTransactionId();
        const refundReceiverTxId = await strapi.services.utils.generateTransactionId();

        // Calculate balances
        const senderNewBalance = parseFloat(sender.balance) + refundAmount + parseFloat(transfer.fee);
        const receiverNewBalance = parseFloat(receiver.balance) - refundAmount;

        // Create refund transactions
        await trx.raw(`
          INSERT INTO wallet_transactions (
            id, user_id, type, amount, balance_before, balance_after,
            status, description, metadata, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          refundSenderTxId, transfer.sender_user_id, 'refund',
          refundAmount + parseFloat(transfer.fee),
          sender.balance, senderNewBalance,
          'completed',
          `Refund for transfer ${transferId}`,
          JSON.stringify({ transfer_id: transferId, cancelled_by: adminUserId, reason }),
          now
        ]);

        await trx.raw(`
          INSERT INTO wallet_transactions (
            id, user_id, type, amount, balance_before, balance_after,
            status, description, metadata, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          refundReceiverTxId, transfer.receiver_user_id, 'refund',
          -refundAmount,
          receiver.balance, receiverNewBalance,
          'completed',
          `Refund for transfer ${transferId}`,
          JSON.stringify({ transfer_id: transferId, cancelled_by: adminUserId, reason }),
          now
        ]);

        // Update wallets
        await trx.raw(`
          UPDATE wallets SET balance = ?, updated_at = ? WHERE user_id = ?
        `, [senderNewBalance, now, transfer.sender_user_id]);

        await trx.raw(`
          UPDATE wallets SET balance = ?, updated_at = ? WHERE user_id = ?
        `, [receiverNewBalance, now, transfer.receiver_user_id]);

        // Update transfer status
        await trx.raw(`
          UPDATE wallet_transfers
          SET status = ?, cancelled_at = ?, cancelled_by = ?, cancellation_reason = ?
          WHERE transfer_id = ?
        `, ['cancelled', now, adminUserId, reason, transferId]);

        await trx.commit();

        return {
          transferId,
          status: 'cancelled',
          refunded: true,
          message: 'Transfer cancelled and funds returned to sender',
        };

      } catch (error) {
        await trx.rollback();
        throw error;
      }

    } catch (error) {
      strapi.log.error('[Transfer] cancelTransfer error:', error);
      throw error;
    }
  },
};
