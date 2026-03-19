<template>
  <div class="wallet-detail-page">
    <Breadcrumb :items="breadcrumbs" />
    <div class="page-header">
      <h1>Wallet Detail</h1>
      <div class="header-actions">
        <button @click="showAdjustDialog = true" class="btn-primary">Adjust Balance</button>
        <button
          v-if="wallet.wallet?.status === 'active'"
          @click="freezeWallet"
          class="btn-danger"
        >
          Freeze Wallet
        </button>
        <button v-else @click="unfreezeWallet" class="btn-success">Unfreeze Wallet</button>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading wallet details...</div>

    <div v-else-if="wallet.userId" class="content-grid">
      <!-- User & Wallet Summary -->
      <div class="summary-card">
        <h2>User Information</h2>
        <div class="info-group">
          <div class="info-item">
            <span class="label">User ID:</span>
            <span class="value">#{{ wallet.userId }}</span>
          </div>
          <div class="info-item">
            <span class="label">Name:</span>
            <span class="value">{{ wallet.user.firstName }} {{ wallet.user.lastName }}</span>
          </div>
          <div class="info-item">
            <span class="label">Email:</span>
            <span class="value">{{ wallet.user.email }}</span>
          </div>
          <div class="info-item">
            <span class="label">Phone:</span>
            <span class="value">{{ wallet.user.phone }}</span>
          </div>
          <div class="info-item">
            <span class="label">Member Since:</span>
            <span class="value">{{ formatDate(wallet.user.memberSince) }}</span>
          </div>
        </div>

        <h3 class="section-title">Wallet Balance</h3>
        <div class="balance-grid">
          <div class="balance-item">
            <div class="balance-label">Available Balance</div>
            <div class="balance-value">฿{{ formatNumber(wallet.wallet.balance) }}</div>
          </div>
          <div class="balance-item">
            <div class="balance-label">Pending Balance</div>
            <div class="balance-value">฿{{ formatNumber(wallet.wallet.pendingBalance) }}</div>
          </div>
          <div class="balance-item">
            <div class="balance-label">Frozen Balance</div>
            <div class="balance-value">฿{{ formatNumber(wallet.wallet.frozenBalance) }}</div>
          </div>
          <div class="balance-item">
            <div class="balance-label">Total Balance</div>
            <div class="balance-value total">฿{{ formatNumber(wallet.wallet.totalBalance) }}</div>
          </div>
        </div>

        <div class="info-item">
          <span class="label">Loyalty Points:</span>
          <span class="value">{{ formatNumber(wallet.wallet.points) }} pts</span>
        </div>
        <div class="info-item">
          <span class="label">Status:</span>
          <span :class="['status-badge', wallet.wallet.status]">{{ wallet.wallet.status }}</span>
        </div>
      </div>

      <!-- Statistics -->
      <div class="stats-card">
        <h2>Statistics</h2>
        <div class="stat-item">
          <span class="stat-label">Total Transactions:</span>
          <span class="stat-value">{{ wallet.statistics.totalTransactions }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Lifetime Deposits:</span>
          <span class="stat-value">฿{{ formatNumber(wallet.statistics.lifetimeDeposits) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Lifetime Spending:</span>
          <span class="stat-value">฿{{ formatNumber(wallet.statistics.lifetimeSpending) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Total Refunds:</span>
          <span class="stat-value">฿{{ formatNumber(wallet.statistics.totalRefunds) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Total Bonuses:</span>
          <span class="stat-value">฿{{ formatNumber(wallet.statistics.totalBonuses) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Last Transaction:</span>
          <span class="stat-value">{{ formatDate(wallet.statistics.lastTransaction) }}</span>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="transactions-card">
        <h2>Recent Transactions</h2>
        <div class="transactions-list">
          <div
            v-for="trans in wallet.recentTransactions"
            :key="trans.id"
            class="transaction-item"
          >
            <div class="trans-info">
              <div class="trans-id">{{ trans.id }}</div>
              <div class="trans-type">{{ trans.type }}</div>
            </div>
            <div class="trans-amount" :class="getAmountClass(trans.type)">
              {{ trans.type.includes('payment') || trans.type.includes('withdrawal') ? '-' : '+' }}฿{{
                formatNumber(trans.amount)
              }}
            </div>
            <div class="trans-status">
              <span :class="['status-badge', trans.status]">{{ trans.status }}</span>
            </div>
            <div class="trans-date">{{ formatDate(trans.createdAt) }}</div>
          </div>
        </div>
        <nuxt-link to="/wallets/transactions" class="view-all-link">
          View All Transactions →
        </nuxt-link>
      </div>
    </div>

    <!-- Adjust Balance Modal -->
    <div v-if="showAdjustDialog" class="modal-overlay" @click="showAdjustDialog = false">
      <div class="modal-content" @click.stop>
        <h2>Adjust Wallet Balance</h2>
        <div class="modal-body">
          <p><strong>Current Balance:</strong> ฿{{ formatNumber(wallet.wallet.balance) }}</p>

          <div class="form-group">
            <label>Type</label>
            <select v-model="adjustForm.type" class="form-control">
              <option value="credit">Credit (Add)</option>
              <option value="debit">Debit (Deduct)</option>
            </select>
          </div>

          <div class="form-group">
            <label>Amount (฿)</label>
            <input
              v-model="adjustForm.amount"
              type="number"
              step="0.01"
              class="form-control"
              placeholder="Enter amount"
            />
          </div>

          <div class="form-group">
            <label>Reason (Required)</label>
            <textarea
              v-model="adjustForm.reason"
              class="form-control"
              rows="3"
              placeholder="Enter reason for adjustment..."
            ></textarea>
          </div>

          <div class="modal-actions">
            <button @click="showAdjustDialog = false" class="btn-secondary">Cancel</button>
            <button @click="submitAdjustment" class="btn-primary" :disabled="!canSubmit">
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
  name: 'WalletDetail',
  middleware: 'auth',
  components: {
    Breadcrumb,
  },
  data() {
    return {
      wallet: {
        userId: null,
        user: {},
        wallet: {},
        statistics: {},
        recentTransactions: [],
      },
      loading: false,
      showAdjustDialog: false,
      adjustForm: {
        type: 'credit',
        amount: '',
        reason: '',
      },
    };
  },
  computed: {
    breadcrumbs() {
      const userName = this.wallet.user?.firstName
        ? `${this.wallet.user.firstName} ${this.wallet.user.lastName}`
        : `User #${this.$route.params.userId}`;

      return [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Wallet Management', path: '/wallets' },
        { label: userName },
      ];
    },
    canSubmit() {
      return (
        this.adjustForm.amount &&
        parseFloat(this.adjustForm.amount) > 0 &&
        this.adjustForm.reason.trim().length > 0
      );
    },
  },
  async mounted() {
    await this.loadWalletDetail();
  },
  methods: {
    async loadWalletDetail() {
      this.loading = true;
      try {
        const userId = this.$route.params.userId;
        const response = await this.$walletService.getWalletDetail(userId);

        if (response.success) {
          this.wallet = response.data;
        }
      } catch (error) {
        console.error('Error loading wallet detail:', error);
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load wallet details',
        });
      } finally {
        this.loading = false;
      }
    },

    async submitAdjustment() {
      try {
        const response = await this.$walletService.adjustBalance({
          userId: this.wallet.userId,
          amount: parseFloat(this.adjustForm.amount),
          type: this.adjustForm.type,
          reason: this.adjustForm.reason,
        });

        if (response.success) {
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Wallet balance adjusted successfully',
          });
          this.showAdjustDialog = false;
          this.adjustForm = { type: 'credit', amount: '', reason: '' };
          await this.loadWalletDetail();
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

    async freezeWallet() {
      const result = await this.$swal({
        icon: 'warning',
        title: 'Freeze Wallet?',
        text: 'Enter reason for freezing this wallet:',
        input: 'textarea',
        inputPlaceholder: 'Reason for freezing...',
        showCancelButton: true,
        confirmButtonText: 'Freeze',
        inputValidator: (value) => {
          if (!value) return 'Reason is required';
        },
      });

      if (result.isConfirmed) {
        try {
          const response = await this.$walletService.freezeWallet({
            userId: this.wallet.userId,
            action: 'freeze',
            reason: result.value,
          });

          if (response.success) {
            this.$swal('Success', 'Wallet frozen successfully', 'success');
            await this.loadWalletDetail();
          }
        } catch (error) {
          this.$swal('Error', 'Failed to freeze wallet', 'error');
        }
      }
    },

    async unfreezeWallet() {
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
            userId: this.wallet.userId,
            action: 'unfreeze',
          });

          if (response.success) {
            this.$swal('Success', 'Wallet unfrozen successfully', 'success');
            await this.loadWalletDetail();
          }
        } catch (error) {
          this.$swal('Error', 'Failed to unfreeze wallet', 'error');
        }
      }
    },

    getAmountClass(type) {
      if (type.includes('payment') || type.includes('withdrawal')) {
        return 'negative';
      }
      return 'positive';
    },

    formatNumber(value) {
      if (value === null || value === undefined) return '0.00';
      return parseFloat(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },

    formatDate(date) {
      if (!date) return 'N/A';
      return this.$moment(date).format('MMM D, YYYY HH:mm');
    },
  },
};
</script>

<style scoped>
.wallet-detail-page {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.back-link {
  display: inline-block;
  color: #1a7a89;
  text-decoration: none;
  margin-bottom: 10px;
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

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.summary-card,
.stats-card,
.transactions-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.transactions-card {
  grid-column: 1 / -1;
}

.summary-card h2,
.stats-card h2,
.transactions-card h2 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #1f2937;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 16px;
  color: #374151;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.info-item .label {
  color: #6b7280;
  font-size: 14px;
}

.info-item .value {
  color: #1f2937;
  font-weight: 500;
  font-size: 14px;
}

.balance-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin: 16px 0;
}

.balance-item {
  text-align: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.balance-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
}

.balance-value {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
}

.balance-value.total {
  color: #1a7a89;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.stat-label {
  color: #6b7280;
  font-size: 14px;
}

.stat-value {
  color: #1f2937;
  font-weight: 600;
  font-size: 14px;
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.transaction-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 16px;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.trans-id {
  font-size: 13px;
  font-family: monospace;
  color: #6b7280;
}

.trans-type {
  font-size: 12px;
  text-transform: capitalize;
  color: #1f2937;
}

.trans-amount {
  font-size: 16px;
  font-weight: 600;
  font-family: monospace;
}

.trans-amount.positive {
  color: #10b981;
}

.trans-amount.negative {
  color: #ef4444;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
  display: inline-block;
}

.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.completed {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.frozen {
  background: #fee2e2;
  color: #991b1b;
}

.view-all-link {
  display: inline-block;
  margin-top: 16px;
  color: #1a7a89;
  text-decoration: none;
  font-weight: 500;
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
.btn-danger,
.btn-success {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
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

.btn-danger {
  background: #dc2626;
  color: white;
}

.btn-success {
  background: #10b981;
  color: white;
}

.loading {
  text-align: center;
  padding: 60px;
  color: #6b7280;
}
</style>
