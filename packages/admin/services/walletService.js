/**
 * Wallet API Service
 * Handles all wallet-related API calls for admin panel
 */

export default ($axios) => ({
  /**
   * Get list of all wallets with filters
   * @param {object} params - Query parameters
   * @returns {Promise} Wallet list response
   */
  async getWallets(params = {}) {
    try {
      const response = await $axios.get('/api/wallet-admin/wallets', { params });
      return response.data;
    } catch (error) {
      console.error('[WalletService] getWallets error:', error);
      throw error;
    }
  },

  /**
   * Get detailed wallet information for specific user
   * @param {number} userId - User ID
   * @returns {Promise} Wallet detail response
   */
  async getWalletDetail(userId) {
    try {
      const response = await $axios.get(`/api/wallet-admin/wallet/${userId}`);
      return response.data;
    } catch (error) {
      console.error('[WalletService] getWalletDetail error:', error);
      throw error;
    }
  },

  /**
   * Manually adjust user wallet balance
   * @param {object} data - Adjustment data
   * @returns {Promise} Adjustment response
   */
  async adjustBalance(data) {
    try {
      const response = await $axios.post('/api/wallet-admin/wallet/adjust', data);
      return response.data;
    } catch (error) {
      console.error('[WalletService] adjustBalance error:', error);
      throw error;
    }
  },

  /**
   * Freeze or unfreeze user wallet
   * @param {object} data - Freeze data
   * @returns {Promise} Freeze response
   */
  async freezeWallet(data) {
    try {
      const response = await $axios.post('/api/wallet-admin/wallet/freeze', data);
      return response.data;
    } catch (error) {
      console.error('[WalletService] freezeWallet error:', error);
      throw error;
    }
  },

  /**
   * Get all wallet transactions
   * @param {object} params - Query parameters
   * @returns {Promise} Transactions response
   */
  async getTransactions(params = {}) {
    try {
      const response = await $axios.get('/api/wallet-admin/transactions', { params });
      return response.data;
    } catch (error) {
      console.error('[WalletService] getTransactions error:', error);
      throw error;
    }
  },

  /**
   * Process refund for a transaction
   * @param {object} data - Refund data
   * @returns {Promise} Refund response
   */
  async refundTransaction(data) {
    try {
      const response = await $axios.post('/api/wallet-admin/refund', data);
      return response.data;
    } catch (error) {
      console.error('[WalletService] refundTransaction error:', error);
      throw error;
    }
  },

  /**
   * Get financial reports and analytics
   * @param {object} params - Report parameters
   * @returns {Promise} Reports response
   */
  async getReports(params = {}) {
    try {
      const response = await $axios.get('/api/wallet-admin/reports', { params });
      return response.data;
    } catch (error) {
      console.error('[WalletService] getReports error:', error);
      throw error;
    }
  },

  /**
   * Create wallet voucher code
   * @param {object} data - Voucher data
   * @returns {Promise} Voucher creation response
   */
  async createVoucher(data) {
    try {
      const response = await $axios.post('/api/wallet-admin/wallet/voucher/create', data);
      return response.data;
    } catch (error) {
      console.error('[WalletService] createVoucher error:', error);
      throw error;
    }
  },

  /**
   * Export wallets to CSV
   * @param {object} params - Export parameters
   * @returns {Promise} CSV data
   */
  async exportWallets(params = {}) {
    try {
      // This would need backend endpoint for CSV export
      const response = await $axios.get('/api/wallet-admin/wallets', {
        params: { ...params, _limit: -1 },
      });
      return this.convertToCSV(response.data.data.wallets);
    } catch (error) {
      console.error('[WalletService] exportWallets error:', error);
      throw error;
    }
  },

  /**
   * Export transactions to CSV
   * @param {object} params - Export parameters
   * @returns {Promise} CSV data
   */
  async exportTransactions(params = {}) {
    try {
      const response = await $axios.get('/api/wallet-admin/transactions', {
        params: { ...params, limit: 10000 },
      });
      return this.convertToCSV(response.data.data.transactions);
    } catch (error) {
      console.error('[WalletService] exportTransactions error:', error);
      throw error;
    }
  },

  /**
   * Convert JSON data to CSV format
   * @param {Array} data - Data array
   * @returns {string} CSV string
   */
  convertToCSV(data) {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [];

    // Add headers
    csvRows.push(headers.join(','));

    // Add data rows
    for (const row of data) {
      const values = headers.map((header) => {
        const value = row[header];
        // Handle nested objects
        if (typeof value === 'object' && value !== null) {
          return JSON.stringify(value).replace(/"/g, '""');
        }
        // Escape quotes
        return `"${String(value).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  },

  /**
   * Download CSV file
   * @param {string} csvData - CSV data string
   * @param {string} filename - File name
   */
  downloadCSV(csvData, filename = 'export.csv') {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },
});
