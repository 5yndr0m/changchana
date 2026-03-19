'use strict';

/**
 * Payment Service
 * Handles Omise payment integration for wallet top-ups
 */

const omise = require('omise')({
  secretKey: process.env.OMISE_SECRET_KEY,
  omiseVersion: '2019-05-29',
});

module.exports = {
  /**
   * Create a payment source for mobile banking
   * Supports: mobile_banking_kbank, mobile_banking_scb, mobile_banking_bay, etc.
   */
  async createMobileBankingSource(amount, currency, type, returnUri) {
    try {
      const source = await omise.sources.create({
        type: type, // e.g., 'mobile_banking_kbank', 'mobile_banking_scb'
        amount: Math.round(amount * 100), // Convert to smallest currency unit (satang)
        currency: currency || 'THB',
        phone_number: undefined, // Optional: can be provided
        return_uri: returnUri, // Deep link to return to the app
      });

      strapi.log.info('[Payment] Created mobile banking source:', {
        id: source.id,
        type: source.type,
        amount: source.amount,
      });

      return source;
    } catch (error) {
      strapi.log.error('[Payment] createMobileBankingSource error:', error);
      throw new Error(error.message || 'Failed to create payment source');
    }
  },

  /**
   * Create a PromptPay QR payment source
   */
  async createPromptPaySource(amount, currency) {
    try {
      const source = await omise.sources.create({
        type: 'promptpay',
        amount: Math.round(amount * 100),
        currency: currency || 'THB',
      });

      strapi.log.info('[Payment] Created PromptPay source:', {
        id: source.id,
        amount: source.amount,
      });

      return source;
    } catch (error) {
      strapi.log.error('[Payment] createPromptPaySource error:', error);
      throw new Error(error.message || 'Failed to create PromptPay source');
    }
  },

  /**
   * Create a charge from a source
   */
  async createCharge(sourceId, amount, currency, description, metadata = {}) {
    try {
      const charge = await omise.charges.create({
        amount: Math.round(amount * 100),
        currency: currency || 'THB',
        source: sourceId,
        description: description,
        metadata: metadata,
        return_uri: metadata.return_uri,
      });

      strapi.log.info('[Payment] Created charge:', {
        id: charge.id,
        amount: charge.amount,
        status: charge.status,
        source: sourceId,
      });

      return charge;
    } catch (error) {
      strapi.log.error('[Payment] createCharge error:', error);
      throw new Error(error.message || 'Failed to create charge');
    }
  },

  /**
   * Get charge status
   */
  async getChargeStatus(chargeId) {
    try {
      const charge = await omise.charges.retrieve(chargeId);

      strapi.log.info('[Payment] Retrieved charge status:', {
        id: charge.id,
        status: charge.status,
        paid: charge.paid,
      });

      return charge;
    } catch (error) {
      strapi.log.error('[Payment] getChargeStatus error:', error);
      throw new Error(error.message || 'Failed to retrieve charge');
    }
  },

  /**
   * Process successful payment and credit wallet
   */
  async processSuccessfulPayment(chargeId, userId) {
    try {
      const charge = await this.getChargeStatus(chargeId);

      if (!charge.paid) {
        throw new Error('Charge is not paid');
      }

      const amount = charge.amount / 100; // Convert back to main currency unit

      // Create wallet transaction
      const knex = strapi.connections.default;
      const transactionId = `topup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      await knex.transaction(async (trx) => {
        // Credit wallet
        await trx('wallets')
          .where({ user_id: userId })
          .increment('balance', amount)
          .update('updated_at', knex.fn.now());

        // Record transaction
        await trx('wallet_transactions').insert({
          transaction_id: transactionId,
          user_id: userId,
          type: 'topup',
          amount: amount,
          status: 'completed',
          description: `Wallet top-up via ${charge.source?.type || 'payment'}`,
          metadata: JSON.stringify({
            charge_id: chargeId,
            source_type: charge.source?.type,
            payment_method: charge.source?.type,
          }),
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        });

        strapi.log.info('[Payment] Wallet credited successfully:', {
          userId,
          amount,
          chargeId,
          transactionId,
        });
      });

      return {
        success: true,
        transactionId,
        amount,
        chargeId,
      };
    } catch (error) {
      strapi.log.error('[Payment] processSuccessfulPayment error:', error);
      throw error;
    }
  },

  /**
   * Verify webhook signature (for security)
   */
  verifyWebhookSignature(payload, signature) {
    // Implement webhook signature verification if needed
    // Omise doesn't use HMAC signatures, but you can implement IP whitelisting
    return true;
  },

  /**
   * Get supported payment methods
   */
  async getSupportedPaymentMethods() {
    return {
      mobile_banking: [
        {
          id: 'mobile_banking_kbank',
          name: 'K PLUS',
          bank: 'Kasikorn Bank',
          icon: 'kbank',
        },
        {
          id: 'mobile_banking_scb',
          name: 'SCB Easy',
          bank: 'Siam Commercial Bank',
          icon: 'scb',
        },
        {
          id: 'mobile_banking_bay',
          name: 'KMA',
          bank: 'Bank of Ayudhya (Krungsri)',
          icon: 'bay',
        },
        {
          id: 'mobile_banking_bbl',
          name: 'Bualuang mBanking',
          bank: 'Bangkok Bank',
          icon: 'bbl',
        },
      ],
      promptpay: {
        id: 'promptpay',
        name: 'PromptPay QR',
        icon: 'promptpay',
      },
    };
  },
};
