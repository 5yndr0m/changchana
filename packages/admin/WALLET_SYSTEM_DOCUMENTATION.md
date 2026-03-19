# Wallet System Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Database Schema](#database-schema)
3. [Status Definitions](#status-definitions)
4. [API Reference](#api-reference)
5. [Transaction Flows](#transaction-flows)
6. [Admin Panel Features](#admin-panel-features)
7. [Integration Guide](#integration-guide)
8. [Security & Best Practices](#security--best-practices)

---

## System Overview

The wallet system is a digital wallet implementation that allows users to:
- Store monetary balance in THB (Thai Baht)
- Top up balance through various payment methods
- Make payments for services
- Receive refunds and bonuses
- Track transaction history

### Key Features
- Multi-currency support (currently THB)
- Multiple wallet balance types (active, pending, frozen)
- Comprehensive transaction tracking
- Admin management interface
- Automatic transaction ID generation
- Balance audit trail
- Voucher system for promotions
- Financial reporting and analytics

---

## Database Schema

### Table: `wallets`

Stores wallet information for each user.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (PK) | Auto-increment wallet ID |
| `user_id` | INT (UNIQUE) | Reference to users-permissions_user table |
| `balance` | DECIMAL(10,2) | Available balance for use |
| `pending_balance` | DECIMAL(10,2) | Balance pending confirmation |
| `frozen_balance` | DECIMAL(10,2) | Frozen/locked balance |
| `currency` | VARCHAR(3) | Currency code (default: THB) |
| `status` | ENUM | Wallet status: active, frozen, suspended |
| `created_at` | DATETIME | Wallet creation timestamp |
| `updated_at` | DATETIME | Last update timestamp |

**Indexes:**
- Primary Key: `id`
- Unique Index: `user_id`
- Index: `status`

### Table: `wallet_transactions`

Records all wallet transactions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | VARCHAR(50) (PK) | Transaction ID (format: TX-YYYYMMDD-XXXXX) |
| `user_id` | INT | Reference to user |
| `type` | ENUM | Transaction type (see below) |
| `amount` | DECIMAL(10,2) | Transaction amount |
| `balance_before` | DECIMAL(10,2) | Balance before transaction |
| `balance_after` | DECIMAL(10,2) | Balance after transaction |
| `status` | ENUM | Transaction status (see below) |
| `payment_method` | VARCHAR(50) | Payment method used (if applicable) |
| `payment_transaction_id` | VARCHAR(100) | External payment gateway transaction ID |
| `reference_id` | VARCHAR(100) | Reference/tracking ID |
| `description` | TEXT | Transaction description |
| `metadata` | JSON | Additional metadata |
| `created_at` | DATETIME | Transaction creation time |
| `updated_at` | DATETIME | Last update time |
| `completed_at` | DATETIME | Transaction completion time |

**Indexes:**
- Primary Key: `id`
- Index: `user_id`
- Index: `status`
- Index: `type`
- Index: `created_at`
- Index: `reference_id`

### Table: `point_log` (Optional)

Stores loyalty points (if enabled in your system).

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (PK) | Auto-increment ID |
| `user_id` | INT | Reference to user |
| `point` | INT | Points earned/spent |
| `created_at` | DATETIME | Timestamp |

---

## Status Definitions

### Wallet Status

| Status | Description | User Can Transact? |
|--------|-------------|-------------------|
| `active` | Normal operational status | Yes |
| `frozen` | Temporarily suspended by admin | No |
| `suspended` | Account suspended (violation/investigation) | No |

### Transaction Status

| Status | Description | Balance Updated? |
|--------|-------------|-----------------|
| `pending` | Awaiting confirmation/payment | No |
| `completed` | Successfully processed | Yes |
| `failed` | Transaction failed | No |
| `cancelled` | Cancelled by user/admin | No (or reversed) |

### Transaction Types

| Type | Direction | Description |
|------|-----------|-------------|
| `top_up` | Credit | User adds money to wallet |
| `payment` | Debit | User pays for service/product |
| `refund` | Credit | Money returned to wallet |
| `bonus` | Credit | Promotional bonus/reward |
| `adjustment` | Credit/Debit | Admin manual adjustment |
| `withdrawal` | Debit | User withdraws money (if enabled) |

### Payment Methods

| Method | Description |
|--------|-------------|
| `card` | Credit/Debit card via payment gateway |
| `bank_transfer` | Bank transfer/wire |
| `promptpay` | Thai PromptPay QR |
| `truemoney` | TrueMoney wallet |
| `manual` | Manual payment (admin) |

---

## API Reference

Base URL: `http://localhost:7001/api`

### Admin API Endpoints

All admin endpoints require authentication (JWT token).

#### 1. List All Wallets

```http
GET /wallet-admin/wallets
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Results per page (default: 50) |
| `offset` | integer | No | Pagination offset (default: 0) |
| `status` | string | No | Filter by status: active, frozen, suspended |
| `minBalance` | number | No | Minimum balance filter |
| `maxBalance` | number | No | Maximum balance filter |
| `search` | string | No | Search by email/name |

**Response:**
```json
{
  "success": true,
  "data": {
    "wallets": [
      {
        "id": 123,
        "userId": 456,
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "balance": 1500.00,
        "pendingBalance": 0.00,
        "frozenBalance": 0.00,
        "totalBalance": 1500.00,
        "currency": "THB",
        "status": "active",
        "createdAt": "2026-01-15T10:30:00.000Z",
        "lastTransaction": "2026-03-14T14:20:00.000Z"
      }
    ],
    "pagination": {
      "total": 150,
      "limit": 50,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

#### 2. Get Wallet Detail

```http
GET /wallet-admin/wallet/:userId
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | integer | Yes | User ID |

**Response:**
```json
{
  "success": true,
  "data": {
    "wallet": {
      "userId": 456,
      "balance": 1500.00,
      "pendingBalance": 0.00,
      "frozenBalance": 0.00,
      "totalBalance": 1500.00,
      "currency": "THB",
      "status": "active",
      "points": 250,
      "lastTransaction": "2026-03-14T14:20:00.000Z"
    },
    "user": {
      "id": 456,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "0812345678",
      "createdAt": "2025-12-01T08:00:00.000Z"
    },
    "recentTransactions": [
      {
        "id": "TX-20260314-00011",
        "type": "top_up",
        "amount": 500.00,
        "status": "completed",
        "createdAt": "2026-03-14T14:20:00.000Z"
      }
    ]
  }
}
```

#### 3. Adjust Balance

```http
POST /wallet-admin/wallet/adjust
```

**Request Body:**
```json
{
  "userId": 456,
  "amount": 100.00,
  "type": "credit",
  "description": "Compensation for service issue"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | integer | Yes | User ID |
| `amount` | number | Yes | Amount to adjust (positive number) |
| `type` | string | Yes | "credit" or "debit" |
| `description` | string | Yes | Reason for adjustment |

**Response:**
```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": "TX-20260315-00015",
      "userId": 456,
      "type": "adjustment",
      "amount": 100.00,
      "balanceBefore": 1500.00,
      "balanceAfter": 1600.00,
      "status": "completed",
      "description": "Compensation for service issue",
      "createdAt": "2026-03-15T10:00:00.000Z"
    },
    "newBalance": 1600.00
  }
}
```

#### 4. Freeze/Unfreeze Wallet

```http
POST /wallet-admin/wallet/freeze
```

**Request Body:**
```json
{
  "userId": 456,
  "action": "freeze",
  "reason": "Suspicious activity detected"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | integer | Yes | User ID |
| `action` | string | Yes | "freeze" or "unfreeze" |
| `reason` | string | Yes | Reason for action |

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": 456,
    "status": "frozen",
    "message": "Wallet frozen successfully"
  }
}
```

#### 5. Get All Transactions

```http
GET /wallet-admin/transactions
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Results per page (default: 50) |
| `offset` | integer | No | Pagination offset (default: 0) |
| `userId` | integer | No | Filter by user ID |
| `type` | string | No | Filter by type |
| `status` | string | No | Filter by status |
| `minAmount` | number | No | Minimum amount |
| `maxAmount` | number | No | Maximum amount |
| `fromDate` | string | No | Start date (ISO format) |
| `toDate` | string | No | End date (ISO format) |
| `paymentMethod` | string | No | Filter by payment method |
| `referenceId` | string | No | Search by reference ID |

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "TX-20260315-00001",
        "userId": 86572,
        "user": {
          "firstName": "Kanyanut",
          "lastName": "Teeranupattana",
          "email": "user@example.com"
        },
        "type": "adjustment",
        "amount": 500.00,
        "balanceBefore": 0.00,
        "balanceAfter": 500.00,
        "status": "completed",
        "paymentMethod": null,
        "paymentTransactionId": null,
        "referenceId": null,
        "description": "Initial bonus",
        "createdAt": "2026-03-15T17:28:15.000Z",
        "completedAt": "2026-03-15T17:28:15.000Z"
      }
    ],
    "pagination": {
      "limit": 50,
      "offset": 0,
      "hasMore": false
    }
  }
}
```

#### 6. Process Refund

```http
POST /wallet-admin/refund
```

**Request Body:**
```json
{
  "transactionId": "TX-20260315-00001",
  "amount": 500.00,
  "reason": "Service cancellation"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `transactionId` | string | Yes | Original transaction ID |
| `amount` | number | No | Partial refund amount (omit for full) |
| `reason` | string | Yes | Refund reason |

**Response:**
```json
{
  "success": true,
  "data": {
    "refundTransaction": {
      "id": "TX-20260315-00016",
      "type": "refund",
      "amount": 500.00,
      "status": "completed"
    },
    "originalTransaction": "TX-20260315-00001"
  }
}
```

#### 7. Get Reports

```http
GET /wallet-admin/reports
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `reportType` | string | No | "summary", "daily", "monthly" (default: summary) |
| `fromDate` | string | No | Start date (ISO format) |
| `toDate` | string | No | End date (ISO format) |

**Response:**
```json
{
  "success": true,
  "data": {
    "reportType": "summary",
    "period": {
      "from": "2026-03-01T00:00:00.000Z",
      "to": "2026-03-15T23:59:59.000Z"
    },
    "summary": {
      "totalWalletBalance": 2114.00,
      "totalPendingBalance": 0.00,
      "totalFrozenBalance": 0.00,
      "activeWallets": 133641,
      "frozenWallets": 0,
      "suspendedWallets": 0
    },
    "transactionSummary": {
      "totalTransactions": 14,
      "totalVolume": 3850.00,
      "byType": {
        "top_up": {
          "count": 6,
          "volume": 2800.00
        },
        "payment": {
          "count": 4,
          "volume": 700.00
        },
        "refund": {
          "count": 1,
          "volume": 150.00
        }
      }
    },
    "revenue": {
      "topUpFees": 64.00,
      "withdrawalFees": 0.00,
      "totalRevenue": 64.00
    }
  }
}
```

#### 8. Create Voucher

```http
POST /wallet-admin/wallet/voucher/create
```

**Request Body:**
```json
{
  "code": "WELCOME2026",
  "amount": 100.00,
  "maxUses": 1000,
  "expiresAt": "2026-12-31T23:59:59.000Z",
  "description": "Welcome bonus voucher"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `code` | string | Yes | Voucher code (unique) |
| `amount` | number | Yes | Voucher value |
| `maxUses` | integer | No | Maximum redemptions |
| `expiresAt` | string | No | Expiration date (ISO format) |
| `description` | string | No | Voucher description |

**Response:**
```json
{
  "success": true,
  "data": {
    "voucher": {
      "id": 123,
      "code": "WELCOME2026",
      "amount": 100.00,
      "maxUses": 1000,
      "currentUses": 0,
      "expiresAt": "2026-12-31T23:59:59.000Z",
      "status": "active"
    }
  }
}
```

---

## Transaction Flows

### 1. Top-Up Flow (User Initiated)

```
┌─────────┐         ┌──────────┐         ┌─────────┐         ┌────────┐
│  User   │         │  Backend │         │ Payment │         │ Wallet │
│   App   │         │   API    │         │ Gateway │         │Service │
└────┬────┘         └────┬─────┘         └────┬────┘         └───┬────┘
     │                   │                     │                  │
     │ 1. Initiate       │                     │                  │
     │    Top-up         │                     │                  │
     │──────────────────>│                     │                  │
     │                   │                     │                  │
     │                   │ 2. Create pending   │                  │
     │                   │    transaction      │                  │
     │                   │────────────────────────────────────────>│
     │                   │                     │                  │
     │                   │                     │                  │
     │                   │ 3. Request payment  │                  │
     │                   │────────────────────>│                  │
     │                   │                     │                  │
     │                   │ 4. Payment URL      │                  │
     │                   │<────────────────────│                  │
     │                   │                     │                  │
     │ 5. Redirect       │                     │                  │
     │<──────────────────│                     │                  │
     │                   │                     │                  │
     │ 6. Complete       │                     │                  │
     │   payment         │                     │                  │
     │──────────────────────────────────────>│                  │
     │                   │                     │                  │
     │                   │ 7. Webhook/Callback │                  │
     │                   │<────────────────────│                  │
     │                   │                     │                  │
     │                   │ 8. Update transaction                  │
     │                   │    to completed &   │                  │
     │                   │    credit balance   │                  │
     │                   │────────────────────────────────────────>│
     │                   │                     │                  │
     │                   │ 9. Confirmation     │                  │
     │<──────────────────│                     │                  │
     │                   │                     │                  │
```

**Steps:**
1. User initiates top-up with amount
2. Backend creates pending transaction with status "pending"
3. Backend requests payment from gateway (Omise, 2C2P, etc.)
4. Payment gateway returns payment URL
5. User redirected to payment page
6. User completes payment
7. Payment gateway sends webhook to backend
8. Backend updates transaction to "completed" and credits wallet balance
9. User receives confirmation

### 2. Payment Flow (Service Purchase)

```
┌─────────┐         ┌──────────┐         ┌────────┐
│  User   │         │  Backend │         │ Wallet │
│   App   │         │   API    │         │Service │
└────┬────┘         └────┬─────┘         └───┬────┘
     │                   │                    │
     │ 1. Purchase       │                    │
     │    service        │                    │
     │──────────────────>│                    │
     │                   │                    │
     │                   │ 2. Check balance   │
     │                   │───────────────────>│
     │                   │                    │
     │                   │ 3. Balance OK      │
     │                   │<───────────────────│
     │                   │                    │
     │                   │ 4. Debit wallet    │
     │                   │    & create txn    │
     │                   │───────────────────>│
     │                   │                    │
     │                   │ 5. Success         │
     │                   │<───────────────────│
     │                   │                    │
     │ 6. Confirmation   │                    │
     │<──────────────────│                    │
     │                   │                    │
```

**Steps:**
1. User purchases service
2. Backend checks wallet balance
3. If sufficient, proceed
4. Backend debits wallet and creates "payment" transaction
5. Transaction completed
6. User receives confirmation

### 3. Refund Flow (Admin Initiated)

```
┌─────────┐         ┌──────────┐         ┌────────┐
│  Admin  │         │  Backend │         │ Wallet │
│  Panel  │         │   API    │         │Service │
└────┬────┘         └────┬─────┘         └───┬────┘
     │                   │                    │
     │ 1. Issue refund   │                    │
     │──────────────────>│                    │
     │                   │                    │
     │                   │ 2. Validate        │
     │                   │    original txn    │
     │                   │───────────────────>│
     │                   │                    │
     │                   │ 3. Create refund   │
     │                   │    & credit wallet │
     │                   │───────────────────>│
     │                   │                    │
     │                   │ 4. Success         │
     │                   │<───────────────────│
     │                   │                    │
     │ 5. Confirmation   │                    │
     │<──────────────────│                    │
     │                   │                    │
```

### 4. Balance Adjustment Flow (Admin)

```
┌─────────┐         ┌──────────┐         ┌────────┐
│  Admin  │         │  Backend │         │ Wallet │
│  Panel  │         │   API    │         │Service │
└────┬────┘         └────┬─────┘         └───┬────┘
     │                   │                    │
     │ 1. Manual         │                    │
     │    adjustment     │                    │
     │──────────────────>│                    │
     │                   │                    │
     │                   │ 2. Create          │
     │                   │    adjustment txn  │
     │                   │    & update balance│
     │                   │───────────────────>│
     │                   │                    │
     │                   │ 3. Success         │
     │                   │<───────────────────│
     │                   │                    │
     │ 4. Confirmation   │                    │
     │<──────────────────│                    │
     │                   │                    │
```

---

## Admin Panel Features

### Pages Available

1. **Wallet Management** (`/wallets`)
   - View all user wallets
   - Search and filter by status, balance
   - View wallet details
   - Export to CSV

2. **Wallet Detail** (`/wallets/detail/:userId`)
   - View user information
   - Current balances (available, pending, frozen)
   - Recent transactions
   - Adjust balance
   - Freeze/unfreeze wallet

3. **Transactions** (`/wallets/transactions`)
   - View all transactions across users
   - Filter by date, type, status, amount
   - Search by reference ID
   - Process refunds
   - Export to CSV

4. **Reports** (`/wallets/reports`)
   - Financial summary
   - Transaction volume analysis
   - Revenue tracking
   - Wallet statistics
   - Date range filtering

5. **Vouchers** (`/wallets/vouchers`)
   - Create promotional vouchers
   - Manage voucher codes
   - Track redemptions
   - Set expiration dates

### Admin Actions

#### Adjust Balance
- Add or remove funds from user wallet
- Requires description/reason
- Creates "adjustment" transaction
- Records admin who made change

#### Freeze Wallet
- Prevents user from making transactions
- Wallet status changed to "frozen"
- Requires reason
- Reversible (unfreeze)

#### Process Refund
- Full or partial refund
- Creates new "refund" transaction
- Credits user wallet immediately
- Links to original transaction

#### Export Data
- Export wallets to CSV
- Export transactions to CSV
- Includes all relevant fields
- Useful for accounting/reconciliation

---

## Integration Guide

### Frontend Integration (Nuxt.js)

The wallet service is already integrated via plugin system.

**Service Location:** `/packages/admin/services/walletService.js`

**Usage in Components:**
```javascript
export default {
  async mounted() {
    // Get all wallets
    const walletsResponse = await this.$walletService.getWallets({
      limit: 50,
      offset: 0,
      status: 'active'
    });

    // Get wallet detail
    const detailResponse = await this.$walletService.getWalletDetail(userId);

    // Adjust balance
    await this.$walletService.adjustBalance({
      userId: 123,
      amount: 100,
      type: 'credit',
      description: 'Bonus'
    });

    // Freeze wallet
    await this.$walletService.freezeWallet({
      userId: 123,
      action: 'freeze',
      reason: 'Suspicious activity'
    });

    // Get transactions
    const txResponse = await this.$walletService.getTransactions({
      userId: 123,
      limit: 20
    });

    // Process refund
    await this.$walletService.refundTransaction({
      transactionId: 'TX-20260315-00001',
      reason: 'Service cancellation'
    });

    // Get reports
    const reportsResponse = await this.$walletService.getReports({
      reportType: 'summary',
      fromDate: '2026-03-01',
      toDate: '2026-03-31'
    });

    // Create voucher
    await this.$walletService.createVoucher({
      code: 'WELCOME2026',
      amount: 100,
      maxUses: 1000
    });
  }
}
```

### Backend Integration (Strapi)

**Service Location:** `/packages/backend/api/wallet/services/wallet.js`

**Controller Location:** `/packages/backend/api/wallet/controllers/admin.js`

**Routes Configuration:** `/packages/backend/api/api/config/routes.json`

**Basic Usage:**
```javascript
// In Strapi controller or service
const walletService = strapi.services.wallet;

// Create/Get wallet
const wallet = await walletService.getOrCreateWallet(userId);

// Get balance
const balance = await walletService.getBalance(userId);

// Credit wallet
const transaction = await walletService.credit({
  userId: 123,
  amount: 100,
  type: 'bonus',
  description: 'Welcome bonus'
});

// Debit wallet
const transaction = await walletService.debit({
  userId: 123,
  amount: 50,
  type: 'payment',
  description: 'Service payment'
});
```

### Payment Gateway Integration

When integrating with payment gateways (Omise, 2C2P, etc.):

1. **Create pending transaction** before redirecting to payment
2. **Store payment gateway transaction ID** in `payment_transaction_id`
3. **Set up webhook endpoint** to receive payment confirmations
4. **Update transaction status** to "completed" when payment succeeds
5. **Credit wallet balance** only after payment confirmation

**Example:**
```javascript
// 1. Create pending transaction
const transaction = await strapi.connections.default.raw(`
  INSERT INTO wallet_transactions
  (id, user_id, type, amount, status, payment_method, description)
  VALUES (?, ?, 'top_up', ?, 'pending', ?, ?)
`, [transactionId, userId, amount, paymentMethod, description]);

// 2. Request payment from gateway
const paymentUrl = await paymentGateway.createCharge({
  amount: amount,
  currency: 'THB',
  returnUrl: `${baseUrl}/payment/callback`,
  metadata: { transactionId }
});

// 3. In webhook handler
const updateTx = await strapi.connections.default.raw(`
  UPDATE wallet_transactions
  SET status = 'completed',
      payment_transaction_id = ?,
      completed_at = NOW()
  WHERE id = ?
`, [gatewayTxId, transactionId]);

// 4. Credit wallet
await strapi.connections.default.raw(`
  UPDATE wallets
  SET balance = balance + ?
  WHERE user_id = ?
`, [amount, userId]);
```

---

## Security & Best Practices

### 1. Authentication & Authorization

- **All admin endpoints require authentication** with JWT token
- Implement role-based access control (RBAC)
- Only staff/admin roles should access wallet-admin endpoints
- Log all admin actions for audit trail

**Recommended Strapi Policies:**
```javascript
// Policy: isAdmin
module.exports = async (ctx, next) => {
  if (ctx.state.user && ctx.state.user.role.type === 'admin') {
    return await next();
  }
  ctx.unauthorized('Admin access only');
};
```

### 2. Transaction Integrity

- **Use database transactions** for balance updates
- **Lock wallet rows** during balance changes to prevent race conditions
- **Maintain audit trail** with `balance_before` and `balance_after`
- **Validate balances** before any debit operation

**Example with database transaction:**
```javascript
const trx = await strapi.connections.default.transaction();
try {
  // Lock wallet row
  await trx.raw('SELECT * FROM wallets WHERE user_id = ? FOR UPDATE', [userId]);

  // Update balance
  await trx.raw('UPDATE wallets SET balance = balance + ? WHERE user_id = ?', [amount, userId]);

  // Create transaction record
  await trx.raw('INSERT INTO wallet_transactions (...) VALUES (...)', [...]);

  await trx.commit();
} catch (error) {
  await trx.rollback();
  throw error;
}
```

### 3. Idempotency

- **Use unique transaction IDs** to prevent duplicate processing
- **Check for existing transaction** before creating new one
- **Handle webhook retries** gracefully

### 4. Validation

- **Validate amounts** are positive numbers
- **Check decimal precision** (2 decimal places for THB)
- **Verify user exists** before creating wallet
- **Validate status transitions** (e.g., can't complete failed transaction)

### 5. Error Handling

- **Log all errors** with context (user ID, transaction ID, etc.)
- **Return meaningful error messages** to clients
- **Don't expose sensitive information** in error messages
- **Implement retry logic** for transient failures

### 6. Rate Limiting

- **Limit API requests** per user/IP
- **Prevent balance adjustment spam**
- **Throttle transaction creation**

### 7. Monitoring & Alerts

- **Monitor balance discrepancies**
- **Alert on large transactions**
- **Track failed transactions**
- **Monitor wallet status changes**
- **Daily balance reconciliation**

### 8. Data Privacy

- **Mask sensitive data** in logs
- **Encrypt payment information**
- **Comply with PCI-DSS** if handling card data
- **Implement data retention policies**

### 9. Testing

- **Unit tests** for wallet service methods
- **Integration tests** for API endpoints
- **Load tests** for concurrent transactions
- **Test race conditions** with simultaneous balance updates

### 10. Backup & Recovery

- **Regular database backups**
- **Transaction logs for audit**
- **Ability to replay transactions** if needed
- **Point-in-time recovery** capability

---

## Common Issues & Troubleshooting

### Issue 1: Route Conflicts

**Problem:** Dynamic route `/wallet/:userId` catches specific routes like `/wallet/adjust`

**Solution:** Ensure specific routes are defined BEFORE dynamic routes in `routes.json`

**Correct Order:**
```json
{
  "path": "/api/wallet-admin/wallet/adjust",
  "handler": "api.adjustBalance"
},
{
  "path": "/api/wallet-admin/wallet/:userId",
  "handler": "api.getWalletDetail"
}
```

### Issue 2: Database Column Names

**Problem:** SQL query uses camelCase but database uses snake_case

**Solution:** Use aliases in SQL queries

```sql
SELECT
  u.first_name as firstName,
  u.last_name as lastName
FROM users u
```

### Issue 3: Missing point_log Table

**Problem:** Query fails if optional `point_log` table doesn't exist

**Solution:** Wrap query in try-catch and default to 0

```javascript
try {
  const points = await strapi.connections.default.raw(`
    SELECT SUM(point) as total FROM point_log WHERE user_id = ?
  `, [userId]);
  totalPoints = points[0][0]?.total || 0;
} catch (error) {
  totalPoints = 0; // Table doesn't exist
}
```

### Issue 4: Permission Errors (403 Forbidden)

**Problem:** Admin endpoints return 403 Forbidden

**Solution:** Run permission script

```bash
cd /Users/prachumchanman/Documents/chongjaroen-master/packages/backend
node scripts/set-permissions.js
```

### Issue 5: Transaction ID Conflicts

**Problem:** Duplicate transaction IDs

**Solution:** Use atomic counter or UUID. Current format: `TX-YYYYMMDD-XXXXX`

---

## Changelog

### Version 1.0.0 (March 2026)
- Initial wallet system implementation
- Admin panel with full CRUD operations
- Transaction management
- Financial reporting
- Voucher system
- CSV export functionality

---

## Support & Maintenance

### For Developers

- **Code Location:** `/packages/backend/api/wallet/` and `/packages/admin/`
- **Database Migrations:** Keep schema changes documented
- **API Changes:** Maintain backward compatibility
- **Testing:** Run test suite before deployment

### For Project Owner

- **Admin Access:** Requires admin role in Strapi
- **Database Access:** MySQL on localhost (or production server)
- **Monitoring:** Check reports daily for anomalies
- **Support:** Contact development team for issues

---

## Future Enhancements

### Planned Features
1. **Multi-currency support** - USD, EUR, etc.
2. **Withdrawal functionality** - Allow users to withdraw to bank
3. **Automated reconciliation** - Daily balance verification
4. **Push notifications** - Transaction alerts
5. **Wallet-to-wallet transfer** - P2P transfers
6. **Recurring transactions** - Subscriptions
7. **Transaction limits** - Daily/monthly caps
8. **KYC integration** - Identity verification
9. **Mobile app API** - React Native/Flutter support
10. **Advanced analytics** - Machine learning fraud detection

---

## Contact

For technical support or questions:
- **Backend Issues:** Check `/packages/backend/api/wallet/`
- **Frontend Issues:** Check `/packages/admin/pages/wallets/`
- **Database Issues:** Check connection settings in `config/database.js`
- **Permission Issues:** Run `scripts/set-permissions.js`

---

**Document Version:** 1.0.0
**Last Updated:** March 15, 2026
**Maintained By:** Development Team
