<template>
  <div class="wallets-page">
    <Breadcrumb :items="breadcrumbs" />
    <div class="page-header">
      <h1>Wallet Management</h1>
      <div class="header-actions">
        <button @click="exportData" class="btn-export">
          Export to CSV
        </button>
        <nuxt-link to="/wallets/transactions" class="btn-primary">
          View All Transactions
        </nuxt-link>
        <nuxt-link to="/wallets/reports" class="btn-primary">
          View Reports
        </nuxt-link>
        <nuxt-link to="/wallets/vouchers" class="btn-primary">
          Manage Vouchers
        </nuxt-link>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Total Balance</div>
        <div class="stat-value">฿ {{ formatNumber(stats.totalBalance) }}</div>
        <div class="stat-change positive">↑ {{ stats.balanceChange }}%</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Active Wallets</div>
        <div class="stat-value">{{ formatNumber(stats.activeWallets) }}</div>
        <div class="stat-change positive">↑ {{ stats.newWallets }} new</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Today's Volume</div>
        <div class="stat-value">฿ {{ formatNumber(stats.todayVolume) }}</div>
        <div class="stat-change">{{ stats.todayTransactions }} trans</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Pending Transactions</div>
        <div class="stat-value">{{ stats.pendingCount }}</div>
        <div class="stat-change">฿ {{ formatNumber(stats.pendingAmount) }}</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filter-group">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Search by name, email, phone..."
          class="search-input"
          @input="debouncedSearch"
        />
      </div>
      <div class="filter-group">
        <select v-model="filters.status" @change="loadWallets" class="filter-select">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="frozen">Frozen</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>
      <div class="filter-group">
        <input
          v-model="filters.minBalance"
          type="number"
          placeholder="Min Balance"
          class="filter-input"
          @change="loadWallets"
        />
      </div>
      <div class="filter-group">
        <input
          v-model="filters.maxBalance"
          type="number"
          placeholder="Max Balance"
          class="filter-input"
          @change="loadWallets"
        />
      </div>
      <div class="filter-group">
        <select v-model="filters.sortBy" @change="loadWallets" class="filter-select">
          <option value="created_at">Created Date</option>
          <option value="balance">Balance</option>
          <option value="last_transaction">Last Transaction</option>
        </select>
      </div>
      <div class="filter-group">
        <select v-model="filters.sortOrder" @change="loadWallets" class="filter-select">
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
      <button @click="resetFilters" class="btn-reset">Reset</button>
    </div>

    <!-- Wallets Table -->
    <div class="table-container">
      <table class="wallets-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Balance</th>
            <th>Pending</th>
            <th>Status</th>
            <th>Last Transaction</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="8" class="loading-cell">Loading...</td>
          </tr>
          <tr v-else-if="wallets.length === 0">
            <td colspan="8" class="empty-cell">No wallets found</td>
          </tr>
          <tr v-else v-for="wallet in wallets" :key="wallet.userId">
            <td>#{{ wallet.userId }}</td>
            <td>{{ wallet.user.firstName }} {{ wallet.user.lastName }}</td>
            <td>{{ wallet.user.email }}</td>
            <td class="amount">฿{{ formatNumber(wallet.balance) }}</td>
            <td class="amount">฿{{ formatNumber(wallet.pendingBalance) }}</td>
            <td>
              <span :class="['status-badge', wallet.status]">
                {{ wallet.status }}
              </span>
            </td>
            <td>{{ formatDate(wallet.lastTransaction) }}</td>
            <td class="actions">
              <nuxt-link :to="`/wallets/${wallet.userId}`" class="btn-action">
                View
              </nuxt-link>
              <button @click="showAdjustModal(wallet)" class="btn-action">
                Adjust
              </button>
              <button
                v-if="wallet.status === 'active'"
                @click="freezeWallet(wallet.userId)"
                class="btn-action danger"
              >
                Freeze
              </button>
              <button
                v-else
                @click="unfreezeWallet(wallet.userId)"
                class="btn-action success"
              >
                Unfreeze
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button
        @click="prevPage"
        :disabled="pagination.offset === 0"
        class="btn-page"
      >
        Previous
      </button>
      <span class="page-info">
        Showing {{ pagination.offset + 1 }} -
        {{ Math.min(pagination.offset + pagination.limit, pagination.total) }}
        of {{ pagination.total }}
      </span>
      <button
        @click="nextPage"
        :disabled="!pagination.hasMore"
        class="btn-page"
      >
        Next
      </button>
    </div>

    <!-- Adjust Balance Modal -->
    <div v-if="showAdjustDialog" class="modal-overlay" @click="closeAdjustModal">
      <div class="modal-content" @click.stop>
        <h2>Adjust Wallet Balance</h2>
        <div class="modal-body">
          <p>
            <strong>User:</strong> {{ adjustData.user?.firstName }}
            {{ adjustData.user?.lastName }}
          </p>
          <p><strong>Current Balance:</strong> ฿{{ formatNumber(adjustData.balance) }}</p>

          <div class="form-group">
            <label>Type</label>
            <select v-model="adjustData.type" class="form-control">
              <option value="credit">Credit (Add)</option>
              <option value="debit">Debit (Deduct)</option>
            </select>
          </div>

          <div class="form-group">
            <label>Amount (฿)</label>
            <input
              v-model="adjustData.amount"
              type="number"
              step="0.01"
              class="form-control"
              placeholder="Enter amount"
            />
          </div>

          <div class="form-group">
            <label>Reason (Required)</label>
            <textarea
              v-model="adjustData.reason"
              class="form-control"
              rows="3"
              placeholder="Enter reason for adjustment..."
            ></textarea>
          </div>

          <div class="modal-actions">
            <button @click="closeAdjustModal" class="btn-secondary">Cancel</button>
            <button @click="submitAdjustment" class="btn-primary" :disabled="!canSubmitAdjustment">
              Adjust Balance
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '~/components/Breadcrumb';

