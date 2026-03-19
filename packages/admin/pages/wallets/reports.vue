<template>
  <div class="reports-page">
    <div class="page-header">
      <div>
        <nuxt-link to="/wallets" class="back-link">← Back to Wallets</nuxt-link>
        <h1>Financial Reports & Analytics</h1>
      </div>
      <div class="header-actions">
        <button @click="exportReport" class="btn-export">Export Report</button>
        <button @click="loadReports" class="btn-refresh">Refresh</button>
      </div>
    </div>

    <!-- Date Range Selector -->
    <div class="filters-card">
      <div class="filter-group">
        <label>From Date</label>
        <input v-model="filters.fromDate" type="date" class="form-control" />
      </div>
      <div class="filter-group">
        <label>To Date</label>
        <input v-model="filters.toDate" type="date" class="form-control" />
      </div>
      <div class="filter-group">
        <label>Report Type</label>
        <select v-model="filters.reportType" class="form-control">
          <option value="summary">Summary</option>
          <option value="detailed">Detailed</option>
        </select>
      </div>
      <button @click="loadReports" class="btn-apply">Apply</button>
    </div>

    <div v-if="loading" class="loading">Generating reports...</div>

    <div v-else class="reports-content">
      <!-- Summary Cards -->
      <div class="summary-grid">
        <div class="summary-card">
          <div class="card-header">Total Wallet Balance</div>
          <div class="card-value">฿{{ formatNumber(report.summary?.totalWalletBalance) }}</div>
          <div class="card-subtitle">
            Pending: ฿{{ formatNumber(report.summary?.totalPendingBalance) }}
          </div>
        </div>
        <div class="summary-card">
          <div class="card-header">Active Wallets</div>
          <div class="card-value">{{ formatNumber(report.summary?.activeWallets) }}</div>
          <div class="card-subtitle">
            Frozen: {{ report.summary?.frozenWallets || 0 }}
          </div>
        </div>
        <div class="summary-card">
          <div class="card-header">Total Transactions</div>
          <div class="card-value">
            {{ formatNumber(report.transactionSummary?.totalTransactions) }}
          </div>
          <div class="card-subtitle">
            Volume: ฿{{ formatNumber(report.transactionSummary?.totalVolume) }}
          </div>
        </div>
        <div class="summary-card">
          <div class="card-header">Revenue</div>
          <div class="card-value">฿{{ formatNumber(report.revenue?.totalRevenue) }}</div>
          <div class="card-subtitle">From transaction fees</div>
        </div>
      </div>

      <!-- Transaction Breakdown -->
      <div class="breakdown-section">
        <h2>Transaction Breakdown by Type</h2>
        <div class="breakdown-grid">
          <div
            v-for="(data, type) in report.transactionSummary?.byType"
            :key="type"
            class="breakdown-card"
          >
            <div class="breakdown-type">{{ formatType(type) }}</div>
            <div class="breakdown-count">{{ data.count }} transactions</div>
            <div class="breakdown-volume">฿{{ formatNumber(data.volume) }}</div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-section">
        <div class="chart-card">
          <h3>Transaction Volume Trend</h3>
          <p class="chart-placeholder">Chart visualization would go here</p>
          <p class="chart-note">
            Integrate Chart.js or similar library to display transaction trends over time
          </p>
        </div>
        <div class="chart-card">
          <h3>Transaction Types Distribution</h3>
          <p class="chart-placeholder">Pie chart would go here</p>
          <p class="chart-note">
            Show percentage breakdown of different transaction types
          </p>
        </div>
      </div>

      <!-- Detailed Stats Table -->
      <div class="stats-table-section">
        <h2>Detailed Statistics</h2>
        <table class="stats-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Total Wallet Balance</td>
              <td>฿{{ formatNumber(report.summary?.totalWalletBalance) }}</td>
            </tr>
            <tr>
              <td>Total Pending Balance</td>
              <td>฿{{ formatNumber(report.summary?.totalPendingBalance) }}</td>
            </tr>
            <tr>
              <td>Total Frozen Balance</td>
              <td>฿{{ formatNumber(report.summary?.totalFrozenBalance) }}</td>
            </tr>
            <tr>
              <td>Active Wallets</td>
              <td>{{ report.summary?.activeWallets }}</td>
            </tr>
            <tr>
              <td>Frozen Wallets</td>
              <td>{{ report.summary?.frozenWallets }}</td>
            </tr>
            <tr>
              <td>Suspended Wallets</td>
              <td>{{ report.summary?.suspendedWallets }}</td>
            </tr>
            <tr>
              <td>Total Transactions</td>
              <td>{{ formatNumber(report.transactionSummary?.totalTransactions) }}</td>
            </tr>
            <tr>
              <td>Total Transaction Volume</td>
              <td>฿{{ formatNumber(report.transactionSummary?.totalVolume) }}</td>
            </tr>
            <tr>
              <td>Top-up Fees Revenue</td>
              <td>฿{{ formatNumber(report.revenue?.topUpFees) }}</td>
            </tr>
            <tr>
              <td>Total Revenue</td>
              <td>฿{{ formatNumber(report.revenue?.totalRevenue) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WalletReports',
  middleware: 'auth',
  data() {
    return {
      loading: false,
      filters: {
        fromDate: this.$moment().subtract(30, 'days').format('YYYY-MM-DD'),
        toDate: this.$moment().format('YYYY-MM-DD'),
        reportType: 'summary',
      },
      report: {
        summary: {},
        transactionSummary: {},
        revenue: {},
      },
    };
  },
  async mounted() {
    await this.loadReports();
  },
  methods: {
    async loadReports() {
      this.loading = true;
      try {
        const response = await this.$walletService.getReports(this.filters);

        if (response.success) {
          this.report = response.data;
        }
      } catch (error) {
        console.error('Error loading reports:', error);
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load reports',
        });
      } finally {
        this.loading = false;
      }
    },

    async exportReport() {
      try {
        // Generate CSV with report data
        const csvData = this.generateReportCSV();
        const filename = `wallet-report-${this.filters.fromDate}-to-${this.filters.toDate}.csv`;
        this.$walletService.downloadCSV(csvData, filename);
      } catch (error) {
        console.error('Error exporting report:', error);
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Failed to export report',
        });
      }
    },

    generateReportCSV() {
      const rows = [];

      // Header
      rows.push(['Wallet Financial Report']);
      rows.push([`Period: ${this.filters.fromDate} to ${this.filters.toDate}`]);
      rows.push([]);

      // Summary
      rows.push(['SUMMARY']);
      rows.push(['Total Wallet Balance', this.report.summary?.totalWalletBalance || 0]);
      rows.push(['Active Wallets', this.report.summary?.activeWallets || 0]);
      rows.push([
        'Total Transactions',
        this.report.transactionSummary?.totalTransactions || 0,
      ]);
      rows.push(['Total Revenue', this.report.revenue?.totalRevenue || 0]);
      rows.push([]);

      // Transaction Breakdown
      rows.push(['TRANSACTION BREAKDOWN']);
      rows.push(['Type', 'Count', 'Volume']);
      for (const [type, data] of Object.entries(this.report.transactionSummary?.byType || {})) {
        rows.push([type, data.count, data.volume]);
      }

      return rows.map((row) => row.join(',')).join('\n');
    },

    formatNumber(value) {
      if (value === null || value === undefined) return '0';
      return parseFloat(value).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    },

    formatType(type) {
      return type
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },
  },
};
</script>

