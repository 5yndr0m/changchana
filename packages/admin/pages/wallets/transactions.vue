<template>
  <div class="transactions-page">
    <Breadcrumb :items="breadcrumbs" />
    <div class="page-header">
      <h1>All Transactions</h1>
      <div class="header-actions">
        <button @click="exportData" class="btn-export">
          Export to CSV
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filter-group">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Search by user, transaction ID..."
          class="search-input"
          @input="debouncedSearch"
        />
      </div>
      <div class="filter-group">
        <select v-model="filters.type" @change="loadTransactions" class="filter-select">
          <option value="">All Types</option>
          <option value="top_up">Top Up</option>
          <option value="payment">Payment</option>
          <option value="refund">Refund</option>
          <option value="bonus">Bonus</option>
          <option value="adjustment">Adjustment</option>
          <option value="withdrawal">Withdrawal</option>
        </select>
      </div>
      <div class="filter-group">
        <select v-model="filters.status" @change="loadTransactions" class="filter-select">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div class="filter-group">
        <input
          v-model="filters.minAmount"
          type="number"
          placeholder="Min Amount"
          class="filter-input"
          @change="loadTransactions"
        />
      </div>
      <div class="filter-group">
        <input
          v-model="filters.maxAmount"
          type="number"
          placeholder="Max Amount"
          class="filter-input"
          @change="loadTransactions"
        />
      </div>
      <button @click="resetFilters" class="btn-reset">Reset</button>
    </div>

    <!-- Transactions Table -->
    <div class="table-container">
      <table class="transactions-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>User</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Payment Method</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="8" class="loading-cell">Loading...</td>
          </tr>
          <tr v-else-if="transactions.length === 0">
            <td colspan="8" class="empty-cell">No transactions found</td>
          </tr>
          <tr v-else v-for="transaction in transactions" :key="transaction.id">
            <td class="mono">#{{ transaction.id }}</td>
            <td>
              <div class="user-info">
                <div>{{ transaction.user.firstName }} {{ transaction.user.lastName }}</div>
                <div class="email">{{ transaction.user.email }}</div>
              </div>
            </td>
            <td>
              <span :class="['type-badge', transaction.type]">
                {{ formatType(transaction.type) }}
              </span>
            </td>
            <td class="amount" :class="getAmountClass(transaction.type)">
              {{ getAmountPrefix(transaction.type) }}฿{{ formatNumber(transaction.amount) }}
            </td>
            <td>
              <span :class="['status-badge', transaction.status]">
                {{ transaction.status }}
              </span>
            </td>
            <td>{{ transaction.paymentMethod || '-' }}</td>
            <td>{{ formatDate(transaction.createdAt) }}</td>
            <td class="actions">
              <button @click="showTransactionDetail(transaction)" class="btn-action">
                View
              </button>
              <button
                v-if="transaction.type === 'payment' && transaction.status === 'completed'"
                @click="refundTransaction(transaction)"
                class="btn-action danger"
              >
                Refund
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

    <!-- Transaction Detail Modal -->
    <div v-if="showDetailDialog" class="modal-overlay" @click="closeDetailModal">
      <div class="modal-content" @click.stop>
        <h2>Transaction Details</h2>
        <div class="modal-body" v-if="selectedTransaction">
          <div class="detail-row">
            <label>Transaction ID:</label>
            <span>#{{ selectedTransaction.id }}</span>
          </div>
          <div class="detail-row">
            <label>User:</label>
            <span>{{ selectedTransaction.user.firstName }} {{ selectedTransaction.user.lastName }}</span>
          </div>
          <div class="detail-row">
            <label>Email:</label>
            <span>{{ selectedTransaction.user.email }}</span>
          </div>
          <div class="detail-row">
            <label>Type:</label>
            <span :class="['type-badge', selectedTransaction.type]">
              {{ formatType(selectedTransaction.type) }}
            </span>
          </div>
          <div class="detail-row">
            <label>Amount:</label>
            <span class="amount">฿{{ formatNumber(selectedTransaction.amount) }}</span>
          </div>
          <div class="detail-row">
            <label>Status:</label>
            <span :class="['status-badge', selectedTransaction.status]">
              {{ selectedTransaction.status }}
            </span>
          </div>
          <div class="detail-row">
            <label>Balance Before:</label>
            <span>฿{{ formatNumber(selectedTransaction.balanceBefore) }}</span>
          </div>
          <div class="detail-row">
            <label>Balance After:</label>
            <span>฿{{ formatNumber(selectedTransaction.balanceAfter) }}</span>
          </div>
          <div class="detail-row" v-if="selectedTransaction.paymentMethod">
            <label>Payment Method:</label>
            <span>{{ selectedTransaction.paymentMethod }}</span>
          </div>
          <div class="detail-row" v-if="selectedTransaction.paymentTransactionId">
            <label>Payment Transaction ID:</label>
            <span class="mono">{{ selectedTransaction.paymentTransactionId }}</span>
          </div>
          <div class="detail-row" v-if="selectedTransaction.referenceId">
            <label>Reference ID:</label>
            <span class="mono">{{ selectedTransaction.referenceId }}</span>
          </div>
          <div class="detail-row" v-if="selectedTransaction.description">
            <label>Description:</label>
            <span>{{ selectedTransaction.description }}</span>
          </div>
          <div class="detail-row">
            <label>Created At:</label>
            <span>{{ formatDate(selectedTransaction.createdAt) }}</span>
          </div>
          <div class="detail-row" v-if="selectedTransaction.completedAt">
            <label>Completed At:</label>
            <span>{{ formatDate(selectedTransaction.completedAt) }}</span>
          </div>

          <div class="modal-actions">
            <button @click="closeDetailModal" class="btn-secondary">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '~/components/Breadcrumb';