export default {
  name: 'WalletsIndex',
  middleware: 'auth',
  components: {
    Breadcrumb,
  },
  data() {
    return {
      breadcrumbs: [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Wallet Management' },
      ],
      wallets: [],
      loading: false,
      filters: {
        search: '',
        status: '',
        minBalance: '',
        maxBalance: '',
        sortBy: 'created_at',
        sortOrder: 'desc',
      },
      pagination: {
        limit: 50,
        offset: 0,
        total: 0,
        hasMore: false,
      },
      stats: {
        totalBalance: 0,
        activeWallets: 0,
        balanceChange: 0,
        newWallets: 0,
        todayVolume: 0,
        todayTransactions: 0,
        pendingCount: 0,
        pendingAmount: 0,
      },
      showAdjustDialog: false,
      adjustData: {
        userId: null,
        user: null,
        balance: 0,
        type: 'credit',
        amount: '',
        reason: '',
      },
      searchTimeout: null,
    };
  },
  computed: {
    canSubmitAdjustment() {
      return (
        this.adjustData.amount &&
        parseFloat(this.adjustData.amount) > 0 &&
        this.adjustData.reason.trim().length > 0
      );
    },
  },
  async mounted() {
    await this.loadWallets();
    await this.loadStats();
  },
  methods: {
    async loadWallets() {
      this.loading = true;
      try {
        const params = {
          limit: this.pagination.limit,
          offset: this.pagination.offset,
          ...this.filters,
        };

        const response = await this.$walletService.getWallets(params);
        console.log('[WalletPage] API Response:', response);
        console.log('[WalletPage] Wallets count:', response.data?.wallets?.length);

        if (response.success) {
          this.wallets = response.data.wallets;
          this.pagination = response.data.pagination;
          console.log('[WalletPage] Wallets set:', this.wallets.length);
        }
      } catch (error) {
        console.error('Error loading wallets:', error);
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load wallets',
        });
      } finally {
        this.loading = false;
      }
    },

    async loadStats() {
      try {
        // In a real implementation, you'd have a dedicated endpoint for stats
        // For now, we'll use the reports endpoint
        const response = await this.$walletService.getReports({
          reportType: 'summary',
        });

        if (response.success) {
          const data = response.data;
          this.stats = {
            totalBalance: data.summary?.totalWalletBalance || 0,
            activeWallets: data.summary?.activeWallets || 0,
            balanceChange: 12.5,
            newWallets: 234,
            todayVolume: data.transactionSummary?.totalVolume || 0,
            todayTransactions: data.transactionSummary?.totalTransactions || 0,
            pendingCount: 24,
            pendingAmount: 8450,
          };
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    },

    debouncedSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.pagination.offset = 0;
        this.loadWallets();
      }, 500);
    },

    resetFilters() {
      this.filters = {
        search: '',
        status: '',
        minBalance: '',
        maxBalance: '',
        sortBy: 'created_at',
        sortOrder: 'desc',
      };
      this.pagination.offset = 0;
      this.loadWallets();
    },

    prevPage() {
      if (this.pagination.offset > 0) {
        this.pagination.offset -= this.pagination.limit;
        this.loadWallets();
      }
    },

    nextPage() {
      if (this.pagination.hasMore) {
        this.pagination.offset += this.pagination.limit;
        this.loadWallets();
      }
    },

    showAdjustModal(wallet) {
      this.adjustData = {
        userId: wallet.userId,
        user: wallet.user,
        balance: wallet.balance,
        type: 'credit',
        amount: '',
        reason: '',
      };
      this.showAdjustDialog = true;
    },

    closeAdjustModal() {
      this.showAdjustDialog = false;
      this.adjustData = {
        userId: null,
        user: null,
        balance: 0,
        type: 'credit',
        amount: '',
        reason: '',
      };
    },

    async submitAdjustment() {
      try {
        const response = await this.$walletService.adjustBalance({
          userId: this.adjustData.userId,
          amount: parseFloat(this.adjustData.amount),
          type: this.adjustData.type,
          reason: this.adjustData.reason,
        });

        if (response.success) {
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Wallet balance adjusted successfully',
          });
          this.closeAdjustModal();
          this.loadWallets();
        }
      } catch (error) {
        console.error('Error adjusting balance:', error);
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.error?.message || 'Failed to adjust balance',
        });
      }
    },

    async freezeWallet(userId) {
      const result = await this.$swal({
        icon: 'warning',
        title: 'Freeze Wallet?',
        text: 'Enter reason for freezing this wallet:',
        input: 'textarea',
        inputPlaceholder: 'Reason for freezing...',
        showCancelButton: true,
        confirmButtonText: 'Freeze',
        inputValidator: (value) => {
          if (!value) {
            return 'Reason is required';
          }
        },
      });

      if (result.isConfirmed) {
        try {
          const response = await this.$walletService.freezeWallet({
            userId,
            action: 'freeze',
            reason: result.value,
          });

          if (response.success) {
            this.$swal({
              icon: 'success',
              title: 'Success',
              text: 'Wallet frozen successfully',
            });
            this.loadWallets();
          }
        } catch (error) {
          console.error('Error freezing wallet:', error);
          this.$swal({
            icon: 'error',
            title: 'Error',
            text: 'Failed to freeze wallet',
          });
        }
      }
    },

    async unfreezeWallet(userId) {
      const result = await this.$swal({
        icon: 'question',
        title: 'Unfreeze Wallet?',
        text: 'Are you sure you want to unfreeze this wallet?',
        showCancelButton: true,
        confirmButtonText: 'Unfreeze',
      });

      if (result.isConfirmed) {
        try {
          const response = await this.$walletService.freezeWallet({
            userId,
            action: 'unfreeze',
          });

          if (response.success) {
            this.$swal({
              icon: 'success',
              title: 'Success',
              text: 'Wallet unfrozen successfully',
            });
            this.loadWallets();
          }
        } catch (error) {
          console.error('Error unfreezing wallet:', error);
          this.$swal({
            icon: 'error',
            title: 'Error',
            text: 'Failed to unfreeze wallet',
          });
        }
      }
    },

    async exportData() {
      try {
        const csvData = await this.$walletService.exportWallets(this.filters);
        const filename = `wallets-${new Date().toISOString().split('T')[0]}.csv`;
        this.$walletService.downloadCSV(csvData, filename);
      } catch (error) {
        console.error('Error exporting data:', error);
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Failed to export data',
        });
      }
    },

    formatNumber(value) {
      if (value === null || value === undefined) return '0.00';
      return parseFloat(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },

    formatDate(date) {
      if (!date) return 'Never';
      return this.$moment(date).format('MMM D, YYYY HH:mm');
    },
  },
};
</script>