<style scoped>
.reports-page {
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

.filters-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  display: flex;
  gap: 16px;
  align-items: flex-end;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-group {
  flex: 1;
}

.filter-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.summary-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-header {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 12px;
}

.card-value {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.card-subtitle {
  font-size: 14px;
  color: #6b7280;
}

.breakdown-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 30px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.breakdown-section h2 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #1f2937;
}

.breakdown-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.breakdown-card {
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.breakdown-type {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
  text-transform: capitalize;
}

.breakdown-count {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.breakdown-volume {
  font-size: 20px;
  font-weight: 700;
  color: #1a7a89;
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.chart-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-card h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1f2937;
}

.chart-placeholder {
  text-align: center;
  padding: 60px 20px;
  background: #f9fafb;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 12px;
}

.chart-note {
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
  font-style: italic;
}

.stats-table-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stats-table-section h2 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #1f2937;
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
}

.stats-table th,
.stats-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.stats-table th {
  background: #f9fafb;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
}

.stats-table td {
  font-size: 14px;
  color: #1f2937;
}

.stats-table td:last-child {
  font-weight: 600;
  font-family: monospace;
}

.btn-export,
.btn-refresh,
.btn-apply {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.btn-export {
  background: #10b981;
  color: white;
}

.btn-refresh {
  background: #1a7a89;
  color: white;
}

.btn-apply {
  background: #1a7a89;
  color: white;
}

.loading {
  text-align: center;
  padding: 60px;
  color: #6b7280;
}
</style>
