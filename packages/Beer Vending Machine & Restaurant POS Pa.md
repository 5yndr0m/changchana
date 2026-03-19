Beer Vending Machine & Restaurant POS Payment Flows

  1. Beer Vending Machine Flow

  User Flow Diagram

  ┌─────────────────────────────────────────────────────────────┐
  │ Step 1: User Opens Wallet                                   │
  │ ┌─────────────────────────────────┐                        │
  │ │ Tap "Show Payment QR"           │                        │
  │ │ QR Code Generated & Displayed   │                        │
  │ │ Token valid for 15 minutes      │                        │
  │ └─────────────────────────────────┘                        │
  └─────────────────────────────────────────────────────────────┘
                      ↓
  ┌─────────────────────────────────────────────────────────────┐
  │ Step 2: Vending Machine Scans QR                           │
  │ ┌─────────────────────────────────┐                        │
  │ │ Machine reads QR code            │                        │
  │ │ Extracts: userId, token, qrId   │                        │
  │ └─────────────────────────────────┘                        │
  └─────────────────────────────────────────────────────────────┘
                      ↓
  ┌─────────────────────────────────────────────────────────────┐
  │ Step 3: Validate Wallet & Check Minimum Balance            │
  │ API: GET /api/wallet/validate-payment                      │
  │ ┌─────────────────────────────────┐                        │
  │ │ Check: Token valid?             │                        │
  │ │ Check: Wallet active/not frozen?│                        │
  │ │ Check: Balance ≥ ฿500?          │                        │
  │ └─────────────────────────────────┘                        │
  │                                                             │
  │ If Balance < ฿500:                                          │
  │ → Display error on machine                                 │
  │ → Notify user via app                                      │
  │ → STOP                                                      │
  │                                                             │
  │ If Balance ≥ ฿500:                                          │
  │ → Continue to Step 4                                       │
  └─────────────────────────────────────────────────────────────┘
                      ↓
  ┌─────────────────────────────────────────────────────────────┐
  │ Step 4: Reserve Maximum Available Funds                     │
  │ API: POST /api/wallet/vending/reserve                      │
  │ ┌─────────────────────────────────┐                        │
  │ │ Lock available balance          │                        │
  │ │ Create pending transaction      │                        │
  │ │ Return max dispensable volume   │                        │
  │ │ Session ID created              │                        │
  │ └─────────────────────────────────┘                        │
  │                                                             │
  │ Example:                                                    │
  │ Balance: ฿1,250                                             │
  │ Reserved: ฿1,250                                            │
  │ Max Volume: 625ml (฿1,250 ÷ ฿2/ml)                         │
  │ Session: VS-20250308-00123                                  │
  └─────────────────────────────────────────────────────────────┘
                      ↓
  ┌─────────────────────────────────────────────────────────────┐
  │ Step 5: User Dispenses Beer                                │
  │ ┌─────────────────────────────────┐                        │
  │ │ Machine: "Ready - Press Button" │                        │
  │ │ User holds dispense button      │                        │
  │ │                                 │                        │
  │ │ Machine monitors:               │                        │
  │ │ • Volume dispensed (ml)         │                        │
  │ │ • Cost = Volume × ฿2/ml         │                        │
  │ │ • Stop if Cost ≥ Reserved amount│                        │
  │ │ • Stop if button released       │                        │
  │ └─────────────────────────────────┘                        │
  │                                                             │
  │ Real-time display on machine:                               │
  │ ┌─────────────────────────────────┐                        │
  │ │ Dispensing...                   │                        │
  │ │ Volume: 175ml                   │                        │
  │ │ Cost: ฿350                      │                        │
  │ │ Max: 625ml / ฿1,250             │                        │
  │ └─────────────────────────────────┘                        │
  └─────────────────────────────────────────────────────────────┘
                      ↓
  ┌─────────────────────────────────────────────────────────────┐
  │ Step 6: Finalize Transaction                               │
  │ API: POST /api/wallet/vending/finalize                     │
  │ ┌─────────────────────────────────┐                        │
  │ │ Machine sends:                  │                        │
  │ │ • Session ID                    │                        │
  │ │ • Final volume: 175ml           │                        │
  │ │ • Final amount: ฿350            │                        │
  │ │                                 │                        │
  │ │ Backend:                        │                        │
  │ │ • Deduct ฿350 from wallet       │                        │
  │ │ • Release remaining reserved    │                        │
  │ │ • Create transaction record     │                        │
  │ │ • Award points (if applicable)  │                        │
  │ └─────────────────────────────────┘                        │
  │                                                             │
  │ Response:                                                   │
  │ ┌─────────────────────────────────┐                        │
  │ │ Transaction: TX-20250308-00124  │                        │
  │ │ Volume: 175ml                   │                        │
  │ │ Amount: ฿350                    │                        │
  │ │ New Balance: ฿900               │                        │
  │ │ Points Earned: +35 pts          │                        │
  │ └─────────────────────────────────┘                        │
  └─────────────────────────────────────────────────────────────┘
                      ↓
  ┌─────────────────────────────────────────────────────────────┐
  │ Step 7: Display Receipt & Notify User                      │
  │                                                             │
  │ Machine Display:                                            │
  │ ┌─────────────────────────────────┐                        │
  │ │ ✓ Payment Successful            │                        │
  │ │ Volume: 175ml                   │                        │
  │ │ Paid: ฿350                      │                        │
  │ │ Remaining: ฿900                 │                        │
  │ │                                 │                        │
  │ │ [Dispense More] [Finish]        │                        │
  │ └─────────────────────────────────┘                        │
  │                                                             │
  │ Mobile App Notification:                                    │
  │ ┌─────────────────────────────────┐                        │
  │ │ 🍺 Beer Vending Payment         │                        │
  │ │ Machine: BVM-001 (Asoke Branch) │                        │
  │ │ Amount: -฿350 (175ml)           │                        │
  │ │ Balance: ฿900                   │                        │
  │ │ Tap to view receipt             │                        │
  │ └─────────────────────────────────┘                        │
  └─────────────────────────────────────────────────────────────┘
                      ↓
  ┌─────────────────────────────────────────────────────────────┐
  │ Step 8: Continue or Finish                                 │
  │                                                             │
  │ Option A: User wants more beer                              │
  │ → Check balance still ≥ ฿500                               │
  │ → If yes: Repeat Step 4-7                                  │
  │ → If no: Show "Minimum balance not met"                    │
  │                                                             │
  │ Option B: User finishes                                     │
  │ API: POST /api/wallet/vending/end-session                  │
  │ → Release any reserved funds                                │
  │ → Close vending session                                     │
  │ → Machine returns to idle                                   │
  └─────────────────────────────────────────────────────────────┘

  ---
  2. Restaurant POS Payment Flow

  User Flow Diagram

  ┌─────────────────────────────────────────────────────────────┐
  │ Step 1: User Opens Wallet & Generates QR                   │
  │ ┌─────────────────────────────────┐                        │
  │ │ Tap "Show Payment QR"           │                        │
  │ │ QR Code Generated & Displayed   │                        │
  │ │ Token valid for 15 minutes      │                        │
  │ └─────────────────────────────────┘                        │
  └─────────────────────────────────────────────────────────────┘
                      ↓
  ┌─────────────────────────────────────────────────────────────┐
  │ Step 2: Staff Scans QR at POS Terminal                     │
  │ ┌─────────────────────────────────┐                        │
  │ │ POS reads QR code               │                        │
  │ │ Extracts: userId, token, qrId   │                        │
  │ └─────────────────────────────────┘                        │
  └─────────────────────────────────────────────────────────────┘
                      ↓
  ┌─────────────────────────────────────────────────────────────┐
  │ Step 3: Validate Wallet                                    │
  │ API: GET /api/wallet/validate-payment                      │
  │ ┌─────────────────────────────────┐                        │
  │ │ Check: Token valid?             │                        │
  │ │ Check: Wallet active/not frozen?│                        │
  │ │ Retrieve: User info & balance   │                        │
  │ └─────────────────────────────────┘                        │
  │                                                             │
  │ POS Display:                                                │
  │ ┌─────────────────────────────────┐                        │
  │ │ ✓ Wallet Valid                  │                        │
  │ │ Customer: Somchai Jaidee        │                        │
  │ │ Balance: ฿1,250.00              │                        │
  │ │                                 │                        │
  │ │ Enter amount to deduct:         │                        │
  │ │ ฿ [____________________]        │                        │
  │ └─────────────────────────────────┘                        │
  └─────────────────────────────────────────────────────────────┘
                      ↓
  ┌─────────────────────────────────────────────────────────────┐
  │ Step 4: Staff Enters Payment Amount                        │
  │ ┌─────────────────────────────────┐                        │
  │ │ Staff types: ฿320               │                        │
  │ │ POS validates: 320 ≤ 1250 ✓     │                        │
  │ └─────────────────────────────────┘                        │
  │                                                             │
  │ POS Display:                                                │
  │ ┌─────────────────────────────────┐                        │
  │ │ Amount to deduct: ฿320          │                        │
  │ │ Customer balance: ฿1,250        │                        │
  │ │ New balance: ฿930               │                        │
  │ │                                 │                        │
  │ │ [Confirm] [Cancel]              │                        │
  │ └─────────────────────────────────┘                        │
  └─────────────────────────────────────────────────────────────┘
                      ↓
  ┌─────────────────────────────────────────────────────────────┐
  │ Step 5: Send Payment Request to User (Optional)            │
  │ API: POST /api/wallet/pos/request-payment                  │
  │ ┌─────────────────────────────────┐                        │
  │ │ Send push notification to user  │                        │
  │ │ User sees confirmation dialog   │                        │
  │ └─────────────────────────────────┘                        │
  │                                                             │
  │ User's Mobile App:                                          │
  │ ┌─────────────────────────────────┐                        │
  │ │ 💳 Payment Request              │                        │
  │ │                                 │                        │
  │ │ From: Asoke Branch - POS 3      │                        │
  │ │ Staff: Somchai K.               │                        │
  │ │                                 │                        │
  │ │ Amount: ฿320.00                 │                        │
  │ │                                 │                        │
  │ │ Current: ฿1,250                 │                        │
  │ │ After: ฿930                     │                        │
  │ │                                 │                        │
  │ │ [Approve] [Decline]             │                        │
  │ └─────────────────────────────────┘                        │
  │                                                             │
  │ Note: This step can be skipped for faster checkout.        │
  │ Configuration: require_user_approval (true/false)           │
  └─────────────────────────────────────────────────────────────┘
                      ↓
  ┌─────────────────────────────────────────────────────────────┐
  │ Step 6: Process Payment                                    │
  │ API: POST /api/wallet/pos/deduct                           │
  │ ┌─────────────────────────────────┐                        │
  │ │ Request Body:                   │                        │
  │ │ {                               │                        │
  │ │   userId: 12345,                │                        │
  │ │   token: "abc123...",           │                        │
  │ │   qrId: "QR-20250308-00123",    │                        │
  │ │   amount: 320.00,               │                        │
  │ │   branchId: 5,                  │                        │
  │ │   posTerminal: "POS-003",       │                        │
  │ │   staffId: 789,                 │                        │
  │ │   reference: "ORDER-A-00456",   │                        │
  │ │   description: "Food order"     │                        │
  │ │ }                               │                        │
  │ └─────────────────────────────────┘                        │
  │                                                             │
  │ Backend Processing:                                         │
  │ 1. Validate token & QR not expired                         │
  │ 2. Check wallet not frozen                                  │
  │ 3. Verify balance ≥ amount                                 │
  │ 4. Start database transaction                               │
  │ 5. Deduct amount from wallet                                │
  │ 6. Create transaction record                                │
  │ 7. Award points (if applicable)                             │
  │ 8. Commit transaction                                       │
  │ 9. Send notification to user                                │
  │ 10. Invalidate QR (optional)                                │
  └─────────────────────────────────────────────────────────────┘
                      ↓
  ┌─────────────────────────────────────────────────────────────┐
  │ Step 7: Display Receipt                                    │
  │                                                             │
  │ POS Display:                                                │
  │ ┌─────────────────────────────────┐                        │
  │ │ ✓ Payment Successful            │                        │
  │ │                                 │                        │
  │ │ Transaction: TX-20250308-00125  │                        │
  │ │ Amount: ฿320.00                 │                        │
  │ │ Customer: Somchai Jaidee        │                        │
  │ │ New Balance: ฿930.00            │                        │
  │ │ Points Earned: +32 pts          │                        │
  │ │                                 │                        │
  │ │ [Print Receipt] [Done]          │                        │
  │ └─────────────────────────────────┘                        │
  │                                                             │
  │ Mobile App Notification:                                    │
  │ ┌─────────────────────────────────┐                        │
  │ │ ✓ Payment Successful            │                        │
  │ │ Paid: ฿320 at Asoke Branch      │                        │
  │ │ Balance: ฿930                   │                        │
  │ │ You earned 32 points!           │                        │
  │ │ Tap to view receipt             │                        │
  │ └─────────────────────────────────┘                        │
  └─────────────────────────────────────────────────────────────┘

  ---
  3. API Specifications

  3.1 Generate Payment QR Code

  Endpoint: POST /api/wallet/generate-payment-qr

  Authentication: Required (JWT)

  Request:
  {
    "userId": 12345
  }

  Response:
  {
    "success": true,
    "data": {
      "qrId": "QR-20250308-00123",
      "userId": 12345,
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMzQ1LCJxcklkIjoiUVItMjAyNTAzMDgtMDAxMjMiLCJpYXQ
  iOjE3MDk5MDI4MDAsImV4cCI6MTcwOTkwMzcwMH0.abc123",
      "qrData": "wallet://pay?uid=12345&token=eyJhbG...&qr=QR-20250308-00123&exp=1709903700",
      "balance": 1250.00,
      "expiresAt": "2025-03-08T20:00:00+07:00",
      "createdAt": "2025-03-08T19:45:00+07:00"
    }
  }

  QR Code Content:
  wallet://pay?uid=12345&token=eyJhbG...&qr=QR-20250308-00123&exp=1709903700

  Token Payload (JWT):
  {
    "userId": 12345,
    "qrId": "QR-20250308-00123",
    "type": "wallet_payment",
    "iat": 1709902800,
    "exp": 1709903700
  }

  ---
  3.2 Validate Payment QR

  Endpoint: GET /api/wallet/validate-payment

  Authentication: API Key (for vending machine/POS)

  Query Parameters:
  ?userId=12345&token=eyJhbG...&qrId=QR-20250308-00123

  Response (Success):
  {
    "success": true,
    "data": {
      "valid": true,
      "userId": 12345,
      "qrId": "QR-20250308-00123",
      "user": {
        "firstName": "Somchai",
        "lastName": "Jaidee",
        "phone": "0812345678"
      },
      "wallet": {
        "balance": 1250.00,
        "status": "active",
        "currency": "THB"
      },
      "meetsVendingMinimum": true,
      "minimumRequired": 500.00,
      "expiresAt": "2025-03-08T20:00:00+07:00"
    }
  }

  Response (Invalid/Expired):
  {
    "success": false,
    "error": {
      "code": "WALLET_QR_EXPIRED",
      "message": "QR code has expired"
    }
  }

  Error Codes:
  - WALLET_QR_EXPIRED - QR code expired
  - WALLET_QR_INVALID - Invalid QR code or token
  - WALLET_FROZEN - Wallet is frozen
  - WALLET_SUSPENDED - Wallet is suspended
  - WALLET_INSUFFICIENT_BALANCE - Balance too low
  - WALLET_MINIMUM_NOT_MET - Below ฿500 minimum (vending only)

  ---
  3.3 Reserve Funds (Beer Vending)

  Endpoint: POST /api/wallet/vending/reserve

  Authentication: API Key (vending machine)

  Request:
  {
    "userId": 12345,
    "token": "eyJhbG...",
    "qrId": "QR-20250308-00123",
    "machineId": "BVM-001",
    "branchId": 5
  }

  Response:
  {
    "success": true,
    "data": {
      "sessionId": "VS-20250308-00123",
      "userId": 12345,
      "reservedAmount": 1250.00,
      "maxVolume": 625,
      "pricePerMl": 2.00,
      "balance": 1250.00,
      "expiresAt": "2025-03-08T20:00:00+07:00",
      "createdAt": "2025-03-08T19:45:00+07:00"
    }
  }

  Backend Actions:
  1. Validate QR code
  2. Check balance ≥ ฿500
  3. Create pending transaction with status "reserved"
  4. Lock the entire balance (move to pending_balance)
  5. Calculate max dispensable volume
  6. Return session ID for tracking

  ---
  3.4 Finalize Vending Transaction

  Endpoint: POST /api/wallet/vending/finalize

  Authentication: API Key (vending machine)

  Request:
  {
    "sessionId": "VS-20250308-00123",
    "userId": 12345,
    "volumeDispensed": 175,
    "amountCharged": 350.00,
    "machineId": "BVM-001",
    "branchId": 5,
    "dispensedAt": "2025-03-08T19:47:30+07:00"
  }

  Response:
  {
    "success": true,
    "data": {
      "transactionId": "TX-20250308-00124",
      "sessionId": "VS-20250308-00123",
      "type": "payment",
      "volumeDispensed": 175,
      "amount": 350.00,
      "balanceBefore": 1250.00,
      "balanceAfter": 900.00,
      "pointsEarned": 35,
      "status": "completed",
      "reference": {
        "type": "vending_machine",
        "machineId": "BVM-001",
        "branchId": 5
      },
      "completedAt": "2025-03-08T19:47:31+07:00"
    }
  }

  Backend Actions:
  1. Validate session ID exists
  2. Verify amount ≤ reserved amount
  3. Start database transaction
  4. Deduct actual amount from wallet
  5. Release remaining reserved funds
  6. Update transaction status to "completed"
  7. Award points (e.g., 1 point per ฿10)
  8. Send push notification to user
  9. Commit transaction

  ---
  3.5 End Vending Session

  Endpoint: POST /api/wallet/vending/end-session

  Authentication: API Key (vending machine)

  Request:
  {
    "sessionId": "VS-20250308-00123",
    "userId": 12345,
    "reason": "user_finished"
  }

  Response:
  {
    "success": true,
    "data": {
      "sessionId": "VS-20250308-00123",
      "releasedAmount": 900.00,
      "finalBalance": 900.00,
      "totalDispensed": 175,
      "totalCharged": 350.00,
      "endedAt": "2025-03-08T19:50:00+07:00"
    }
  }

  Backend Actions:
  1. Find active session
  2. Release any remaining reserved funds
  3. Mark session as closed
  4. Return funds to available balance

  ---
  3.6 POS Payment Request (Optional)

  Endpoint: POST /api/wallet/pos/request-payment

  Authentication: API Key (POS system)

  Request:
  {
    "userId": 12345,
    "token": "eyJhbG...",
    "qrId": "QR-20250308-00123",
    "amount": 320.00,
    "branchId": 5,
    "posTerminal": "POS-003",
    "staffId": 789,
    "reference": "ORDER-A-00456",
    "description": "Food order payment"
  }

  Response:
  {
    "success": true,
    "data": {
      "requestId": "PR-20250308-00125",
      "userId": 12345,
      "amount": 320.00,
      "status": "pending_approval",
      "expiresAt": "2025-03-08T19:52:00+07:00",
      "notificationSent": true
    }
  }

  Backend Actions:
  1. Validate QR code and amount
  2. Check balance ≥ amount
  3. Create payment request record
  4. Send push notification to user
  5. Return request ID

  Mobile App Receives:
  Push notification → User approves/declines → App calls approval API

  ---
  3.7 POS Deduct Payment

  Endpoint: POST /api/wallet/pos/deduct

  Authentication: API Key (POS system)

  Request:
  {
    "userId": 12345,
    "token": "eyJhbG...",
    "qrId": "QR-20250308-00123",
    "amount": 320.00,
    "branchId": 5,
    "posTerminal": "POS-003",
    "staffId": 789,
    "staffName": "Somchai K.",
    "reference": "ORDER-A-00456",
    "description": "Food order payment",
    "requestId": "PR-20250308-00125"
  }

  Response (Success):
  {
    "success": true,
    "data": {
      "transactionId": "TX-20250308-00125",
      "type": "payment",
      "amount": 320.00,
      "balanceBefore": 1250.00,
      "balanceAfter": 930.00,
      "pointsEarned": 32,
      "status": "completed",
      "reference": {
        "type": "pos",
        "branchId": 5,
        "posTerminal": "POS-003",
        "staffId": 789,
        "orderId": "ORDER-A-00456"
      },
      "completedAt": "2025-03-08T19:50:15+07:00",
      "receiptUrl": "https://api.chongjaroen.com/receipts/TX-20250308-00125.pdf"
    }
  }

  Response (Insufficient Balance):
  {
    "success": false,
    "error": {
      "code": "WALLET_INSUFFICIENT_BALANCE",
      "message": "Insufficient wallet balance",
      "data": {
        "required": 320.00,
        "available": 150.00,
        "shortfall": 170.00
      }
    }
  }

  Backend Actions:
  1. Validate QR code and token
  2. Check wallet status (not frozen/suspended)
  3. Verify balance ≥ amount
  4. Start database transaction
  5. Deduct amount from wallet balance
  6. Create transaction record
  7. Award points (e.g., 1 point per ฿10)
  8. Optionally invalidate QR (if one-time use)
  9. Send push notification to user
  10. Commit transaction
  11. Generate receipt

  ---
  3.8 Approve Payment Request (Mobile App)

  Endpoint: POST /api/wallet/approve-payment

  Authentication: Required (JWT - User)

  Request:
  {
    "requestId": "PR-20250308-00125",
    "action": "approve"
  }

  Response:
  {
    "success": true,
    "data": {
      "requestId": "PR-20250308-00125",
      "status": "approved",
      "approvedAt": "2025-03-08T19:50:00+07:00"
    }
  }

  Note: POS system polls or receives webhook when approved, then calls /pos/deduct

  ---
  4. Database Changes

  4.1 New Table: wallet_payment_qr

  CREATE TABLE `wallet_payment_qr` (
    `id` VARCHAR(50) NOT NULL,
    `user_id` INT UNSIGNED NOT NULL,
    `token` TEXT NOT NULL,
    `status` ENUM('active', 'used', 'expired', 'cancelled') NOT NULL DEFAULT 'active',
    `expires_at` DATETIME NOT NULL,
    `used_at` DATETIME NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_user_status` (`user_id`, `status`),
    KEY `idx_expires_at` (`expires_at`),
    CONSTRAINT `fk_payment_qr_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  4.2 New Table: wallet_vending_sessions

  CREATE TABLE `wallet_vending_sessions` (
    `id` VARCHAR(50) NOT NULL,
    `user_id` INT UNSIGNED NOT NULL,
    `qr_id` VARCHAR(50) NOT NULL,
    `machine_id` VARCHAR(50) NOT NULL,
    `branch_id` INT UNSIGNED NOT NULL,
    `reserved_amount` DECIMAL(10,2) NOT NULL,
    `total_dispensed` INT DEFAULT 0 COMMENT 'Total ml dispensed',
    `total_charged` DECIMAL(10,2) DEFAULT 0.00,
    `status` ENUM('active', 'completed', 'cancelled', 'expired') NOT NULL DEFAULT 'active',
    `started_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `ended_at` DATETIME NULL,
    PRIMARY KEY (`id`),
    KEY `idx_user_status` (`user_id`, `status`),
    KEY `idx_machine` (`machine_id`, `status`),
    CONSTRAINT `fk_vending_session_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_vending_session_qr` FOREIGN KEY (`qr_id`) REFERENCES `wallet_payment_qr` (`id`) ON DELETE
  CASCADE,
    CONSTRAINT `fk_vending_session_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  4.3 New Table: wallet_payment_requests

  CREATE TABLE `wallet_payment_requests` (
    `id` VARCHAR(50) NOT NULL,
    `user_id` INT UNSIGNED NOT NULL,
    `qr_id` VARCHAR(50) NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `branch_id` INT UNSIGNED NOT NULL,
    `pos_terminal` VARCHAR(50) NULL,
    `staff_id` INT UNSIGNED NULL,
    `reference` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `status` ENUM('pending_approval', 'approved', 'declined', 'expired', 'completed') NOT NULL DEFAULT
  'pending_approval',
    `approved_at` DATETIME NULL,
    `declined_at` DATETIME NULL,
    `completed_at` DATETIME NULL,
    `transaction_id` VARCHAR(50) NULL,
    `expires_at` DATETIME NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_user_status` (`user_id`, `status`),
    KEY `idx_transaction` (`transaction_id`),
    CONSTRAINT `fk_payment_request_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_payment_request_qr` FOREIGN KEY (`qr_id`) REFERENCES `wallet_payment_qr` (`id`) ON DELETE
  CASCADE,
    CONSTRAINT `fk_payment_request_staff` FOREIGN KEY (`staff_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_payment_request_transaction` FOREIGN KEY (`transaction_id`) REFERENCES `wallet_transactions`
  (`id`) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  4.4 Update wallet_transactions Table

  Add new columns for vending machine tracking:

  ALTER TABLE `wallet_transactions`
    ADD COLUMN `vending_session_id` VARCHAR(50) NULL AFTER `reference_id`,
    ADD COLUMN `volume_dispensed` INT NULL COMMENT 'Volume in ml (for vending)' AFTER `vending_session_id`,
    ADD COLUMN `pos_terminal` VARCHAR(50) NULL AFTER `volume_dispensed`,
    ADD COLUMN `staff_id` INT UNSIGNED NULL AFTER `pos_terminal`,
    ADD KEY `idx_vending_session` (`vending_session_id`),
    ADD KEY `idx_pos_terminal` (`pos_terminal`),
    ADD CONSTRAINT `fk_wtrans_vending_session` FOREIGN KEY (`vending_session_id`) REFERENCES
  `wallet_vending_sessions` (`id`) ON DELETE SET NULL,
    ADD CONSTRAINT `fk_wtrans_staff` FOREIGN KEY (`staff_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

  ---
  5. Security Measures

  5.1 QR Code Security

  1. Time-Limited Tokens
    - QR codes expire after 15 minutes
    - JWT token includes expiration timestamp
    - Backend validates token expiration on every API call
  2. One-Time Use (Optional)
    - Configuration: qr_one_time_use: true/false
    - If enabled, QR invalidated after first successful payment
    - Prevents QR code reuse/sharing
  3. Token Invalidation
    - User can manually cancel/refresh QR in app
    - Automatic cleanup of expired QR codes (cron job)

  5.2 Transaction Security

  1. Atomic Operations
    - All balance changes wrapped in database transactions
    - Rollback on any error
  2. Idempotency
    - Transaction IDs prevent duplicate processing
    - Vending session IDs prevent double-charging
  3. Rate Limiting
    - Max 5 payment requests per QR code per minute
    - Max 10 QR code generations per user per hour
  4. Wallet Freeze Protection
    - Check wallet status before every transaction
    - Reject if wallet frozen/suspended

  5.3 Vending Machine Safeguards

  1. Reserved Funds
    - Lock balance during dispensing session
    - Prevents overdraft even with network delays
  2. Maximum Dispense Control
    - Calculate max volume based on reserved amount
    - Machine stops at calculated limit
  3. Session Timeout
    - Vending sessions expire after 10 minutes of inactivity
    - Auto-release reserved funds
  4. Minimum Balance Enforcement
    - ฿500 minimum checked before session starts
    - Session ends if balance drops below ฿500 mid-dispense

  ---
  6. Error Handling

  Common Error Responses

  {
    "success": false,
    "error": {
      "code": "ERROR_CODE",
      "message": "Human-readable error message",
      "data": {
        // Additional error context
      }
    }
  }

  Error Codes

  | Code                           | Message                          | Action            |
  |--------------------------------|----------------------------------|-------------------|
  | WALLET_QR_EXPIRED              | QR code has expired              | Generate new QR   |
  | WALLET_QR_INVALID              | Invalid QR code                  | Check QR data     |
  | WALLET_QR_ALREADY_USED         | QR code already used             | Generate new QR   |
  | WALLET_FROZEN                  | Wallet is frozen                 | Contact support   |
  | WALLET_SUSPENDED               | Wallet is suspended              | Contact support   |
  | WALLET_INSUFFICIENT_BALANCE    | Insufficient balance             | Top-up wallet     |
  | WALLET_MINIMUM_NOT_MET         | Below ฿500 minimum (vending)     | Top-up to ฿500+   |
  | WALLET_SESSION_EXPIRED         | Vending session expired          | Start new session |
  | WALLET_SESSION_NOT_FOUND       | Invalid session ID               | Check session     |
  | WALLET_PAYMENT_REQUEST_EXPIRED | Payment request expired          | Request again     |
  | WALLET_PAYMENT_DECLINED        | User declined payment            | Payment cancelled |
  | WALLET_INVALID_AMOUNT          | Invalid amount (negative/zero)   | Check amount      |
  | WALLET_AMOUNT_EXCEEDS_LIMIT    | Amount exceeds transaction limit | Reduce amount     |
  | WALLET_TOKEN_INVALID           | Invalid authentication token     | Re-authenticate   |

  ---
  7. Configuration Settings

  Admin Panel Configuration

  {
    // QR Code Settings
    "qr_expiration_minutes": 15,
    "qr_one_time_use": false,
    "qr_max_generations_per_hour": 10,

    // Vending Machine Settings
    "vending_minimum_balance": 500.00,
    "vending_price_per_ml": 2.00,
    "vending_session_timeout_minutes": 10,
    "vending_max_dispense_per_session": 1000, // ml

    // POS Settings
    "pos_require_user_approval": false,
    "pos_payment_request_timeout_minutes": 2,
    "pos_max_transaction_amount": 10000.00,

    // Points Settings
    "points_per_baht": 0.1, // 1 point per ฿10
    "points_enabled_for_vending": true,
    "points_enabled_for_pos": true,

    // Security Settings
    "payment_rate_limit_per_minute": 5,
    "auto_freeze_on_suspicious_activity": true,
    "notification_on_every_payment": true
  }