export default {
  name: 'TransactionsIndex',
  middleware: 'auth',
  components: {
    Breadcrumb,
  },
  data() {
    return {
      breadcrumbs: [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Wallet Management', path: '/wallets' },
        { label: 'All Transactions' },
      ],
      transactions: [],
      loading: false,
      filters: {
        search: '',
        type: '',
        status: '',
        minAmount: '',
        maxAmount: '',
      },
      pagination: {
        limit: 50,
        offset: 0,
        total: 0,
        hasMore: false,
      },
      showDetailDialog: false,
      selectedTransaction: null,
      searchTimeout: null,
    };
  },
  async mounted() {
    await this.loadTransactions();
  },
  methods: {
    async loadTransactions() {
      this.loading = true;
      try {
        const params = {
          limit: this.pagination.limit,
          offset: this.pagination.offset,
          ...this.filters,
        };

        const response = await this.$walletService.getTransactions(params);

        if (response.success) {
          this.transactions = response.data.transactions;
          this.pagination = response.data.pagination;
        }
      } catch (error) {
        console.error('Error loading transactions:', error);
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load transactions',
        });
      } finally {
        this.loading = false;
      }
    },

    debouncedSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.pagination.offset = 0;
        this.loadTransactions();
      }, 500);
    },

    resetFilters() {
      this.filters = {
        search: '',
        type: '',
        status: '',
        minAmount: '',
        maxAmount: '',
      };
      this.pagination.offset = 0;
      this.loadTransactions();
    },

    prevPage() {
      if (this.pagination.offset > 0) {
        this.pagination.offset -= this.pagination.limit;
        this.loadTransactions();
      }
    },

    nextPage() {
      if (this.pagination.hasMore) {
        this.pagination.offset += this.pagination.limit;
        this.loadTransactions();
      }
    },

    showTransactionDetail(transaction) {
      this.selectedTransaction = transaction;
      this.showDetailDialog = true;
    },

    closeDetailModal() {
      this.showDetailDialog = false;
      this.selectedTransaction = null;
    },

    async refundTransaction(transaction) {
      const result = await this.$swal({
        icon: 'warning',
        title: 'Refund Transaction?',
        html: `
          <p>Are you sure you want to refund this transaction?</p>
          <p><strong>Amount:</strong> ฿${this.formatNumber(transaction.amount)}</p>
        `,
        input: 'textarea',
        inputLabel: 'Reason for refund (required)',
        inputPlaceholder: 'Enter reason for refund...',
        showCancelButton: true,
        confirmButtonText: 'Process Refund',
        inputValidator: (value) => {
          if (!value) {
            return 'Reason is required';
          }
        },
      });

      if (result.isConfirmed) {
        try {
          const response = await this.$walletService.refundTransaction({
            transactionId: transaction.id,
            refundType: 'full',
            reason: result.value,
          });

          if (response.success) {
            this.$swal({
              icon: 'success',
              title: 'Success',
              text: 'Transaction refunded successfully',
            });
            this.loadTransactions();
          }
        } catch (error) {
          console.error('Error refunding transaction:', error);
          this.$swal({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.error?.message || 'Failed to refund transaction',
          });
        }
      }
    },

    async exportData() {
      try {
        const csvData = await this.$walletService.exportTransactions(this.filters);
        const filename = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
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

    formatType(type) {
      const types = {
        top_up: 'Top Up',
        payment: 'Payment',
        refund: 'Refund',
        bonus: 'Bonus',
        adjustment: 'Adjustment',
        withdrawal: 'Withdrawal',
        conversion: 'Conversion',
      };
      return types[type] || type;
    },

    getAmountClass(type) {
      const creditTypes = ['top_up', 'refund', 'bonus', 'conversion'];
      return creditTypes.includes(type) ? 'positive' : 'negative';
    },

    getAmountPrefix(type) {
      const creditTypes = ['top_up', 'refund', 'bonus', 'conversion'];
      return creditTypes.includes(type) ? '+' : '-';
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
.transactions-page {
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

.transactions-table {
  width: 100%;
  border-collapse: collapse;
}

.transactions-table thead {
  background: #f9fafb;
}

.transactions-table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.transactions-table td {
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
  font-size: 14px;
  color: #1f2937;
}

.mono {
  font-family: monospace;
  font-size: 13px;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.email {
  font-size: 12px;
  color: #6b7280;
}

.amount {
  font-family: monospace;
  font-weight: 600;
}

.amount.positive {
  color: #10b981;
}

.amount.negative {
  color: #ef4444;
}

.type-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.type-badge.top_up {
  background: #dbeafe;
  color: #1e40af;
}

.type-badge.payment {
  background: #fef3c7;
  color: #92400e;
}

.type-badge.refund {
  background: #d1fae5;
  color: #065f46;
}

.type-badge.bonus {
  background: #e0e7ff;
  color: #3730a3;
}

.type-badge.adjustment {
  background: #f3e8ff;
  color: #6b21a8;
}

.type-badge.withdrawal {
  background: #fee2e2;
  color: #991b1b;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.completed {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.failed {
  background: #fee2e2;
  color: #991b1b;
}

.status-badge.cancelled {
  background: #f3f4f6;
  color: #374151;
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
  color: #1f2937;
}

.btn-action:hover {
  background: #f3f4f6;
}

.btn-action.danger {
  color: #dc2626;
  border-color: #dc2626;
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
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-body {
  margin-top: 20px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row label {
  font-weight: 600;
  color: #6b7280;
  min-width: 180px;
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
  border: none;
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
