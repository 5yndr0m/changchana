'use strict';

const walletService = require('../services/wallet');
const utils = require('../services/utils');

/**
 * Wallet Admin Controller
 * Admin-facing wallet management endpoints
 */

module.exports = {
  /**
   * GET /api/admin/wallets
   * List all user wallets with filters
   */
  async listWallets(ctx) {
    try {
      const {
        limit = 50,
        offset = 0,
        search,
        minBalance,
        maxBalance,
        status,
        sortBy = 'created_at',
        sortOrder = 'desc',
      } = ctx.query;

      let query = `
        SELECT
          w.*,
          u.email,
          u.first_name as firstName,
          u.last_name as lastName,
          u.phone,
          (SELECT COUNT(*) FROM wallet_transactions WHERE user_id = w.user_id) as total_transactions,
          (SELECT SUM(amount) FROM wallet_transactions WHERE user_id = w.user_id AND type IN ('top_up', 'bonus', 'refund', 'conversion')) as lifetime_deposits,
          (SELECT SUM(amount) FROM wallet_transactions WHERE user_id = w.user_id AND type IN ('payment', 'withdrawal')) as lifetime_spending,
          (SELECT created_at FROM wallet_transactions WHERE user_id = w.user_id ORDER BY created_at DESC LIMIT 1) as last_transaction
        FROM wallets w
        LEFT JOIN \`users-permissions_user\` u ON w.user_id = u.id
        WHERE 1=1
      `;
      const params = [];

      if (search) {
        query += ` AND (u.email LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ? OR u.phone LIKE ?)`;
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm);
      }

      if (minBalance) {
        query += ` AND w.balance >= ?`;
        params.push(minBalance);
      }

      if (maxBalance) {
        query += ` AND w.balance <= ?`;
        params.push(maxBalance);
      }

      if (status) {
        query += ` AND w.status = ?`;
        params.push(status);
      }

      // Get total count
      const countQuery = `SELECT COUNT(*) as total FROM wallets w LEFT JOIN \`users-permissions_user\` u ON w.user_id = u.id WHERE 1=1` +
        (search ? ` AND (u.email LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ? OR u.phone LIKE ?)` : '') +
        (minBalance ? ` AND w.balance >= ${minBalance}` : '') +
        (maxBalance ? ` AND w.balance <= ${maxBalance}` : '') +
        (status ? ` AND w.status = '${status}'` : '');

      const countResult = await strapi.connections.default.raw(countQuery, search ? [
        `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`
      ] : []);
      const total = countResult[0][0].total;

      // Add sorting and pagination
      const validSortBy = ['balance', 'last_transaction', 'created_at', 'user_id'];
      const sortColumn = validSortBy.includes(sortBy) ? sortBy : 'created_at';
      query += ` ORDER BY ${sortColumn} ${sortOrder === 'asc' ? 'ASC' : 'DESC'} LIMIT ? OFFSET ?`;
      params.push(parseInt(limit), parseInt(offset));

      const wallets = await strapi.connections.default.raw(query, params);

      strapi.log.info(`[WalletAdmin] Raw query returned ${wallets[0].length} rows`);
      strapi.log.info(`[WalletAdmin] First wallet:`, JSON.stringify(wallets[0][0]));

      const responseData = {
        wallets: wallets[0].map(w => ({
          userId: w.user_id,
          user: {
            firstName: w.firstName,
            lastName: w.lastName,
            email: w.email,
            phone: w.phone,
          },
          balance: parseFloat(w.balance),
          pendingBalance: parseFloat(w.pending_balance),
          frozenBalance: parseFloat(w.frozen_balance),
          status: w.status,
          totalTransactions: w.total_transactions,
          lifetimeDeposits: parseFloat(w.lifetime_deposits) || 0,
          lifetimeSpending: parseFloat(w.lifetime_spending) || 0,
          lastTransaction: w.last_transaction,
          createdAt: w.created_at,
        })),
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: (parseInt(offset) + parseInt(limit)) < total,
        },
      };

      strapi.log.info(`[WalletAdmin] Returning ${responseData.wallets.length} wallets`);
      ctx.send(utils.successResponse(responseData));
    } catch (error) {
      strapi.log.error('[WalletAdmin] listWallets error:', error);
      ctx.badRequest(utils.errorResponse('WALLET_ERROR', error.message));
    }
  },

  /**
   * GET /api/admin/wallet/:userId
   * Get detailed wallet information for specific user
   */
  async getWalletDetail(ctx) {
    try {
      const { userId } = ctx.params;

      const wallet = await walletService.getBalance(userId);

      // Get user info
      const user = await strapi.connections.default.raw(`
        SELECT id, email, first_name as firstName, last_name as lastName, phone, created_at
        FROM \`users-permissions_user\`
        WHERE id = ?
      `, [userId]);

      if (user[0].length === 0) {
        return ctx.notFound('User not found');
      }

      // Get statistics
      const stats = await strapi.connections.default.raw(`
        SELECT
          COUNT(*) as total_transactions,
          SUM(CASE WHEN type IN ('top_up', 'bonus', 'refund', 'conversion') THEN amount ELSE 0 END) as lifetime_deposits,
          SUM(CASE WHEN type IN ('payment', 'withdrawal') THEN amount ELSE 0 END) as lifetime_spending,
          SUM(CASE WHEN type = 'refund' THEN amount ELSE 0 END) as total_refunds,
          SUM(CASE WHEN type = 'bonus' THEN amount ELSE 0 END) as total_bonuses,
          MAX(created_at) as last_transaction
        FROM wallet_transactions
        WHERE user_id = ?
      `, [userId]);

      // Get recent transactions
      const recentTrans = await strapi.connections.default.raw(`
        SELECT *
        FROM wallet_transactions
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 10
      `, [userId]);

      ctx.send(utils.successResponse({
        userId: parseInt(userId),
        user: {
          firstName: user[0][0].firstName,
          lastName: user[0][0].lastName,
          email: user[0][0].email,
          phone: user[0][0].phone,
          memberSince: user[0][0].created_at,
        },
        wallet: {
          balance: wallet.balance,
          pendingBalance: wallet.pendingBalance,
          frozenBalance: wallet.frozenBalance,
          totalBalance: wallet.totalBalance,
          status: wallet.status,
          points: wallet.points,
        },
        statistics: {
          totalTransactions: stats[0][0].total_transactions,
          lifetimeDeposits: parseFloat(stats[0][0].lifetime_deposits) || 0,
          lifetimeSpending: parseFloat(stats[0][0].lifetime_spending) || 0,
          totalRefunds: parseFloat(stats[0][0].total_refunds) || 0,
          totalBonuses: parseFloat(stats[0][0].total_bonuses) || 0,
          lastTransaction: stats[0][0].last_transaction,
        },
        recentTransactions: recentTrans[0].map(t => ({
          id: t.id,
          type: t.type,
          amount: parseFloat(t.amount),
          status: t.status,
          createdAt: t.created_at,
        })),
      }));
    } catch (error) {
      strapi.log.error('[WalletAdmin] getWalletDetail error:', error);
      ctx.badRequest(utils.errorResponse('WALLET_ERROR', error.message));
    }
  },

  /**
   * POST /api/admin/wallet/adjust
   * Manually adjust user wallet balance
   */
  async adjustBalance(ctx) {
    try {
      const adminId = ctx.state.user.id;
      const { userId, amount, type, reason } = ctx.request.body;

      if (!userId || !amount || !type || !reason) {
        return ctx.badRequest(utils.errorResponse('WALLET_ERROR', 'Missing required fields'));
      }

      if (!['credit', 'debit'].includes(type)) {
        return ctx.badRequest(utils.errorResponse('WALLET_ERROR', 'Invalid adjustment type'));
      }

      const metadata = utils.getRequestMetadata(ctx);

      const transaction = await walletService.adjustBalance({
        userId,
        amount,
        type,
        reason,
        adminId,
        ...metadata,
      });

      ctx.send(utils.successResponse({
        transactionId: transaction.id,
        userId,
        type: 'adjustment',
        amount: parseFloat(transaction.amount),
        balanceBefore: parseFloat(transaction.balance_before),
        balanceAfter: parseFloat(transaction.balance_after),
        reason,
        adjustedBy: {
          adminId,
        },
        status: transaction.status,
        createdAt: transaction.created_at,
      }));
    } catch (error) {
      strapi.log.error('[WalletAdmin] adjustBalance error:', error);
      ctx.badRequest(utils.errorResponse('WALLET_ERROR', error.message));
    }
  },

  /**
   * POST /api/admin/wallet/freeze
   * Freeze or unfreeze user wallet
   */
  async freezeWallet(ctx) {
    try {
      const adminId = ctx.state.user.id;
      const { userId, action, reason, autoUnfreezeAt } = ctx.request.body;

      if (!userId || !action) {
        return ctx.badRequest(utils.errorResponse('WALLET_ERROR', 'Missing required fields'));
      }

      if (!['freeze', 'unfreeze'].includes(action)) {
        return ctx.badRequest(utils.errorResponse('WALLET_ERROR', 'Invalid action'));
      }

      if (action === 'freeze' && !reason) {
        return ctx.badRequest(utils.errorResponse('WALLET_ERROR', 'Reason required for freezing'));
      }

      const result = await walletService.freezeWallet(userId, {
        action,
        reason,
        adminId,
        autoUnfreezeAt,
      });

      ctx.send(utils.successResponse(result));
    } catch (error) {
      strapi.log.error('[WalletAdmin] freezeWallet error:', error);
      ctx.badRequest(utils.errorResponse('WALLET_ERROR', error.message));
    }
  },

  /**
   * GET /api/admin/wallet/transactions
   * Get all wallet transactions across all users
   */
  async getAllTransactions(ctx) {
    try {
      const {
        limit = 100,
        offset = 0,
        userId,
        type,
        status,
        minAmount,
        maxAmount,
        fromDate,
        toDate,
        paymentMethod,
        referenceId,
      } = ctx.query;

      let query = `
        SELECT
          t.*,
          u.email,
          u.first_name as firstName,
          u.last_name as lastName
        FROM wallet_transactions t
        LEFT JOIN \`users-permissions_user\` u ON t.user_id = u.id
        WHERE 1=1
      `;
      const params = [];

      if (userId) {
        query += ` AND t.user_id = ?`;
        params.push(userId);
      }

      if (type) {
        query += ` AND t.type = ?`;
        params.push(type);
      }

      if (status) {
        query += ` AND t.status = ?`;
        params.push(status);
      }

      if (minAmount) {
        query += ` AND t.amount >= ?`;
        params.push(minAmount);
      }

      if (maxAmount) {
        query += ` AND t.amount <= ?`;
        params.push(maxAmount);
      }

      if (fromDate) {
        query += ` AND t.created_at >= ?`;
        params.push(fromDate);
      }

      if (toDate) {
        query += ` AND t.created_at <= ?`;
        params.push(toDate);
      }

      if (paymentMethod) {
        query += ` AND t.payment_method = ?`;
        params.push(paymentMethod);
      }

      if (referenceId) {
        query += ` AND t.reference_id LIKE ?`;
        params.push(`%${referenceId}%`);
      }

      // Get total count
      const countQuery = query.replace('t.*, u.email, u.first_name as firstName, u.last_name as lastName', 'COUNT(*) as total');
      const countResult = await strapi.connections.default.raw(countQuery, params);
      const total = countResult[0][0].total;

      // Add pagination
      query += ` ORDER BY t.created_at DESC LIMIT ? OFFSET ?`;
      params.push(parseInt(limit), parseInt(offset));

      const transactions = await strapi.connections.default.raw(query, params);

      ctx.send(utils.successResponse({
        transactions: transactions[0].map(t => ({
          id: t.id,
          userId: t.user_id,
          user: {
            firstName: t.firstName,
            lastName: t.lastName,
            email: t.email,
          },
          type: t.type,
          amount: parseFloat(t.amount),
          balanceBefore: parseFloat(t.balance_before),
          balanceAfter: parseFloat(t.balance_after),
          status: t.status,
          paymentMethod: t.payment_method,
          paymentTransactionId: t.payment_transaction_id,
          referenceId: t.reference_id,
          description: t.description,
          createdAt: t.created_at,
          completedAt: t.completed_at,
        })),
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: (parseInt(offset) + parseInt(limit)) < total,
        },
      }));
    } catch (error) {
      strapi.log.error('[WalletAdmin] getAllTransactions error:', error);
      ctx.badRequest(utils.errorResponse('WALLET_ERROR', error.message));
    }
  },

  /**
   * POST /api/admin/wallet/refund
   * Process refund for a transaction
   */
  async refundTransaction(ctx) {
    try {
      const adminId = ctx.state.user.id;
      const { transactionId, refundType = 'full', reason } = ctx.request.body;

      if (!transactionId) {
        return ctx.badRequest(utils.errorResponse('WALLET_ERROR', 'Transaction ID required'));
      }

      // Get original transaction
      const originalTrans = await strapi.connections.default.raw(`
        SELECT * FROM wallet_transactions WHERE id = ?
      `, [transactionId]);

      if (originalTrans[0].length === 0) {
        return ctx.notFound('Transaction not found');
      }

      const original = originalTrans[0][0];

      if (original.type !== 'payment') {
        return ctx.badRequest(utils.errorResponse('WALLET_ERROR', 'Only payment transactions can be refunded'));
      }

      if (original.status !== 'completed') {
        return ctx.badRequest(utils.errorResponse('WALLET_ERROR', 'Only completed transactions can be refunded'));
      }

      const refundAmount = refundType === 'full' ? parseFloat(original.amount) : parseFloat(ctx.request.body.amount);

      const metadata = utils.getRequestMetadata(ctx);

      // Create refund transaction
      const refundTransaction = await walletService.createTransaction({
        userId: original.user_id,
        type: 'refund',
        amount: refundAmount,
        description: `Refund for ${transactionId}: ${reason}`,
        referenceType: 'transaction',
        referenceId: transactionId,
        adminId,
        adminReason: reason,
        ...metadata,
      });

      ctx.send(utils.successResponse({
        refundTransactionId: refundTransaction.id,
        originalTransactionId: transactionId,
        refundAmount,
        refundType,
        userId: original.user_id,
        balanceBefore: parseFloat(refundTransaction.balance_before),
        balanceAfter: parseFloat(refundTransaction.balance_after),
        reason,
        processedBy: {
          adminId,
        },
        status: refundTransaction.status,
        createdAt: refundTransaction.created_at,
      }));
    } catch (error) {
      strapi.log.error('[WalletAdmin] refundTransaction error:', error);
      ctx.badRequest(utils.errorResponse('WALLET_ERROR', error.message));
    }
  },

  /**
   * GET /api/admin/wallet/reports
   * Generate financial reports and analytics
   */
  async getReports(ctx) {
    try {
      const {
        reportType = 'summary',
        fromDate,
        toDate,
        groupBy = 'day',
      } = ctx.query;

      const from = fromDate || new Date(new Date().setDate(1)).toISOString();
      const to = toDate || new Date().toISOString();

      // Get wallet summary
      const walletSummary = await strapi.connections.default.raw(`
        SELECT
          SUM(balance) as total_wallet_balance,
          SUM(pending_balance) as total_pending_balance,
          SUM(frozen_balance) as total_frozen_balance,
          COUNT(*) as total_wallets,
          SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_wallets,
          SUM(CASE WHEN status = 'frozen' THEN 1 ELSE 0 END) as frozen_wallets,
          SUM(CASE WHEN status = 'suspended' THEN 1 ELSE 0 END) as suspended_wallets
        FROM wallets
      `);

      // Get transaction summary for the period
      const transSummary = await strapi.connections.default.raw(`
        SELECT
          COUNT(*) as total_transactions,
          SUM(amount) as total_volume,
          type,
          COUNT(*) as count,
          SUM(amount) as volume
        FROM wallet_transactions
        WHERE created_at BETWEEN ? AND ?
        GROUP BY type
      `, [from, to]);

      // Calculate revenue from fees
      const revenue = await strapi.connections.default.raw(`
        SELECT
          SUM(fee) as total_fees
        FROM wallet_transactions
        WHERE created_at BETWEEN ? AND ? AND fee > 0
      `, [from, to]);

      // Build response
      const byType = {};
      transSummary[0].forEach(t => {
        byType[t.type] = {
          count: t.count,
          volume: parseFloat(t.volume) || 0,
        };
      });

      ctx.send(utils.successResponse({
        reportType,
        period: {
          from,
          to,
        },
        summary: {
          totalWalletBalance: parseFloat(walletSummary[0][0].total_wallet_balance) || 0,
          totalPendingBalance: parseFloat(walletSummary[0][0].total_pending_balance) || 0,
          totalFrozenBalance: parseFloat(walletSummary[0][0].total_frozen_balance) || 0,
          activeWallets: walletSummary[0][0].active_wallets,
          frozenWallets: walletSummary[0][0].frozen_wallets,
          suspendedWallets: walletSummary[0][0].suspended_wallets,
        },
        transactionSummary: {
          totalTransactions: transSummary[0].reduce((sum, t) => sum + t.count, 0),
          totalVolume: transSummary[0].reduce((sum, t) => sum + parseFloat(t.volume || 0), 0),
          byType,
        },
        revenue: {
          topUpFees: parseFloat(revenue[0][0].total_fees) || 0,
          withdrawalFees: 0,
          totalRevenue: parseFloat(revenue[0][0].total_fees) || 0,
        },
      }));
    } catch (error) {
      strapi.log.error('[WalletAdmin] getReports error:', error);
      ctx.badRequest(utils.errorResponse('WALLET_ERROR', error.message));
    }
  },

  /**
   * POST /api/admin/wallet/voucher/create
   * Create wallet voucher code
   */
  async createVoucher(ctx) {
    try {
      const adminId = ctx.state.user.id;
      const {
        code,
        amount,
        maxRedemptions = null,
        perUserLimit = 1,
        validFrom,
        validUntil,
        conditions = null,
        description = null,
      } = ctx.request.body;

      if (!code || !amount || !validFrom || !validUntil) {
        return ctx.badRequest(utils.errorResponse('WALLET_ERROR', 'Missing required fields'));
      }

      // Check if code already exists
      const existing = await strapi.connections.default.raw(`
        SELECT id FROM wallet_vouchers WHERE code = ?
      `, [code.toUpperCase()]);

      if (existing[0].length > 0) {
        return ctx.badRequest(utils.errorResponse('WALLET_ERROR', 'Voucher code already exists'));
      }

      // Generate voucher ID
      const voucherId = await utils.generateVoucherId();

      // Create voucher
      await strapi.connections.default.raw(`
        INSERT INTO wallet_vouchers (
          id, code, amount, max_redemptions, per_user_limit,
          valid_from, valid_until, status, conditions, description,
          created_by, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?, NOW())
      `, [
        voucherId,
        code.toUpperCase(),
        amount,
        maxRedemptions,
        perUserLimit,
        validFrom,
        validUntil,
        conditions ? JSON.stringify(conditions) : null,
        description,
        adminId,
      ]);

      ctx.send(utils.successResponse({
        voucherId,
        code: code.toUpperCase(),
        amount: parseFloat(amount),
        maxRedemptions,
        usedCount: 0,
        perUserLimit,
        validFrom,
        validUntil,
        status: 'active',
        createdBy: {
          adminId,
        },
        createdAt: new Date(),
      }));
    } catch (error) {
      strapi.log.error('[WalletAdmin] createVoucher error:', error);
      ctx.badRequest(utils.errorResponse('WALLET_ERROR', error.message));
    }
  },

  /**
   * GET /api/wallet-admin/transfers
   * Get all transfers (admin)
   */
  async getAllTransfers(ctx) {
    try {
      const result = await strapi.services.transfer.getAllTransfers(ctx.query);
      ctx.send(utils.successResponse(result));
    } catch (error) {
      strapi.log.error('[WalletAdmin] getAllTransfers error:', error);
      ctx.badRequest(utils.errorResponse('WALLET_ERROR', error.message));
    }
  },

  /**
   * GET /api/wallet-admin/point-redemptions
   * Get all point redemptions (admin)
   */
  async getAllPointRedemptions(ctx) {
    try {
      const result = await strapi.services.redemption.getAllRedemptions(ctx.query);
      ctx.send(utils.successResponse(result));
    } catch (error) {
      strapi.log.error('[WalletAdmin] getAllPointRedemptions error:', error);
      ctx.badRequest(utils.errorResponse('WALLET_ERROR', error.message));
    }
  },

  /**
   * POST /api/wallet-admin/transfer/cancel
   * Cancel a transfer and refund
   */
  async cancelTransfer(ctx) {
    try {
      const adminUserId = ctx.state.user?.id;
      if (!adminUserId) {
        return ctx.unauthorized('Authentication required');
      }

      const { transferId, reason } = ctx.request.body;

      if (!transferId) {
        return ctx.badRequest('transferId is required');
      }

      const result = await strapi.services.transfer.cancelTransfer(
        transferId,
        adminUserId,
        reason
      );

      ctx.send(utils.successResponse(result));
    } catch (error) {
      strapi.log.error('[WalletAdmin] cancelTransfer error:', error);
      ctx.badRequest(utils.errorResponse('WALLET_ERROR', error.message));
    }
  },

  /**
   * POST /api/wallet-admin/point-redemption/approve
   * Approve a point redemption
   */
  async approvePointRedemption(ctx) {
    try {
      const adminUserId = ctx.state.user?.id;
      if (!adminUserId) {
        return ctx.unauthorized('Authentication required');
      }

      const { redemptionId } = ctx.request.body;

      if (!redemptionId) {
        return ctx.badRequest('redemptionId is required');
      }

      const result = await strapi.services.redemption.approveRedemption(
        redemptionId,
        adminUserId
      );

      ctx.send(utils.successResponse(result));
    } catch (error) {
      strapi.log.error('[WalletAdmin] approvePointRedemption error:', error);
      ctx.badRequest(utils.errorResponse('WALLET_ERROR', error.message));
    }
  },

  /**
   * POST /api/wallet-admin/point-redemption/reject
   * Reject a point redemption
   */
  async rejectPointRedemption(ctx) {
    try {
      const adminUserId = ctx.state.user?.id;
      if (!adminUserId) {
        return ctx.unauthorized('Authentication required');
      }

      const { redemptionId, reason } = ctx.request.body;

      if (!redemptionId) {
        return ctx.badRequest('redemptionId is required');
      }

      const result = await strapi.services.redemption.rejectRedemption(
        redemptionId,
        adminUserId,
        reason
      );

      ctx.send(utils.successResponse(result));
    } catch (error) {
      strapi.log.error('[WalletAdmin] rejectPointRedemption error:', error);
      ctx.badRequest(utils.errorResponse('WALLET_ERROR', error.message));
    }
  },

  /**
   * GET /api/wallet-admin/transfer-settings
   * Get transfer and redemption settings
   */
  async getTransferSettings(ctx) {
    try {
      const transferSettings = await strapi.services.transfer.getSettings();
      const redemptionSettings = await strapi.services.redemption.getSettings();

      ctx.send(utils.successResponse({
        settings: {
          transferFeePercentage: transferSettings.transfer_fee_percentage,
          transferFeeFixed: transferSettings.transfer_fee_fixed,
          transferMinAmount: transferSettings.transfer_min_amount,
          transferMaxAmount: transferSettings.transfer_max_amount,
          transferDailyLimit: transferSettings.transfer_daily_limit,
          pointConversionRate: redemptionSettings.point_conversion_rate,
          pointMinRedemption: redemptionSettings.point_min_redemption,
          pointRedemptionRequiresApproval: redemptionSettings.point_redemption_requires_approval,
        },
      }));
    } catch (error) {
      strapi.log.error('[WalletAdmin] getTransferSettings error:', error);
      ctx.badRequest(utils.errorResponse('WALLET_ERROR', error.message));
    }
  },

  /**
   * PUT /api/wallet-admin/transfer-settings
   * Update transfer and redemption settings
   */
  async updateTransferSettings(ctx) {
    try {
      const updates = ctx.request.body;

      // Separate transfer and redemption settings
      const transferUpdates = {};
      const redemptionUpdates = {};

      if (updates.transferFeePercentage !== undefined) {
        transferUpdates.transfer_fee_percentage = updates.transferFeePercentage;
      }
      if (updates.transferFeeFixed !== undefined) {
        transferUpdates.transfer_fee_fixed = updates.transferFeeFixed;
      }
      if (updates.transferMinAmount !== undefined) {
        transferUpdates.transfer_min_amount = updates.transferMinAmount;
      }
      if (updates.transferMaxAmount !== undefined) {
        transferUpdates.transfer_max_amount = updates.transferMaxAmount;
      }
      if (updates.transferDailyLimit !== undefined) {
        transferUpdates.transfer_daily_limit = updates.transferDailyLimit;
      }
      if (updates.pointConversionRate !== undefined) {
        redemptionUpdates.point_conversion_rate = updates.pointConversionRate;
      }
      if (updates.pointMinRedemption !== undefined) {
        redemptionUpdates.point_min_redemption = updates.pointMinRedemption;
      }
      if (updates.pointRedemptionRequiresApproval !== undefined) {
        redemptionUpdates.point_redemption_requires_approval = updates.pointRedemptionRequiresApproval;
      }

      // Update both
      if (Object.keys(transferUpdates).length > 0) {
        await strapi.services.transfer.updateSettings(transferUpdates);
      }
      if (Object.keys(redemptionUpdates).length > 0) {
        await strapi.services.redemption.updateSettings(redemptionUpdates);
      }

      // Get updated settings
      const transferSettings = await strapi.services.transfer.getSettings();
      const redemptionSettings = await strapi.services.redemption.getSettings();

      ctx.send(utils.successResponse({
        message: 'Settings updated successfully',
        settings: {
          transferFeePercentage: transferSettings.transfer_fee_percentage,
          transferFeeFixed: transferSettings.transfer_fee_fixed,
          transferMinAmount: transferSettings.transfer_min_amount,
          transferMaxAmount: transferSettings.transfer_max_amount,
          transferDailyLimit: transferSettings.transfer_daily_limit,
          pointConversionRate: redemptionSettings.point_conversion_rate,
          pointMinRedemption: redemptionSettings.point_min_redemption,
          pointRedemptionRequiresApproval: redemptionSettings.point_redemption_requires_approval,
        },
      }));
    } catch (error) {
      strapi.log.error('[WalletAdmin] updateTransferSettings error:', error);
      ctx.badRequest(utils.errorResponse('WALLET_ERROR', error.message));
    }
  },
};
