# Transfer Funds & Point Redemption Implementation Guide

## Overview

This document outlines the implementation of two new wallet features:
1. **Transfer Funds** - Users can send money to other users
2. **Redeem Points** - Users can convert loyalty points to wallet balance

---

## Database Schema

### Tables Created

#### 1. `wallet_transfers`
Tracks all money transfers between users.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (PK) | Auto-increment ID |
| `transfer_id` | VARCHAR(50) | Unique ID (Format: TRF-YYYYMMDD-XXXXX) |
| `sender_user_id` | INT | User sending money |
| `receiver_user_id` | INT | User receiving money |
| `amount` | DECIMAL(10,2) | Transfer amount |
| `fee` | DECIMAL(10,2) | Transfer fee charged |
| `sender_balance_before` | DECIMAL(10,2) | Sender balance before |
| `sender_balance_after` | DECIMAL(10,2) | Sender balance after |
| `receiver_balance_before` | DECIMAL(10,2) | Receiver balance before |
| `receiver_balance_after` | DECIMAL(10,2) | Receiver balance after |
| `status` | ENUM | pending, completed, failed, cancelled, refunded |
| `sender_transaction_id` | VARCHAR(50) | Link to sender's wallet_transaction |
| `receiver_transaction_id` | VARCHAR(50) | Link to receiver's wallet_transaction |
| `created_at` | DATETIME | Transfer creation time |
| `completed_at` | DATETIME | Transfer completion time |
| `cancelled_by` | INT | Admin who cancelled (if applicable) |

#### 2. `point_redemptions`
Tracks point-to-money conversions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (PK) | Auto-increment ID |
| `redemption_id` | VARCHAR(50) | Unique ID (Format: PTS-YYYYMMDD-XXXXX) |
| `user_id` | INT | User redeeming points |
| `points_redeemed` | INT | Number of points redeemed |
| `points_balance_before` | INT | Points balance before |
| `points_balance_after` | INT | Points balance after |
| `money_received` | DECIMAL(10,2) | Money credited to wallet |
| `conversion_rate` | DECIMAL(10,4) | Points per 1 THB |
| `wallet_balance_before` | DECIMAL(10,2) | Wallet balance before |
| `wallet_balance_after` | DECIMAL(10,2) | Wallet balance after |
| `status` | ENUM | pending, approved, rejected, completed, cancelled |
| `transaction_id` | VARCHAR(50) | Link to wallet_transaction |
| `approved_by` | INT | Admin who approved |
| `rejected_by` | INT | Admin who rejected |
| `created_at` | DATETIME | Redemption request time |
| `completed_at` | DATETIME | Redemption completion time |

#### 3. `wallet_transfer_settings`
Configuration for transfer and redemption features.

| Key | Default Value | Description |
|-----|---------------|-------------|
| `transfer_fee_percentage` | 0 | Transfer fee percentage (0-100) |
| `transfer_fee_fixed` | 0 | Fixed transfer fee in THB |
| `transfer_min_amount` | 1 | Minimum transfer amount |
| `transfer_max_amount` | 50000 | Maximum transfer amount |
| `transfer_daily_limit` | 100000 | Daily transfer limit per user |
| `point_conversion_rate` | 1 | Points required per 1 THB |
| `point_min_redemption` | 100 | Minimum points for redemption |
| `point_redemption_requires_approval` | false | Auto-approve or require admin approval |

---

## API Endpoints

### User Endpoints (Mobile App / Frontend)

#### 1. Transfer Funds
```http
POST /api/wallet/transfer
```

**Request Body:**
```json
{
  "receiverUserId": 123,
  "amount": 100.00,
  "description": "Payment for dinner"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transfer": {
      "transferId": "TRF-20260315-00001",
      "senderUserId": 456,
      "receiverUserId": 123,
      "amount": 100.00,
      "fee": 0.00,
      "netAmount": 100.00,
      "status": "completed",
      "createdAt": "2026-03-15T10:30:00.000Z"
    },
    "newBalance": 1400.00
  }
}
```

#### 2. Redeem Points
```http
POST /api/wallet/redeem-points
```

**Request Body:**
```json
{
  "points": 500,
  "description": "Monthly points redemption"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "redemption": {
      "redemptionId": "PTS-20260315-00001",
      "pointsRedeemed": 500,
      "moneyReceived": 500.00,
      "conversionRate": 1.0000,
      "status": "completed",
      "createdAt": "2026-03-15T10:30:00.000Z"
    },
    "newWalletBalance": 1900.00,
    "newPointsBalance": 1500
  }
}
```

#### 3. Get User Transfers
```http
GET /api/wallet/transfers?limit=20&offset=0
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transfers": [
      {
        "transferId": "TRF-20260315-00001",
        "type": "sent",
        "amount": 100.00,
        "otherUser": {
          "id": 123,
          "email": "receiver@example.com",
          "name": "John Doe"
        },
        "status": "completed",
        "createdAt": "2026-03-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 10,
      "limit": 20,
      "offset": 0
    }
  }
}
```

