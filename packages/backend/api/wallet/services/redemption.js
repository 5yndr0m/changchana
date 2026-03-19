'use strict';

/**
 * Redemption Service
 * Handles point-to-money redemptions
 */

const moment = require('moment');

module.exports = {
  /**
   * Get redemption settings from database
   * @returns {Promise<object>} Settings object
   */
  async getSettings() {
    const settings = await strapi.connections.default.raw(`
      SELECT setting_key, setting_value
      FROM wallet_transfer_settings
      WHERE setting_key IN (
        'point_conversion_rate',
        'point_min_redemption',
        'point_redemption_requires_approval'
      )
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
   * Update redemption settings
   * @param {object} updates - Settings to update
   * @returns {Promise<object>} Updated settings
   */
  async updateSettings(updates) {
    const allowedSettings = [
      'point_conversion_rate',
      'point_min_redemption',
      'point_redemption_requires_approval',
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
   * Get user's current points balance
   * @param {number} userId - User ID
   * @returns {Promise<number>} Points balance
   */
  async getUserPoints(userId) {
    try {
      const points = await strapi.connections.default.raw(`
        SELECT SUM(point) as total_points
        FROM point_log
        WHERE user_id = ?
      `, [userId]);
      return parseInt(points[0][0]?.total_points || 0);
    } catch (error) {
      // point_log table doesn't exist
      return 0;
    }
  },

  /**
   * Deduct points from user (creates negative point_log entry)
   * @param {number} userId - User ID
   * @param {number} points - Points to deduct
   * @param {string} description - Description
   * @returns {Promise<void>}
   */
  async deductPoints(userId, points, description) {
    try {
      const now = moment().format('YYYY-MM-DD HH:mm:ss');
      await strapi.connections.default.raw(`
        INSERT INTO point_log (user_id, point, description, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
      `, [userId, -points, description, now, now]);
    } catch (error) {
      strapi.log.error('[Redemption] Failed to deduct points:', error);
      throw new Error('Failed to deduct points');
    }
  },

  /**
   * Redeem points for wallet balance
   * @param {number} userId - User ID
   * @param {number} pointsToRedeem - Number of points to redeem
   * @param {string} description - Optional description
   * @returns {Promise<object>} Redemption result
   */
  async redeemPoints(userId, pointsToRedeem, description = null) {
    const knex = strapi.connections.default;

    try {
      // Validate inputs
      if (!pointsToRedeem || pointsToRedeem <= 0) {
        throw new Error('Invalid points amount');
      }

      // Get settings
      const settings = await this.getSettings();

      // Validate minimum redemption
      if (pointsToRedeem < settings.point_min_redemption) {
        throw new Error(`Minimum redemption is ${settings.point_min_redemption} points`);
      }

      // Get user's current points
      const currentPoints = await this.getUserPoints(userId);

      if (currentPoints < pointsToRedeem) {
        throw new Error('Insufficient points');
      }

      // Calculate money to receive (points / conversion_rate = money)
      // Example: 100 points with rate 1.0 = ฿100
      const moneyReceived = pointsToRedeem / settings.point_conversion_rate;

      // Start transaction
      const trx = await knex.transaction();

      try {
        // Get wallet with lock
        const walletResult = await trx.raw(`
          SELECT * FROM wallets WHERE user_id = ? FOR UPDATE
        `, [userId]);

        if (!walletResult[0][0]) {
          throw new Error('Wallet not found');
        }

        const wallet = walletResult[0][0];

        // Check if wallet is frozen
        if (wallet.status === 'frozen') {
          throw new Error('Wallet is frozen');
        }

        // Generate IDs
        const redemptionId = await strapi.services.utils.generateRedemptionId();
        const transactionId = await strapi.services.utils.generateTransactionId();

        const now = moment().format('YYYY-MM-DD HH:mm:ss');

        // Calculate new balances
        const walletBalanceBefore = parseFloat(wallet.balance);
        const walletBalanceAfter = walletBalanceBefore + moneyReceived;
        const pointsBalanceBefore = currentPoints;
        const pointsBalanceAfter = currentPoints - pointsToRedeem;

        // Determine initial status based on settings
        const requiresApproval = settings.point_redemption_requires_approval;
        const initialStatus = requiresApproval ? 'pending' : 'completed';
        const completedAt = requiresApproval ? null : now;

        // Create redemption record
        await trx.raw(`
          INSERT INTO point_redemptions (
            redemption_id, user_id, points_redeemed,
            points_balance_before, points_balance_after,
            money_received, conversion_rate,
            wallet_balance_before, wallet_balance_after,
            status, transaction_id, description, created_at, completed_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          redemptionId, userId, pointsToRedeem,
          pointsBalanceBefore, pointsBalanceAfter,
          moneyReceived, settings.point_conversion_rate,
          walletBalanceBefore, requiresApproval ? walletBalanceBefore : walletBalanceAfter,
          initialStatus, transactionId, description, now, completedAt
        ]);

        // If auto-approved, process immediately
        if (!requiresApproval) {
          // Create wallet transaction
          await trx.raw(`
            INSERT INTO wallet_transactions (
              id, user_id, type, amount, balance_before, balance_after,
              status, description, metadata, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            transactionId, userId, 'conversion', moneyReceived,
            walletBalanceBefore, walletBalanceAfter,
            'completed',
            `Points redemption: ${pointsToRedeem} points${description ? ' - ' + description : ''}`,
            JSON.stringify({ redemption_id: redemptionId, points_redeemed: pointsToRedeem }),
            now
          ]);

          // Update wallet balance
          await trx.raw(`
            UPDATE wallets
            SET balance = ?, updated_at = ?
            WHERE user_id = ?
          `, [walletBalanceAfter, now, userId]);

          // Deduct points
          await trx.raw(`
            INSERT INTO point_log (user_id, point, description, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)
          `, [userId, -pointsToRedeem, `Points redeemed: ${redemptionId}`, now, now]);
        }

        await trx.commit();

        return {
          redemptionId,
          pointsRedeemed: pointsToRedeem,
          moneyReceived,
          conversionRate: settings.point_conversion_rate,
          status: initialStatus,
          requiresApproval,
          newWalletBalance: requiresApproval ? walletBalanceBefore : walletBalanceAfter,
          newPointsBalance: requiresApproval ? pointsBalanceBefore : pointsBalanceAfter,
          createdAt: now,
          completedAt,
        };

      } catch (error) {
        await trx.rollback();
        throw error;
      }

    } catch (error) {
      strapi.log.error('[Redemption] redeemPoints error:', error);
      throw error;
    }
  },

  /**
   * Get user redemption history
   * @param {number} userId - User ID
   * @param {object} options - Query options
   * @returns {Promise<object>} Redemption list and pagination
   */
  async getUserRedemptions(userId, options = {}) {
    const limit = parseInt(options.limit) || 20;
    const offset = parseInt(options.offset) || 0;

    const redemptions = await strapi.connections.default.raw(`
      SELECT *
      FROM point_redemptions
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, [userId, limit, offset]);

    const countResult = await strapi.connections.default.raw(`
      SELECT COUNT(*) as total
      FROM point_redemptions
      WHERE user_id = ?
    `, [userId]);

    const total = countResult[0][0].total;

    const formattedRedemptions = redemptions[0].map(r => ({
      redemptionId: r.redemption_id,
      pointsRedeemed: r.points_redeemed,
      moneyReceived: parseFloat(r.money_received),
      conversionRate: parseFloat(r.conversion_rate),
      status: r.status,
      description: r.description,
      createdAt: r.created_at,
      completedAt: r.completed_at,
      approvedAt: r.approved_at,
      rejectedAt: r.rejected_at,
      rejectionReason: r.rejection_reason,
    }));

    return {
      redemptions: formattedRedemptions,
      pagination: {
        total,
        limit,
        offset,
      },
    };
  },

  /**
   * Get all redemptions (admin)
   * @param {object} filters - Filter options
   * @returns {Promise<object>} Redemption list and pagination
   */
  async getAllRedemptions(filters = {}) {
    const limit = parseInt(filters.limit) || 50;
    const offset = parseInt(filters.offset) || 0;

    let whereConditions = [];
    let params = [];

    if (filters.status) {
      whereConditions.push('r.status = ?');
      params.push(filters.status);
    }

    if (filters.userId) {
      whereConditions.push('r.user_id = ?');
      params.push(filters.userId);
    }

    if (filters.fromDate) {
      whereConditions.push('DATE(r.created_at) >= ?');
      params.push(filters.fromDate);
    }

    if (filters.toDate) {
      whereConditions.push('DATE(r.created_at) <= ?');
      params.push(filters.toDate);
    }

    const whereClause = whereConditions.length > 0
      ? 'WHERE ' + whereConditions.join(' AND ')
      : '';

    const redemptions = await strapi.connections.default.raw(`
      SELECT
        r.*,
        u.email,
        u.first_name as firstName,
        u.last_name as lastName
      FROM point_redemptions r
      LEFT JOIN \`users-permissions_user\` u ON r.user_id = u.id
      ${whereClause}
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    const countResult = await strapi.connections.default.raw(`
      SELECT COUNT(*) as total
      FROM point_redemptions r
      ${whereClause}
    `, params);

    const total = countResult[0][0].total;

    const formattedRedemptions = redemptions[0].map(r => ({
      redemptionId: r.redemption_id,
      user: {
        id: r.user_id,
        email: r.email,
        name: `${r.firstName || ''} ${r.lastName || ''}`.trim()
      },
      pointsRedeemed: r.points_redeemed,
      moneyReceived: parseFloat(r.money_received),
      conversionRate: parseFloat(r.conversion_rate),
      status: r.status,
      description: r.description,
      createdAt: r.created_at,
      completedAt: r.completed_at,
      approvedAt: r.approved_at,
      approvedBy: r.approved_by,
      rejectedAt: r.rejected_at,
      rejectedBy: r.rejected_by,
      rejectionReason: r.rejection_reason,
    }));

    return {
      redemptions: formattedRedemptions,
      pagination: {
        total,
        limit,
        offset,
      },
    };
  },

  /**
   * Approve point redemption (admin)
   * @param {string} redemptionId - Redemption ID
   * @param {number} adminUserId - Admin user ID
   * @returns {Promise<object>} Approval result
   */
  async approveRedemption(redemptionId, adminUserId) {
    const knex = strapi.connections.default;

    try {
      const trx = await knex.transaction();

      try {
        // Get redemption with lock
        const redemptionResult = await trx.raw(`
          SELECT * FROM point_redemptions WHERE redemption_id = ? FOR UPDATE
        `, [redemptionId]);

        if (!redemptionResult[0][0]) {
          throw new Error('Redemption not found');
        }

        const redemption = redemptionResult[0][0];

        if (redemption.status !== 'pending') {
          throw new Error('Can only approve pending redemptions');
        }

        // Get wallet with lock
        const walletResult = await trx.raw(`
          SELECT * FROM wallets WHERE user_id = ? FOR UPDATE
        `, [redemption.user_id]);

        const wallet = walletResult[0][0];

        if (!wallet) {
          throw new Error('Wallet not found');
        }

        if (wallet.status === 'frozen') {
          throw new Error('Wallet is frozen');
        }

        const now = moment().format('YYYY-MM-DD HH:mm:ss');

        // Calculate new wallet balance
        const walletBalanceBefore = parseFloat(wallet.balance);
        const walletBalanceAfter = walletBalanceBefore + parseFloat(redemption.money_received);

        // Create wallet transaction
        await trx.raw(`
          INSERT INTO wallet_transactions (
            id, user_id, type, amount, balance_before, balance_after,
            status, description, metadata, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          redemption.transaction_id, redemption.user_id, 'conversion',
          redemption.money_received, walletBalanceBefore, walletBalanceAfter,
          'completed',
          `Points redemption approved: ${redemption.points_redeemed} points`,
          JSON.stringify({ redemption_id: redemptionId, approved_by: adminUserId }),
          now
        ]);

        // Update wallet balance
        await trx.raw(`
          UPDATE wallets
          SET balance = ?, updated_at = ?
          WHERE user_id = ?
        `, [walletBalanceAfter, now, redemption.user_id]);

        // Deduct points
        await trx.raw(`
          INSERT INTO point_log (user_id, point, description, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?)
        `, [
          redemption.user_id,
          -redemption.points_redeemed,
          `Points redeemed (approved): ${redemptionId}`,
          now, now
        ]);

        // Update redemption status
        await trx.raw(`
          UPDATE point_redemptions
          SET status = ?, wallet_balance_after = ?, points_balance_after = ?,
              approved_at = ?, approved_by = ?, completed_at = ?
          WHERE redemption_id = ?
        `, [
          'completed',
          walletBalanceAfter,
          redemption.points_balance_before - redemption.points_redeemed,
          now, adminUserId, now, redemptionId
        ]);

        await trx.commit();

        return {
          redemptionId,
          status: 'completed',
          message: 'Point redemption approved and processed',
        };

      } catch (error) {
        await trx.rollback();
        throw error;
      }

    } catch (error) {
      strapi.log.error('[Redemption] approveRedemption error:', error);
      throw error;
    }
  },

  /**
   * Reject point redemption (admin)
   * @param {string} redemptionId - Redemption ID
   * @param {number} adminUserId - Admin user ID
   * @param {string} reason - Rejection reason
   * @returns {Promise<object>} Rejection result
   */
  async rejectRedemption(redemptionId, adminUserId, reason) {
    const knex = strapi.connections.default;

    try {
      const trx = await knex.transaction();

      try {
        // Get redemption with lock
        const redemptionResult = await trx.raw(`
          SELECT * FROM point_redemptions WHERE redemption_id = ? FOR UPDATE
        `, [redemptionId]);

        if (!redemptionResult[0][0]) {
          throw new Error('Redemption not found');
        }

        const redemption = redemptionResult[0][0];

        if (redemption.status !== 'pending') {
          throw new Error('Can only reject pending redemptions');
        }

        const now = moment().format('YYYY-MM-DD HH:mm:ss');

        // Update redemption status
        await trx.raw(`
          UPDATE point_redemptions
          SET status = ?, rejected_at = ?, rejected_by = ?, rejection_reason = ?
          WHERE redemption_id = ?
        `, ['rejected', now, adminUserId, reason, redemptionId]);

        await trx.commit();

        return {
          redemptionId,
          status: 'rejected',
          message: 'Point redemption rejected',
        };

      } catch (error) {
        await trx.rollback();
        throw error;
      }

    } catch (error) {
      strapi.log.error('[Redemption] rejectRedemption error:', error);
      throw error;
    }
  },
};