<style scoped>
.wallets-page {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #1f2937;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.stat-change {
  font-size: 14px;
  color: #6b7280;
}

.stat-change.positive {
  color: #10b981;
}

.filters-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-group {
  flex: 1;
  min-width: 150px;
}

.search-input,
.filter-select,
.filter-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.wallets-table {
  width: 100%;
  border-collapse: collapse;
}

.wallets-table thead {
  background: #f9fafb;
}

.wallets-table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.wallets-table td {
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
  font-size: 14px;
  color: #1f2937;
}

.amount {
  font-family: monospace;
  font-weight: 600;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.frozen {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.suspended {
  background: #fee2e2;
  color: #991b1b;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-action {
  padding: 6px 12px;
  font-size: 12px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  background: white;
  cursor: pointer;
  text-decoration: none;
  color: #1f2937;
}

.btn-action:hover {
  background: #f3f4f6;
}

.btn-action.danger {
  color: #dc2626;
  border-color: #dc2626;
}

.btn-action.success {
  color: #10b981;
  border-color: #10b981;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}

.btn-page {
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: white;
  cursor: pointer;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-body {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 14px;
  color: #374151;
}

.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn-primary,
.btn-secondary,
.btn-export,
.btn-reset {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  border: none;
}

.btn-primary {
  background: #1a7a89;
  color: white;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #1f2937;
}

.btn-export {
  background: #10b981;
  color: white;
}

.btn-reset {
  background: #6b7280;
  color: white;
}

.loading-cell,
.empty-cell {
  text-align: center;
  padding: 40px;
  color: #6b7280;
}
</style>