#### 4. Get User Point Redemptions
```http
GET /api/wallet/point-redemptions?limit=20&offset=0
```

**Response:**
```json
{
  "success": true,
  "data": {
    "redemptions": [
      {
        "redemptionId": "PTS-20260315-00001",
        "pointsRedeemed": 500,
        "moneyReceived": 500.00,
        "status": "completed",
        "createdAt": "2026-03-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 5,
      "limit": 20,
      "offset": 0
    }
  }
}
```

### Admin Endpoints

#### 5. Get All Transfers
```http
GET /api/wallet-admin/transfers?limit=50&offset=0&status=completed
```

**Query Parameters:**
- `limit` - Results per page
- `offset` - Pagination offset
- `status` - Filter by status
- `senderUserId` - Filter by sender
- `receiverUserId` - Filter by receiver
- `fromDate` - Start date
- `toDate` - End date

**Response:**
```json
{
  "success": true,
  "data": {
    "transfers": [
      {
        "transferId": "TRF-20260315-00001",
        "sender": {
          "id": 456,
          "email": "sender@example.com",
          "name": "Jane Smith"
        },
        "receiver": {
          "id": 123,
          "email": "receiver@example.com",
          "name": "John Doe"
        },
        "amount": 100.00,
        "fee": 0.00,
        "status": "completed",
        "createdAt": "2026-03-15T10:30:00.000Z",
        "completedAt": "2026-03-15T10:30:01.000Z"
      }
    ],
    "pagination": {
      "total": 150,
      "limit": 50,
      "offset": 0
    }
  }
}
```

#### 6. Get All Point Redemptions
```http
GET /api/wallet-admin/point-redemptions?limit=50&offset=0&status=pending
```

**Query Parameters:**
- `limit` - Results per page
- `offset` - Pagination offset
- `status` - Filter by status
- `userId` - Filter by user
- `fromDate` - Start date
- `toDate` - End date

**Response:**
```json
{
  "success": true,
  "data": {
    "redemptions": [
      {
        "redemptionId": "PTS-20260315-00002",
        "user": {
          "id": 789,
          "email": "user@example.com",
          "name": "Alice Johnson"
        },
        "pointsRedeemed": 1000,
        "moneyToReceive": 1000.00,
        "status": "pending",
        "createdAt": "2026-03-15T11:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 25,
      "limit": 50,
      "offset": 0
    }
  }
}
```

#### 7. Cancel Transfer
```http
POST /api/wallet-admin/transfer/cancel
```

**Request Body:**
```json
{
  "transferId": "TRF-20260315-00001",
  "reason": "Fraudulent activity detected"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transferId": "TRF-20260315-00001",
    "status": "cancelled",
    "refunded": true,
    "message": "Transfer cancelled and funds returned to sender"
  }
}
```

#### 8. Approve Point Redemption
```http
POST /api/wallet-admin/point-redemption/approve
```

**Request Body:**
```json
{
  "redemptionId": "PTS-20260315-00002"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "redemptionId": "PTS-20260315-00002",
    "status": "completed",
    "message": "Point redemption approved and processed"
  }
}
```

#### 9. Reject Point Redemption
```http
POST /api/wallet-admin/point-redemption/reject
```

**Request Body:**
```json
{
  "redemptionId": "PTS-20260315-00002",
  "reason": "Insufficient verification"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "redemptionId": "PTS-20260315-00002",
    "status": "rejected",
    "message": "Point redemption rejected"
  }
}
```

#### 10. Get Transfer Settings
```http
GET /api/wallet-admin/transfer-settings
```

**Response:**
```json
{
  "success": true,
  "data": {
    "settings": {
      "transferFeePercentage": 0,
      "transferFeeFixed": 0,
      "transferMinAmount": 1,
      "transferMaxAmount": 50000,
      "transferDailyLimit": 100000,
      "pointConversionRate": 1,
      "pointMinRedemption": 100,
      "pointRedemptionRequiresApproval": false
    }
  }
}
```

#### 11. Update Transfer Settings
```http
PUT /api/wallet-admin/transfer-settings
```

**Request Body:**
```json
{
  "transferFeePercentage": 1.5,
  "transferFeeFixed": 5,
  "pointConversionRate": 2
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Settings updated successfully",
    "settings": {
      "transferFeePercentage": 1.5,
      "transferFeeFixed": 5,
      "pointConversionRate": 2
    }
  }
}
```

---

## Transaction Statuses

### Transfer Statuses
- **pending** - Transfer initiated, awaiting processing
- **completed** - Transfer successful, funds moved
- **failed** - Transfer failed due to insufficient funds or error
- **cancelled** - Transfer cancelled by admin
- **refunded** - Transfer reversed, funds returned to sender

### Point Redemption Statuses
- **pending** - Redemption requested, awaiting approval (if required)
- **approved** - Admin approved, awaiting processing
- **rejected** - Admin rejected the request
- **completed** - Points deducted, money credited
- **cancelled** - Request cancelled

