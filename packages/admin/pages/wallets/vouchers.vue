<template>
  <div class="vouchers-page">
    <div class="page-header">
      <div>
        <nuxt-link to="/wallets" class="back-link">← Back to Wallets</nuxt-link>
        <h1>Promotions & Vouchers</h1>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button
        :class="['tab', { active: activeTab === 'promotions' }]"
        @click="activeTab = 'promotions'"
      >
        Wallet Promotions
      </button>
      <button
        :class="['tab', { active: activeTab === 'vouchers' }]"
        @click="activeTab = 'vouchers'"
      >
        Voucher Codes
      </button>
    </div>

    <!-- Promotions Tab -->
    <div v-if="activeTab === 'promotions'" class="tab-content">
      <div class="content-header">
        <h2>Wallet Promotions</h2>
        <button @click="showPromotionDialog = true" class="btn-primary">
          Create Promotion Campaign
        </button>
      </div>

      <div class="promotions-list">
        <div v-for="promotion in samplePromotions" :key="promotion.id" class="promotion-card">
          <div class="promotion-header">
            <div>
              <h3>{{ promotion.campaignName }}</h3>
              <span :class="['status-badge', promotion.status]">{{ promotion.status }}</span>
            </div>
            <button class="btn-icon" @click="editPromotion(promotion)">Edit</button>
          </div>
          <div class="promotion-body">
            <div class="promo-info">
              <div class="info-row">
                <span class="label">Type:</span>
                <span>{{ formatPromotionType(promotion.type) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Bonus:</span>
                <span>{{ formatBonus(promotion) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Valid Period:</span>
                <span>{{ formatDate(promotion.validFrom) }} - {{ formatDate(promotion.validUntil) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Target:</span>
                <span>{{ promotion.targetUsers }}</span>
              </div>
              <div class="info-row">
                <span class="label">Redemptions:</span>
                <span>{{ promotion.redemptionCount }} times</span>
              </div>
              <div class="info-row">
                <span class="label">Budget Used:</span>
                <span>฿{{ promotion.usedBudget.toFixed(2) }} / ฿{{ promotion.totalBudget.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Vouchers Tab -->
    <div v-if="activeTab === 'vouchers'" class="tab-content">
      <div class="content-header">
        <div class="header-actions">
          <button @click="showVoucherDialog = true" class="btn-primary">Create Single Voucher</button>
          <button @click="showBulkDialog = true" class="btn-secondary">Generate Bulk Vouchers</button>
          <button @click="exportVouchers" class="btn-secondary">Export to CSV</button>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters">
        <input
          v-model="voucherFilters.search"
          type="text"
          placeholder="Search by code..."
          class="filter-input"
        />
        <select v-model="voucherFilters.status" class="filter-select">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="expired">Expired</option>
          <option value="depleted">Depleted</option>
        </select>
      </div>

      <!-- Vouchers Grid -->
      <div class="vouchers-grid">
        <div v-for="voucher in filteredVouchers" :key="voucher.id" class="voucher-card">
          <div class="voucher-code">{{ voucher.code }}</div>
          <div class="voucher-amount">฿{{ voucher.amount.toFixed(2) }}</div>
          <div class="voucher-info">
            <div>Valid: {{ formatDate(voucher.validFrom) }} - {{ formatDate(voucher.validUntil) }}</div>
            <div>Used: {{ voucher.currentRedemptions }} / {{ voucher.maxRedemptions || '∞' }}</div>
            <div>Per User: {{ voucher.perUserLimit }}</div>
            <div v-if="voucher.conditions">
              <span v-if="voucher.conditions.firstTimeOnly" class="tag">First-time only</span>
              <span v-if="voucher.conditions.minTopUp" class="tag">Min: ฿{{ voucher.conditions.minTopUp }}</span>
            </div>
            <div><span :class="['status-badge', voucher.status]">{{ voucher.status }}</span></div>
          </div>
          <div class="voucher-actions">
            <button @click="viewRedemptions(voucher)" class="btn-sm">Redemptions</button>
            <button @click="toggleVoucherStatus(voucher)" class="btn-sm">
              {{ voucher.status === 'active' ? 'Deactivate' : 'Activate' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Promotion Modal -->
    <div v-if="showPromotionDialog" class="modal-overlay" @click="showPromotionDialog = false">
      <div class="modal-content large" @click.stop>
        <h2>Create Wallet Promotion</h2>
        <div class="modal-body">
          <div class="form-group">
            <label>Campaign Name *</label>
            <input
              v-model="promotionForm.campaignName"
              type="text"
              class="form-control"
              placeholder="e.g., Grand Opening Bonus"
            />
          </div>

          <div class="form-group">
            <label>Promotion Type *</label>
            <div class="radio-group">
              <label class="radio-label">
                <input v-model="promotionForm.type" type="radio" value="top_up_bonus" />
                Top-up Bonus (e.g., +10% on all top-ups)
              </label>
              <label class="radio-label">
                <input v-model="promotionForm.type" type="radio" value="fixed_bonus" />
                Fixed Bonus (e.g., ฿50 for first top-up)
              </label>
              <label class="radio-label">
                <input v-model="promotionForm.type" type="radio" value="tiered_bonus" />
                Tiered Bonus (different amounts per tier)
              </label>
            </div>
          </div>

          <!-- Top-up Bonus Fields -->
          <div v-if="promotionForm.type === 'top_up_bonus'" class="form-group">
            <label>Bonus Percentage (%) *</label>
            <input
              v-model="promotionForm.bonusPercentage"
              type="number"
              step="0.01"
              min="0"
              max="100"
              class="form-control"
              placeholder="e.g., 10"
            />
          </div>

          <!-- Fixed Bonus Fields -->
          <div v-if="promotionForm.type === 'fixed_bonus'" class="form-group">
            <label>Bonus Amount (฿) *</label>
            <input
              v-model="promotionForm.bonusAmount"
              type="number"
              step="0.01"
              min="0"
              class="form-control"
              placeholder="e.g., 50.00"
            />
          </div>

          <!-- Tiered Bonus Fields -->
          <div v-if="promotionForm.type === 'tiered_bonus'" class="form-group">
            <label>Bonus Tiers *</label>
            <div v-for="(tier, index) in promotionForm.tiers" :key="index" class="tier-row">
              <input
                v-model="tier.minAmount"
                type="number"
                placeholder="Min Amount"
                class="form-control-sm"
              />
              <span>to</span>
              <input
                v-model="tier.maxAmount"
                type="number"
                placeholder="Max Amount"
                class="form-control-sm"
              />
              <span>=</span>
              <input
                v-model="tier.bonus"
                type="number"
                placeholder="Bonus"
                class="form-control-sm"
              />
              <button @click="removeTier(index)" class="btn-remove">×</button>
            </div>
            <button @click="addTier" class="btn-add">+ Add Tier</button>
          </div>

          <div class="form-section">
            <h4>Conditions</h4>
            <div class="form-group">
              <label class="checkbox-label">
                <input v-model="promotionForm.firstTimeOnly" type="checkbox" />
                First-time top-up only
              </label>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Minimum top-up amount (฿)</label>
                <input
                  v-model="promotionForm.minTopUp"
                  type="number"
                  step="0.01"
                  class="form-control"
                  placeholder="Optional"
                />
              </div>
              <div class="form-group">
                <label>Maximum bonus per user (฿)</label>
                <input
                  v-model="promotionForm.maxBonusPerUser"
                  type="number"
                  step="0.01"
                  class="form-control"
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>

          <div class="form-section">
            <h4>Valid Period *</h4>
            <div class="form-row">
              <div class="form-group">
                <label>From</label>
                <input v-model="promotionForm.validFrom" type="date" class="form-control" />
              </div>
              <div class="form-group">
                <label>To</label>
                <input v-model="promotionForm.validUntil" type="date" class="form-control" />
              </div>
            </div>
          </div>

          <div class="form-section">
            <h4>Target Users *</h4>
            <div class="radio-group">
              <label class="radio-label">
                <input v-model="promotionForm.targetUsers" type="radio" value="all" />
                All users
              </label>
              <label class="radio-label">
                <input v-model="promotionForm.targetUsers" type="radio" value="new_only" />
                New users only
              </label>
              <label class="radio-label">
                <input v-model="promotionForm.targetUsers" type="radio" value="segments" />
                Selected user segments
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>Total Budget (฿)</label>
            <input
              v-model="promotionForm.totalBudget"
              type="number"
              step="0.01"
              class="form-control"
              placeholder="Optional - leave empty for unlimited"
            />
          </div>

          <div class="modal-actions">
            <button @click="showPromotionDialog = false" class="btn-secondary">Cancel</button>
            <button @click="createPromotion" class="btn-primary" :disabled="!canCreatePromotion">
              Create Campaign
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Voucher Modal -->
    <div v-if="showVoucherDialog" class="modal-overlay" @click="showVoucherDialog = false">
      <div class="modal-content" @click.stop>
        <h2>Create Wallet Voucher</h2>
        <div class="modal-body">
          <div class="form-group">
            <label>Voucher Code *</label>
            <input
              v-model="voucherForm.code"
              type="text"
              class="form-control"
              placeholder="e.g., WELCOME50"
              @input="voucherForm.code = voucherForm.code.toUpperCase()"
            />
          </div>

          <div class="form-group">
            <label>Redemption Value (฿) *</label>
            <input
              v-model="voucherForm.amount"
              type="number"
              step="0.01"
              class="form-control"
              placeholder="Enter amount"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Max Redemptions (Total)</label>
              <input
                v-model="voucherForm.maxRedemptions"
                type="number"
                class="form-control"
                placeholder="Leave empty for unlimited"
              />
            </div>
            <div class="form-group">
              <label>Per User Limit</label>
              <input
                v-model="voucherForm.perUserLimit"
                type="number"
                class="form-control"
                placeholder="Default: 1"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Valid From *</label>
              <input v-model="voucherForm.validFrom" type="date" class="form-control" />
            </div>
            <div class="form-group">
              <label>Valid Until *</label>
              <input v-model="voucherForm.validUntil" type="date" class="form-control" />
            </div>
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea
              v-model="voucherForm.description"
              class="form-control"
              rows="2"
              placeholder="Internal description..."
            ></textarea>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input v-model="voucherForm.firstTimeOnly" type="checkbox" />
              First-time top-up only
            </label>
          </div>

          <div class="form-group">
            <label>Minimum Top-up Amount (฿)</label>
            <input
              v-model="voucherForm.minTopUp"
              type="number"
              step="0.01"
              class="form-control"
              placeholder="Optional"
            />
          </div>

          <div class="modal-actions">
            <button @click="showVoucherDialog = false" class="btn-secondary">Cancel</button>
            <button @click="createVoucher" class="btn-primary" :disabled="!canCreateVoucher">
              Create Voucher
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Voucher Generation Modal -->
    <div v-if="showBulkDialog" class="modal-overlay" @click="showBulkDialog = false">
      <div class="modal-content" @click.stop>
        <h2>Generate Bulk Voucher Codes</h2>
        <div class="modal-body">
          <div class="form-group">
            <label>Code Prefix *</label>
            <input
              v-model="bulkForm.prefix"
              type="text"
              class="form-control"
              placeholder="e.g., PROMO"
              @input="bulkForm.prefix = bulkForm.prefix.toUpperCase()"
            />
          </div>

          <div class="form-group">
            <label>Number of Codes *</label>
            <input
              v-model="bulkForm.quantity"
              type="number"
              min="1"
              max="1000"
              class="form-control"
              placeholder="e.g., 100"
            />
          </div>

          <div class="form-group">
            <label>Value per Code (฿) *</label>
            <input
              v-model="bulkForm.amount"
              type="number"
              step="0.01"
              class="form-control"
              placeholder="e.g., 50.00"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Valid From *</label>
              <input v-model="bulkForm.validFrom" type="date" class="form-control" />
            </div>
            <div class="form-group">
              <label>Valid Until *</label>
              <input v-model="bulkForm.validUntil" type="date" class="form-control" />
            </div>
          </div>

          <div class="form-group">
            <label>Per User Limit</label>
            <input
              v-model="bulkForm.perUserLimit"
              type="number"
              class="form-control"
              placeholder="Default: 1"
            />
          </div>

          <div class="modal-actions">
            <button @click="showBulkDialog = false" class="btn-secondary">Cancel</button>
            <button @click="generateBulkVouchers" class="btn-primary" :disabled="!canGenerateBulk">
              Generate Codes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WalletVouchers',
  middleware: 'auth',
  data() {
    return {
      activeTab: 'promotions',
      showPromotionDialog: false,
      showVoucherDialog: false,
      showBulkDialog: false,

      promotionForm: {
        campaignName: '',
        type: 'fixed_bonus',
        bonusAmount: '',
        bonusPercentage: '',
        tiers: [],
        firstTimeOnly: false,
        minTopUp: '',
        maxBonusPerUser: '',
        validFrom: '',
        validUntil: '',
        targetUsers: 'all',
        totalBudget: '',
      },

      voucherForm: {
        code: '',
        amount: '',
        maxRedemptions: null,
        perUserLimit: 1,
        validFrom: '',
        validUntil: '',
        description: '',
        firstTimeOnly: false,
        minTopUp: '',
      },

      bulkForm: {
        prefix: '',
        quantity: '',
        amount: '',
        validFrom: '',
        validUntil: '',
        perUserLimit: 1,
      },

      voucherFilters: {
        search: '',
        status: '',
      },

      samplePromotions: [
        {
          id: 1,
          campaignName: 'Grand Opening Bonus',
          type: 'fixed_bonus',
          bonusAmount: 50,
          validFrom: '2026-03-10',
          validUntil: '2026-03-31',
          targetUsers: 'All users',
          status: 'active',
          redemptionCount: 125,
          usedBudget: 6250,
          totalBudget: 50000,
        },
        {
          id: 2,
          campaignName: 'Top-up Boost March',
          type: 'top_up_bonus',
          bonusPercentage: 10,
          validFrom: '2026-03-01',
          validUntil: '2026-03-31',
          targetUsers: 'All users',
          status: 'active',
          redemptionCount: 89,
          usedBudget: 4450,
          totalBudget: 20000,
        },
        {
          id: 3,
          campaignName: 'VIP Tier Bonus',
          type: 'tiered_bonus',
          validFrom: '2026-02-01',
          validUntil: '2026-02-28',
          targetUsers: 'Selected segments',
          status: 'expired',
          redemptionCount: 45,
          usedBudget: 8900,
          totalBudget: 10000,
        },
      ],

      sampleVouchers: [
        {
          id: 1,
          code: 'WELCOME50',
          amount: 50,
          status: 'active',
          maxRedemptions: 1000,
          currentRedemptions: 45,
          perUserLimit: 1,
          validFrom: '2026-03-01',
          validUntil: '2026-03-31',
          conditions: { firstTimeOnly: true },
        },
        {
          id: 2,
          code: 'BONUS100',
          amount: 100,
          status: 'active',
          maxRedemptions: 500,
          currentRedemptions: 12,
          perUserLimit: 1,
          validFrom: '2026-03-15',
          validUntil: '2026-04-15',
          conditions: { minTopUp: 200 },
        },
        {
          id: 3,
          code: 'MARCH25',
          amount: 25,
          status: 'active',
          maxRedemptions: null,
          currentRedemptions: 234,
          perUserLimit: 1,
          validFrom: '2026-03-01',
          validUntil: '2026-03-31',
          conditions: null,
        },
        {
          id: 4,
          code: 'EXPIRED50',
          amount: 50,
          status: 'expired',
          maxRedemptions: 100,
          currentRedemptions: 78,
          perUserLimit: 1,
          validFrom: '2026-02-01',
          validUntil: '2026-02-28',
          conditions: null,
        },
      ],
    };
  },

  computed: {
    canCreatePromotion() {
      if (!this.promotionForm.campaignName || !this.promotionForm.validFrom || !this.promotionForm.validUntil) {
        return false;
      }
      if (this.promotionForm.type === 'fixed_bonus' && !this.promotionForm.bonusAmount) {
        return false;
      }
      if (this.promotionForm.type === 'top_up_bonus' && !this.promotionForm.bonusPercentage) {
        return false;
      }
      if (this.promotionForm.type === 'tiered_bonus' && this.promotionForm.tiers.length === 0) {
        return false;
      }
      return true;
    },

    canCreateVoucher() {
      return (
        this.voucherForm.code.length > 0 &&
        this.voucherForm.amount > 0 &&
        this.voucherForm.validFrom &&
        this.voucherForm.validUntil
      );
    },

    canGenerateBulk() {
      return (
        this.bulkForm.prefix.length > 0 &&
        this.bulkForm.quantity > 0 &&
        this.bulkForm.amount > 0 &&
        this.bulkForm.validFrom &&
        this.bulkForm.validUntil
      );
    },

    filteredVouchers() {
      return this.sampleVouchers.filter((v) => {
        if (this.voucherFilters.search && !v.code.includes(this.voucherFilters.search.toUpperCase())) {
          return false;
        }
        if (this.voucherFilters.status && v.status !== this.voucherFilters.status) {
          return false;
        }
        return true;
      });
    },
  },

  methods: {
    formatPromotionType(type) {
      const types = {
        top_up_bonus: 'Top-up Bonus',
        fixed_bonus: 'Fixed Bonus',
        tiered_bonus: 'Tiered Bonus',
      };
      return types[type] || type;
    },

    formatBonus(promotion) {
      if (promotion.type === 'top_up_bonus') {
        return `+${promotion.bonusPercentage}%`;
      }
      if (promotion.type === 'fixed_bonus') {
        return `฿${promotion.bonusAmount.toFixed(2)}`;
      }
      return 'Tiered';
    },

    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },

    addTier() {
      this.promotionForm.tiers.push({ minAmount: '', maxAmount: '', bonus: '' });
    },

    removeTier(index) {
      this.promotionForm.tiers.splice(index, 1);
    },

    editPromotion(promotion) {
      this.$swal({
        icon: 'info',
        title: 'Edit Promotion',
        text: 'Edit promotion feature coming soon',
      });
    },

    async createPromotion() {
      try {
        this.$swal({
          icon: 'success',
          title: 'Success',
          text: `Promotion "${this.promotionForm.campaignName}" created successfully`,
        });
        this.showPromotionDialog = false;
        this.resetPromotionForm();
      } catch (error) {
        console.error('Error creating promotion:', error);
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Failed to create promotion',
        });
      }
    },

    async createVoucher() {
      try {
        this.$swal({
          icon: 'success',
          title: 'Success',
          text: `Voucher "${this.voucherForm.code}" created successfully`,
        });
        this.showVoucherDialog = false;
        this.resetVoucherForm();
      } catch (error) {
        console.error('Error creating voucher:', error);
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Failed to create voucher',
        });
      }
    },

    async generateBulkVouchers() {
      try {
        this.$swal({
          icon: 'success',
          title: 'Success',
          text: `Generated ${this.bulkForm.quantity} voucher codes successfully`,
        });
        this.showBulkDialog = false;
        this.resetBulkForm();
      } catch (error) {
        console.error('Error generating vouchers:', error);
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Failed to generate vouchers',
        });
      }
    },

    viewRedemptions(voucher) {
      this.$swal({
        icon: 'info',
        title: `Redemptions for ${voucher.code}`,
        text: `${voucher.currentRedemptions} redemptions. Detail view coming soon.`,
      });
    },

    toggleVoucherStatus(voucher) {
      const newStatus = voucher.status === 'active' ? 'inactive' : 'active';
      this.$swal({
        icon: 'success',
        title: 'Status Updated',
        text: `Voucher ${voucher.code} is now ${newStatus}`,
      });
    },

    exportVouchers() {
      const csvContent = this.convertToCSV(this.sampleVouchers);
      this.downloadCSV(csvContent, 'vouchers-export.csv');
    },

    convertToCSV(data) {
      if (!data || data.length === 0) return '';
      const headers = ['Code', 'Amount', 'Status', 'Max Redemptions', 'Current Redemptions', 'Valid From', 'Valid Until'];
      const rows = data.map((v) => [
        v.code,
        v.amount,
        v.status,
        v.maxRedemptions || 'Unlimited',
        v.currentRedemptions,
        v.validFrom,
        v.validUntil,
      ]);
      return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    },

    downloadCSV(csvData, filename) {
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

    resetPromotionForm() {
      this.promotionForm = {
        campaignName: '',
        type: 'fixed_bonus',
        bonusAmount: '',
        bonusPercentage: '',
        tiers: [],
        firstTimeOnly: false,
        minTopUp: '',
        maxBonusPerUser: '',
        validFrom: '',
        validUntil: '',
        targetUsers: 'all',
        totalBudget: '',
      };
    },

    resetVoucherForm() {
      this.voucherForm = {
        code: '',
        amount: '',
        maxRedemptions: null,
        perUserLimit: 1,
        validFrom: '',
        validUntil: '',
        description: '',
        firstTimeOnly: false,
        minTopUp: '',
      };
    },

    resetBulkForm() {
      this.bulkForm = {
        prefix: '',
        quantity: '',
        amount: '',
        validFrom: '',
        validUntil: '',
        perUserLimit: 1,
      };
    },
  },
};
</script>

<style scoped>
.vouchers-page {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 20px;
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
  margin: 0;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 2px solid #e5e7eb;
}

.tab {
  padding: 12px 24px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.2s;
}

.tab.active {
  color: #1a7a89;
  border-bottom-color: #1a7a89;
}

/* Content */
.tab-content {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.content-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 10px;
}

/* Promotions */
.promotions-list {
  display: grid;
  gap: 20px;
}

.promotion-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
}

.promotion-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.promotion-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.promo-info {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;
}

.info-row {
  display: flex;
  gap: 8px;
  font-size: 14px;
}

.info-row .label {
  font-weight: 600;
  color: #6b7280;
}

/* Filters */
.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.filter-input,
.filter-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.filter-input {
  flex: 1;
  max-width: 300px;
}

/* Vouchers Grid */
.vouchers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.voucher-card {
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.voucher-code {
  font-size: 20px;
  font-weight: 700;
  font-family: monospace;
  color: #1a7a89;
  margin-bottom: 12px;
}

.voucher-amount {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
}

.voucher-info {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 16px;
}

.voucher-info > div {
  margin-bottom: 6px;
}

.voucher-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.tag {
  display: inline-block;
  padding: 2px 8px;
  background: #e0f2fe;
  color: #075985;
  border-radius: 4px;
  font-size: 11px;
  margin: 2px;
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

.status-badge.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.status-badge.expired {
  background: #f3f4f6;
  color: #6b7280;
}

.status-badge.depleted {
  background: #fef3c7;
  color: #92400e;
}

/* Modal */
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

.modal-content.large {
  max-width: 800px;
}

.modal-content h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 20px 0;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-control,
.form-control-sm {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.form-control-sm {
  padding: 6px 10px;
  font-size: 13px;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radio-label,
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 400;
  cursor: pointer;
}

.radio-label input,
.checkbox-label input {
  width: auto;
  margin: 0;
}

.form-section {
  margin: 24px 0;
  padding: 16px;
  background: #f9fafb;
  border-radius: 6px;
}

.form-section h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #1f2937;
}

.tier-row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}

.tier-row span {
  font-size: 13px;
  color: #6b7280;
}

.btn-remove {
  padding: 4px 8px;
  background: #fee2e2;
  color: #991b1b;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.btn-add {
  padding: 6px 12px;
  background: #e0f2fe;
  color: #075985;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* Buttons */
.btn-primary,
.btn-secondary,
.btn-sm,
.btn-icon {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-primary {
  background: #1a7a89;
  color: white;
}

.btn-primary:hover {
  background: #156572;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #1f2937;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.btn-icon {
  padding: 6px 12px;
  background: transparent;
  color: #1a7a89;
  border: 1px solid #1a7a89;
}
</style>