---

## Admin Panel Pages

### 1. Transfers Management (`/wallets/transfers-management`)

**Features:**
- View all transfers (sent and received)
- Filter by:
  - Status (pending, completed, failed, cancelled)
  - Date range
  - Sender/Receiver
  - Amount range
- Search by transfer ID
- Cancel transfers (with reason)
- Export to CSV

**UI Elements:**
- Transfer list table with columns:
  - Transfer ID
  - Sender
  - Receiver
  - Amount
  - Fee
  - Status
  - Date
  - Actions (View, Cancel)
- Status filter dropdown
- Date range picker
- Search box
- Export button

### 2. Point Redemptions Management (`/wallets/point-redemptions`)

**Features:**
- View all point redemption requests
- Filter by:
  - Status (pending, approved, rejected, completed)
  - Date range
  - User
- Approve/Reject pending requests
- View redemption history
- Export to CSV

**UI Elements:**
- Redemption list table with columns:
  - Redemption ID
  - User
  - Points Redeemed
  - Money Amount
  - Status
  - Date
  - Actions (Approve, Reject, View)
- Pending requests highlighted
- Approval/Rejection modal with reason
- Batch approval option
- Export button

### 3. Transfer Settings (`/wallets/settings`)

**Features:**
- Configure transfer fees
- Set transfer limits
- Configure point conversion rate
- Set minimum redemption amount
- Toggle auto-approval for redemptions

**UI Elements:**
- Form with settings:
  - Transfer fee percentage (%)
  - Fixed transfer fee (฿)
  - Minimum transfer amount (฿)
  - Maximum transfer amount (฿)
  - Daily transfer limit per user (฿)
  - Point conversion rate (points per ฿1)
  - Minimum points for redemption
  - Auto-approve redemptions (toggle)
- Save button
- Reset to defaults button

---

## Implementation Files

### Backend Files Created/Modified:

1. **Database Migration:**
   - `/packages/backend/database/migrations/wallet_transfers_points.sql`

2. **Routes:**
   - `/packages/backend/api/api/config/routes.json` (updated)

3. **Controllers (To Be Implemented):**
   - `/packages/backend/api/wallet/controllers/admin.js` - Add transfer & redemption handlers

4. **Services (To Be Implemented):**
   - `/packages/backend/api/wallet/services/transfer.js` - Transfer logic
   - `/packages/backend/api/wallet/services/redemption.js` - Redemption logic

### Frontend Files To Be Created:

1. **Admin Pages:**
   - `/packages/admin/pages/wallets/transfers-management.vue`
   - `/packages/admin/pages/wallets/point-redemptions.vue`
   - `/packages/admin/pages/wallets/settings.vue`

2. **Services:**
   - Update `/packages/admin/services/walletService.js` with new methods

---

## Security Considerations

1. **Transfer Security:**
   - Verify sender has sufficient balance
   - Prevent self-transfers
   - Implement daily limits
   - Log all transactions
   - Use database transactions to ensure atomicity

2. **Point Redemption Security:**
   - Verify user has sufficient points
   - Prevent negative balances
   - Require approval for large amounts
   - Track conversion rates
   - Prevent duplicate redemptions

3. **Admin Actions:**
   - Log all admin actions (cancellations, approvals)
   - Require authentication for all endpoints
   - Implement role-based permissions
   - Audit trail for settings changes

---

## Testing Checklist

### Transfer Tests:
- [ ] Successful transfer between users
- [ ] Transfer with insufficient balance
- [ ] Transfer with fees
- [ ] Transfer exceeding daily limit
- [ ] Transfer cancellation and refund
- [ ] Self-transfer prevention

### Point Redemption Tests:
- [ ] Successful redemption (auto-approve)
- [ ] Redemption requiring approval
- [ ] Redemption with insufficient points
- [ ] Redemption below minimum
- [ ] Redemption approval by admin
- [ ] Redemption rejection by admin

### Admin Tests:
- [ ] View all transfers
- [ ] Filter and search transfers
- [ ] Cancel transfer
- [ ] View redemption requests
- [ ] Approve redemption
- [ ] Reject redemption
- [ ] Update settings
- [ ] Export data to CSV

---

## Next Steps

1. **Complete Backend Implementation:**
   - Implement controller handlers
   - Create service methods for transfer logic
   - Create service methods for redemption logic
   - Add validation and error handling

2. **Create Admin Pages:**
   - Build transfers management page
   - Build point redemptions page
   - Build settings page
   - Add to navigation menu

3. **Update Frontend Service:**
   - Add transfer methods
   - Add redemption methods
   - Add settings methods

4. **Testing:**
   - Unit tests for services
   - Integration tests for APIs
   - E2E tests for admin pages

5. **Documentation:**
   - API documentation
   - User guide for admins
   - Mobile app integration guide

---

**Status:** Database tables created, API routes defined, implementation in progress.
**Next:** Implement controller handlers and admin pages.
