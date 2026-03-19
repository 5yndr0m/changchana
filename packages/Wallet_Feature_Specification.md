# Chongjaroen Wallet Feature Specification

## Executive Summary

This document outlines the comprehensive wallet feature implementation plan for the Chongjaroen restaurant management system. The wallet feature will enable users to maintain a digital balance for seamless payments while providing administrators with robust financial management tools.

---

## Current System Analysis

### Existing Infrastructure

| Component | Status | Description |
|-----------|--------|-------------|
| Points System | ✅ Active | Loyalty rewards program with transaction logging |
| Payment Gateway | ✅ Active | Omise integration for card and PromptPay payments |
| Transaction Logging | ✅ Active | Point-based transaction history |
| Digital Wallet | ❌ Missing | No credit/debit balance system |
| Wallet UI | ❌ Missing | No dedicated wallet interface |
| Top-up/Withdrawal | ❌ Missing | No fund management functionality |

### Technology Stack

- **Backend:** Strapi v3.6.8 (Node.js, MySQL, Bookshelf ORM)
- **Mobile App:** Flutter 2.x (iOS/Android)
- **Admin Panel:** Nuxt.js 2.15.8 (Vue 2)
- **Payment Gateway:** Omise (Thai payment processor)

---

## Feature Specifications

## 1. Administrator Wallet Functions

### 1.1 Wallet Management Dashboard

**Overview Screen**
- Display total system wallet balance across all users
- Show daily/monthly transaction volume
- List pending transactions requiring review
- Quick statistics: active wallets, frozen accounts, today's transactions

**User Wallet List**
| Column | Description |
|--------|-------------|
| User ID | Unique identifier with link to profile |
| Name | First name, last name |
| Email/Phone | Contact information |
| Wallet Balance | Current available balance (฿) |
| Pending Balance | Transactions in progress (฿) |
| Frozen Balance | Temporarily locked funds (฿) |
| Status | Active / Frozen / Suspended |
| Last Transaction | Date and time of last activity |
| Actions | View, Edit, Adjust, Freeze |

**Features:**
- Search by name, email, phone, user ID
- Filter by balance range, status, last activity date
- Sort by any column
- Export to CSV/Excel
- Bulk actions (freeze multiple wallets)

### 1.2 Individual Wallet Management

**Wallet Detail Page**

**Summary Section:**
```
┌─────────────────────────────────────────────────┐
│ User: [First Name] [Last Name]                  │
│ User ID: #12345                                 │
│                                                 │
│ Available Balance:        ฿ 1,250.00            │
│ Pending Balance:          ฿   150.00            │
│ Frozen Balance:           ฿     0.00            │
│ Total Balance:            ฿ 1,400.00            │
│                                                 │
│ Loyalty Points:           750 pts               │
│ Member Since:             Jan 15, 2023          │
│ Total Transactions:       342                   │
│ Lifetime Deposits:        ฿ 15,230.00           │
│ Lifetime Spending:        ฿ 13,830.00           │
└─────────────────────────────────────────────────┘
```

**Actions:**
- **Manual Adjustment**
  - Add or deduct balance
  - Require reason (text field, mandatory)
  - Require admin approval (if amount > threshold)
  - Record admin who made adjustment
  - Send notification to user

- **Freeze/Unfreeze Wallet**
  - Temporarily block all transactions
  - Require reason
  - Set auto-unfreeze date (optional)
  - Send notification to user

- **View Audit Log**
  - All balance changes with timestamps
  - Admin who made changes
  - IP address of changes
  - Before/after balances

### 1.3 Transaction Management

**Transaction List View**

| Column | Description |
|--------|-------------|
| Transaction ID | Unique reference number |
| Date/Time | ISO 8601 format with timezone |
| User | Name with link to profile |
| Type | Top-up / Payment / Refund / Bonus / Adjustment / Withdrawal |
| Amount | + or - amount in ฿ |
| Balance Before | User balance before transaction |
| Balance After | User balance after transaction |
| Reference ID | Order/Booking/Payment ID |
| Status | Pending / Completed / Failed / Reversed |
| Payment Method | Card / PromptPay / Bank Transfer |
| Actions | View Details / Refund / Export Receipt |

**Advanced Filters:**
- Date range picker (from - to)
- User search (name, email, phone, ID)
- Transaction type (multi-select)
- Status (multi-select)
- Amount range (min - max)
- Payment method
- Reference ID search

**Bulk Actions:**
- Export selected transactions to CSV
- Export date range to Excel
- Generate financial report

**Transaction Detail Modal:**
```
Transaction #TX-20250308-00123
─────────────────────────────────────────────
Date/Time:        Mar 8, 2025, 14:32:15 ICT
User:             Somchai Jaidee (#12345)
Type:             Top-up
Amount:           +฿500.00
Status:           ✓ Completed

Payment Details:
  Method:         Credit Card (Visa ****1234)
  Omise Charge:   chrg_test_5v9xw1234567890
  Gateway Fee:    ฿15.00 (3%)
  Net Amount:     ฿485.00

Balance Changes:
  Balance Before: ฿750.00
  Amount:         +฿485.00
  Balance After:  ฿1,235.00

System Information:
  IP Address:     103.xx.xx.xx
  Device:         iPhone 13 Pro (iOS 16.2)
  App Version:    2.2.0
  Created At:     Mar 8, 2025, 14:32:15 ICT
  Updated At:     Mar 8, 2025, 14:32:18 ICT

[Refund Button] [Export Receipt] [Close]
```

### 1.4 Top-up Management

**Pending Top-ups Queue** (if manual approval required)
- List of pending top-up requests
- View bank transfer receipts (uploaded by users)
- Approve or reject with reason
- Auto-match bank transfers with requests

**Top-up Configuration:**
```
┌─────────────────────────────────────────┐
│ Top-up Settings                         │
├─────────────────────────────────────────┤
│ Minimum Amount:        ฿50.00           │
│ Maximum Amount:        ฿50,000.00       │
│                                          │
│ Payment Methods:                        │
│   ☑ Credit/Debit Card (Omise)          │
│   ☑ PromptPay QR Code (Omise)          │
│   ☐ Bank Transfer (Manual Verify)     │
│                                          │
│ Processing Fee:                         │
│   Card:               3% + ฿2.00       │
│   PromptPay:          Free              │
│   Bank Transfer:      Free              │
│                                          │
│ Auto-Approve Limit:   ฿10,000.00       │
│   (Above requires admin approval)       │
│                                          │
│ [Save Settings]                         │
└─────────────────────────────────────────┘
```

### 1.5 Financial Reporting & Analytics

**Dashboard Widgets:**

```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ Total Balance    │  │ Today's Volume   │  │ Pending Trans    │
│                  │  │                  │  │                  │
│  ฿ 2,458,320.50 │  │  ฿ 145,230.00   │  │      24          │
│  ↑ 12.5%        │  │  432 trans      │  │  ฿ 8,450.00     │
└──────────────────┘  └──────────────────┘  └──────────────────┘

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ Active Wallets   │  │ This Month       │  │ Avg Transaction  │
│                  │  │                  │  │                  │
│     8,456        │  │  ฿ 3,245,890.00 │  │    ฿ 285.50     │
│  ↑ 234 new      │  │  12,345 trans   │  │  ↓ 5.2%         │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

**Transaction Trends Chart:**
- Line chart showing daily transaction volume (last 30/90/365 days)
- Bar chart showing transaction types breakdown
- Pie chart showing payment methods distribution

**Reports Available:**

1. **Transaction Summary Report**
   - Date range selection
   - Total deposits vs withdrawals
   - Transaction count by type
   - Average transaction value
   - Peak transaction hours
   - Export to PDF/Excel

2. **User Activity Report**
   - Top 100 users by balance
   - Top 100 users by transaction count
   - Inactive wallets (no transaction in X days)
   - New wallets this month
   - Export to CSV

3. **Revenue Report**
   - Total top-up fees collected
   - Revenue by payment method
   - Refund amounts
   - Net revenue
   - Month-over-month comparison
   - Export to Excel

4. **Reconciliation Report**
   - Expected vs actual balance
   - Pending transactions
   - Failed transactions
   - Manual adjustments summary
   - Export for accounting

### 1.6 Withdrawal Management (Optional)

**Withdrawal Requests Queue:**

| Request ID | User | Amount | Bank Account | Requested On | Status | Actions |
|------------|------|--------|--------------|--------------|--------|---------|
| WD-00123 | Somchai J. | ฿2,500.00 | SCB ****4567 | Mar 8, 14:30 | Pending | Approve / Reject |
| WD-00122 | Siri P. | ฿1,200.00 | BBL ****8901 | Mar 8, 12:15 | Processing | View |
| WD-00121 | Nok S. | ฿5,000.00 | KBANK ****2345 | Mar 7, 16:45 | Completed | Receipt |

**Withdrawal Settings:**
```
Daily Limit per User:       ฿10,000.00
Monthly Limit per User:     ฿50,000.00
Minimum Withdrawal:         ฿100.00
Processing Time:            1-3 business days
Auto-Approve Limit:         ฿1,000.00
```

### 1.7 Promotional Tools

**Bonus Credit Campaign Creator:**
```
┌─────────────────────────────────────────────────┐
│ Create Wallet Promotion                         │
├─────────────────────────────────────────────────┤
│ Campaign Name: *                                │
│ [Grand Opening Bonus                          ] │
│                                                  │
│ Promotion Type: *                               │
│ ○ Top-up Bonus (e.g., +10% on all top-ups)    │
│ ● Fixed Bonus (e.g., ฿50 for first top-up)    │
│ ○ Tiered Bonus (different amounts per tier)   │
│                                                  │
│ Bonus Amount: *                                 │
│ ฿ [50.00                                    ]  │
│                                                  │
│ Conditions:                                     │
│ ☑ First-time top-up only                       │
│ ☐ Minimum top-up amount: ฿ [____]             │
│ ☐ Maximum bonus per user: ฿ [____]            │
│                                                  │
│ Valid Period: *                                 │
│ From: [Mar 10, 2025] To: [Mar 31, 2025]        │
│                                                  │
│ Target Users:                                   │
│ ● All users                                     │
│ ○ New users only                               │
│ ○ Selected user segments                       │
│                                                  │
│ [Create Campaign] [Cancel]                      │
└─────────────────────────────────────────────────┘
```

**Voucher Code Generator:**
- Generate single or bulk voucher codes
- Set redemption value (฿)
- Set usage limits (per code, per user)
- Set expiration date
- Export codes to CSV
- Track redemption status

### 1.8 Points-to-Wallet Integration

**Conversion Tools:**
- **Manual Conversion:** Select user(s), convert specific points to wallet credit
- **Bulk Conversion:** Upload CSV of users and point amounts
- **Conversion Rate Settings:** 1 point = ฿X (configurable)
- **Conversion History:** Track all conversions with timestamp and admin

**Example:**
```
Convert Points to Wallet Credit
─────────────────────────────────────
User:              Somchai Jaidee
Current Points:    1,000 pts
Conversion Rate:   10 pts = ฿1.00

Points to Convert: [500] pts
Wallet Credit:     ฿50.00

Reason: [Annual loyalty reward conversion    ]

[Convert] [Cancel]
```

---

## 2. User Wallet Functions (Mobile App)

### 2.1 Wallet Overview Screen

**Main Wallet Screen:**

```
┌────────────────────────────────────────┐
│  < Back          Wallet          [:]   │
├────────────────────────────────────────┤
│                                        │
│     💰 Your Wallet Balance             │
│                                        │
│         ฿ 1,250.00                     │
│                                        │
│     Available to spend                 │
│     (Pending: ฿150.00)                 │
│                                        │
├────────────────────────────────────────┤
│                                        │
│  [  Top-up  ] [  Pay  ]    │
│                                        │
├────────────────────────────────────────┤
│  Recent Transactions                   │
│                                        │
│  ↓ Top-up              +฿500.00       │
│    Mar 8, 14:32        Card ****1234   │
│                                        │
│  ↑ Paid at Branch      -฿285.00       │
│    Mar 7, 18:15        Asoke Branch    │
│                                        │
│  ↓ Bonus Credit        +฿50.00        │
│    Mar 7, 12:00        Welcome Bonus   │
│                                        │
│  ↑ Paid at Branch      -฿120.00       │
│    Mar 6, 19:30        Silom Branch    │
│                                        │
│  ↓ Top-up              +฿1,000.00     │
│    Mar 5, 16:20        PromptPay       │
│                                        │
│            [See All Transactions]      │
│                                        │
└────────────────────────────────────────┘
```

**Quick Stats Widget (on Home Screen):**
```
┌────────────────────────────────┐
│  💳 Wallet                     │
│                                │
│  ฿ 1,250.00  [Top-up]         │
│                                │
│  Points: 750 pts               │
└────────────────────────────────┘
```

### 2.2 Top-up Flow

**Step 1: Select Amount**

```
┌────────────────────────────────────────┐
│  < Back         Top-up Wallet          │
├────────────────────────────────────────┤
│                                        │
│  Current Balance: ฿1,250.00           │
│                                        │
│  Select amount to top-up:              │
│                                        │
│  ┌──────┐  ┌──────┐  ┌──────┐        │
│  │ ฿100 │  │ ฿500 │  │฿1000 │        │
│  └──────┘  └──────┘  └──────┘        │
│                                        │
│  ┌──────┐  ┌────────────────┐        │
│  │฿2000 │  │ Other Amount   │        │
│  └──────┘  └────────────────┘          │
│                                        │
│  Or enter custom amount:               │
│  ฿ [                           ]      │
│                                        │
│  Min: ฿100  Max: ฿50,000               │
│                                        │
│  [Continue]                            │
│                                        │
└────────────────────────────────────────┘
```

**Step 2: Select Payment Method**

```
┌────────────────────────────────────────┐
│  < Back         Top-up ฿500           │
├────────────────────────────────────────┤
│                                        │
│  Choose payment method:                │
│                                        │
│  ○ 💳 Credit/Debit Card                │
│     Fee: 3% + ฿2.00 (฿17.00)          │
│     You'll receive: ฿483.00           │
│                                       │
│  ● 📱 PromptPay QR                     │
│     Fee: Free                          │
│     You'll receive: ฿500.00            │
│                                        │
│      
│                                        │
│                                        │
│  [Continue]                            │
│                                        │
└────────────────────────────────────────┘
```

**Step 3a: PromptPay QR (Selected Example)**

```
┌────────────────────────────────────────┐
│  < Back    Scan to Pay ฿500.00         │
├────────────────────────────────────────┤
│                                        │
│  Scan this QR code with your banking   │
│  app to complete payment               │
│                                        │
│  ┌──────────────────────────────┐      │
│  │                              │      │
│  │     [QR CODE IMAGE]          │      │
│  │                              │      │
│  │                              │      │
│  └──────────────────────────────┘      │
│                                        │
│  Amount: ฿500.00                       │
│  Ref: TX-20250308-00124                │
│                                        │
│  Time remaining: 14:45                 │
│                                        │
│  After payment, balance will update    │
│  automatically within seconds          │
│                                        │
│  [I've Paid] [Cancel]                  │
│                                        │
└────────────────────────────────────────┘
```

**Step 4: Success Confirmation**

```
┌────────────────────────────────────────┐
│                                        │
│           ✓ Top-up Successful!         │
│                                        │
│         ฿500.00 added to wallet       │
│                                        │
│  ─────────────────────────────────────│
│  Transaction ID:  TX-20250308-00124    │
│  Payment Method:  PromptPay            │
│  Date/Time:       Mar 8, 2025, 14:35   │
│  ─────────────────────────────────────│
│                                        │
│  New Balance:     ฿1,750.00           │
│                                        │
│  [Download Receipt] [View Transaction] │
│                                        │
│  [Done]                                │
│                                        │
└────────────────────────────────────────┘
```

### 2.3 Payment at Checkout (QR Scan)

**Enhanced Checkout Screen:**

```
┌────────────────────────────────────────┐
│  < Back        Pay at Branch           │
├────────────────────────────────────────┤
│                                        │
│  Order Summary                         │
│  Asoke Branch                          │
│  Mar 8, 2025, 19:30                    │
│                                        │
│  Pad Thai           ฿120.00            │
│  Tom Yum Soup       ฿150.00            │
│  Thai Iced Tea      ฿50.00             │
│                                        │
│  Subtotal:          ฿320.00            │
│  ───────────────────────────────────── │
│                                        │
│  Payment Method:                       │
│                                        │
│  ● 💰 Wallet Balance (฿1,750.00)       │
│  ○ 💳 Credit Card                      │
│  ○ 💵 Cash / Pay at Counter            │
│                                        │
│  ☐ Use 100 Points (-฿10.00)            │
│                                        │
│  ───────────────────────────────────── │
│  Total to Pay:      ฿320.00            │
│                                        │
│  New balance:       ฿1,430.00          │
│  Points earned:     +32 pts            │
│                                        │
│  [Confirm Payment]                     │
│                                        │
└────────────────────────────────────────┘
```

**Insufficient Balance Handler:**

```
┌────────────────────────────────────────┐
│                                        │
│  ⚠️ Insufficient Balance               │
│                                        │
│  Order Total:       ฿320.00           │
│  Your Balance:      ฿150.00           │
│  Short by:          ฿170.00           │
│                                        │
│  Choose an option:                     │
│                                        │
│  [Top-up ฿170.00 Now]                │
│                                        │
│  [Use Different Payment Method]        │
│                                        │
│  [Cancel]                              │
│                                        │
└────────────────────────────────────────┘
```

### 2.4 Transaction History Screen

**Full Transaction History:**

```
┌────────────────────────────────────────┐
│  < Back    Transaction History   [🔍]  │
├────────────────────────────────────────┤
│  [Filter] [Export]                     │
│                                        │
│  ─── March 8, 2025 ───                │
│                                        │
│  ↓ Top-up              +฿500.00       │
│    14:32               PromptPay       │
│    TX-20250308-00124                   │
│    Balance: ฿1,750.00              [>]│
│                                        │
│  ─── March 7, 2025 ───                │
│                                        │
│  ↑ Payment             -฿285.00       │
│    18:15               Asoke Branch    │
│    Order #A-00456                      │
│    Balance: ฿1,250.00              [>]│
│                                        │
│  ↓ Bonus Credit        +฿50.00        │
│    12:00               Welcome Bonus   │
│    BONUS-2025-001                      │
│    Balance: ฿1,535.00              [>]│
│                                        │
│  ─── March 6, 2025 ───                │
│                                        │
│  ↑ Payment             -฿120.00       │
│    19:30               Silom Branch    │
│    Order #S-00789                      │
│    Balance: ฿1,485.00              [>]│
│                                        │
│  ─── March 5, 2025 ───                │
│                                        │
│  ↓ Top-up              +฿1,000.00     │
│    16:20               Card ****1234   │
│    TX-20250305-00098                   │
│    Balance: ฿1,605.00              [>]│
│                                        │
│  ↓ Refund              +฿95.00        │
│    10:15               Order Cancelled │
│    Ref: Order #A-00432                 │
│    Balance: ฿605.00                [>]│
│                                        │
│  [Load More]                           │
│                                        │
└────────────────────────────────────────┘
```

**Transaction Detail Modal:**

```
┌────────────────────────────────────────┐
│  < Back       Transaction Detail       │
├────────────────────────────────────────┤
│                                        │
│  ✓ Completed                           │
│                                        │
│  Top-up                                │
│  +฿500.00                             │
│                                        │
│  ─────────────────────────────────────│
│  Transaction ID:  TX-20250308-00124    │
│  Date/Time:       Mar 8, 2025, 14:32   │
│  ─────────────────────────────────────│
│                                        │
│  Payment Method:                       │
│  PromptPay QR Code                     │
│                                        │
│  Payment Details:                      │
│  Amount Paid:     ฿500.00             │
│  Processing Fee:  ฿0.00               │
│  You Received:    ฿500.00             │
│                                        │
│  ─────────────────────────────────────│
│  Balance Before:  ฿1,250.00           │
│  Change:          +฿500.00            │
│  Balance After:   ฿1,750.00           │
│  ─────────────────────────────────────│
│                                        │
│  [Download Receipt]                    │
│  [Share]                               │
│  [Need Help?]                          │
│                                        │
└────────────────────────────────────────┘
```

**Filter Modal:**

```
┌────────────────────────────────────────┐
│  < Back         Filter Transactions    │
├────────────────────────────────────────┤
│                                        │
│  Transaction Type:                     │
│  ☑ All                                 │
│  ☐ Top-up                              │
│  ☐ Payment                             │
│  ☐ Refund                              │
│  ☐ Bonus                               │
│  ☐ Adjustment                          │
│                                        │
│  Date Range:                           │
│  ● Last 7 days                         │
│  ○ Last 30 days                        │
│  ○ Last 90 days                        │
│  ○ All time                            │
│  ○ Custom range                        │
│                                        │
│  Amount Range:                         │
│  Min: ฿ [_____] Max: ฿ [_____]        │
│                                        │
│  Status:                               │
│  ☑ Completed                           │
│  ☑ Pending                             │
│  ☐ Failed                              │
│                                        │
│  [Apply Filters] [Reset]               │
│                                        │
└────────────────────────────────────────┘
```

### 2.5 Wallet Security Settings

**Security Screen:**

```
┌────────────────────────────────────────┐
│  < Back      Wallet Security           │
├────────────────────────────────────────┤
│                                        │
│  Payment Authorization                 │
│                                        │
│  Require authentication for payments   │
│  ● Always                              │
│  ○ For payments above ฿500            │
│  ○ Never                               │
│                                        │
│  ─────────────────────────────────────│
│                                        │
│  Authentication Method                 │
│  ☑ Fingerprint / Face ID               │
│  ☑ 6-digit PIN                         │
│  ☐ Password                            │
│                                        │
│  [Change PIN]                          │
│                                        │
│  ─────────────────────────────────────│
│                                        │
│  Notifications                         │
│  ☑ Top-up confirmation                 │
│  ☑ Payment confirmation                │
│  ☑ Refund received                     │
│  ☑ Low balance alert (฿100)          │
│  ☑ Suspicious activity                 │
│                                        │
│  ─────────────────────────────────────│
│                                        │
│  Activity Log                          │
│  Last login: Mar 8, 2025, 14:30        │
│  Device: iPhone 13 Pro                 │
│  Location: Bangkok, Thailand           │
│                                        │
│  [View All Login History]              │
│                                        │
└────────────────────────────────────────┘
```

### 2.6 Bonus & Promotions

**Promotions Tab:**

```
┌────────────────────────────────────────┐
│  < Back    Wallet Promotions      [i]  │
├────────────────────────────────────────┤
│                                        │
│  Active Promotions                     │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ 🎉 First Top-up Bonus          │    │
│  │                                │    │
│  │ Get ฿50 bonus on your first   │    │
│  │ wallet top-up of ฿500+        │    │
│  │                                │   │
│  │ Valid until: Mar 31, 2025      │   │
│  │ [Top-up Now]                   │   │
│  └────────────────────────────────┘   │
│                                       │
│  ┌────────────────────────────────┐   │
│  │ 💰 Weekend Cashback            │   │
│  │                                │   │
│  │ Get 5% cashback on all         │   │
│  │ wallet payments this weekend   │   │
│  │                                │   │
│  │ Sat-Sun, Mar 9-10, 2025        │   │
│  │ [Learn More]                   │   │
│  └────────────────────────────────┘   │
│                                        │
│  ─────────────────────────────────────│
│                                        │
│  Redeem Voucher Code                   │
│                                        │
│  [Enter Code]      [Redeem]            │
│                                        │
│  ─────────────────────────────────────│
│                                        │
│  My Rewards History                    │
│                                        │
│  Welcome Bonus        +฿50.00         │
│  Mar 7, 2025                           │
│                                        │
│  Referral Bonus       +฿100.00        │
│  Feb 28, 2025                          │
│                                        │
│  [View All]                            │
│                                        │
└────────────────────────────────────────┘
```

### 2.7 Withdraw Funds (Optional)

**Withdrawal Request Flow:**

**Step 1: Enter Amount**
```
┌────────────────────────────────────────┐
│  < Back         Withdraw Funds         │
├────────────────────────────────────────┤
│                                        │
│  Available Balance: ฿1,750.00         │
│                                        │
│  Amount to withdraw:                   │
│  ฿ [                           ]      │
│                                        │
│  Min: ฿100  Max: ฿10,000/day          │
│                                        │
│  You'll receive: ฿[calculated]        │
│  Processing fee: ฿0.00                │
│                                        │
│  ⓘ Withdrawals are processed within    │
│    1-3 business days                   │
│                                        │
│  [Continue]                            │
│                                        │
└────────────────────────────────────────┘
```

**Step 2: Select Bank Account**
```
┌────────────────────────────────────────┐
│  < Back    Withdraw ฿1,000.00         │
├────────────────────────────────────────┤
│                                        │
│  Select bank account:                  │
│                                        │
│  ● Siam Commercial Bank               │
│    Account: ****4567                   │
│    Name: Somchai Jaidee                │
│                                        │
│  ○ Bangkok Bank                        │
│    Account: ****8901                   │
│    Name: Somchai Jaidee                │
│                                        │
│  [+ Add New Bank Account]              │
│                                        │
│  ─────────────────────────────────────│
│                                        │
│  Withdrawal Summary:                   │
│  Amount:          ฿1,000.00           │
│  Processing Fee:  ฿0.00               │
│  You'll receive:  ฿1,000.00           │
│  Processing time: 1-3 business days    │
│                                        │
│  [Confirm Withdrawal]                  │
│                                        │
└────────────────────────────────────────┘
```

**Step 3: Confirmation**
```
┌────────────────────────────────────────┐
│                                        │
│     ✓ Withdrawal Request Submitted     │
│                                        │
│         ฿1,000.00                     │
│                                        │
│  ─────────────────────────────────────│
│  Request ID:      WD-00125             │
│  Bank Account:    SCB ****4567         │
│  Status:          Pending Approval     │
│  Submitted:       Mar 8, 2025, 15:00   │
│  Est. Completion: Mar 11, 2025         │
│  ─────────────────────────────────────│
│                                        │
│  You'll be notified once your          │
│  withdrawal is processed               │
│                                        │
│  [Track Status] [Done]                 │
│                                        │
└────────────────────────────────────────┘
```

### 2.8 Points Integration

**Convert Points to Wallet Screen:**

```
┌────────────────────────────────────────┐
│  < Back    Convert Points to Wallet    │
├────────────────────────────────────────┤
│                                        │
│  Your Points:      750 pts             │
│  Wallet Balance:   ฿1,750.00           │
│                                        │
│  ───────────────────────────────────── │
│                                        │
│  Conversion Rate:  1 pts = ฿1.00       │
│                                        │
│  Points to convert:                    │
│  [50] pts                              │
│                                        │
│  You'll receive:   ฿50.00              │
│                                        │
│  ⓘ Conversion is instant and cannot   │
│    be reversed                         │
│                                        │
│  After conversion:                     │
│  • Points: 250 pts                     │
│  • Wallet: ฿1,800.00                   │
│                                        │
│  [Convert Now]                         │
│                                        │
└────────────────────────────────────────┘
```

### 2.9 Push Notifications

**Notification Examples:**

1. **Top-up Success:**
   ```
   ✓ Top-up Successful
   ฿500.00 has been added to your wallet
   New balance: ฿1,750.00
   Tap to view receipt
   ```

2. **Payment Completed:**
   ```
   ✓ Payment Successful
   Paid ฿285.00 at Asoke Branch
   You earned 28 points!
   Balance: ฿1,465.00
   ```

3. **Refund Received:**
   ```
   ↓ Refund Received
   ฿95.00 refunded for cancelled order
   New balance: ฿700.00
   ```

4. **Low Balance Alert:**
   ```
   ⚠️ Low Wallet Balance
   Your balance is ฿85.00
   Top-up now to continue enjoying seamless payments
   ```

5. **Bonus Credit:**
   ```
   🎉 Bonus Received!
   ฿50.00 welcome bonus added to your wallet
   Thank you for joining us!
   ```

---

## 3. Backend API Specifications

### 3.1 User API Endpoints

#### **GET** `/api/wallet/balance`
**Description:** Get current user's wallet balance and status

**Authentication:** Required (JWT)

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": 12345,
    "balance": 1250.00,
    "pendingBalance": 150.00,
    "frozenBalance": 0.00,
    "totalBalance": 1400.00,
    "currency": "THB",
    "status": "active",
    "points": 750,
    "lastTransaction": "2025-03-08T14:32:15+07:00"
  }
}
```

---

#### **GET** `/api/wallet/transactions`
**Description:** Get user's wallet transaction history

**Authentication:** Required (JWT)

**Query Parameters:**
- `limit` (optional, default: 20, max: 100)
- `offset` (optional, default: 0)
- `type` (optional, enum: top_up, payment, refund, bonus, adjustment, withdrawal)
- `status` (optional, enum: pending, completed, failed, reversed)
- `fromDate` (optional, ISO 8601 date)
- `toDate` (optional, ISO 8601 date)

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "TX-20250308-00124",
        "type": "top_up",
        "amount": 500.00,
        "balanceBefore": 1250.00,
        "balanceAfter": 1750.00,
        "status": "completed",
        "paymentMethod": "promptpay",
        "referenceId": "chrg_test_5v9xw1234567890",
        "description": "Wallet top-up via PromptPay",
        "createdAt": "2025-03-08T14:32:15+07:00",
        "completedAt": "2025-03-08T14:32:18+07:00"
      }
    ],
    "pagination": {
      "total": 342,
      "limit": 20,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

---

#### **POST** `/api/wallet/top-up`
**Description:** Initiate wallet top-up transaction

**Authentication:** Required (JWT)

**Request Body:**
```json
{
  "amount": 500.00,
  "paymentMethod": "promptpay",
  "returnUrl": "chongjaroen://wallet/top-up-result"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionId": "TX-20250308-00124",
    "amount": 500.00,
    "fee": 0.00,
    "netAmount": 500.00,
    "paymentMethod": "promptpay",
    "status": "pending",
    "omiseCharge": {
      "id": "chrg_test_5v9xw1234567890",
      "authorizeUri": null,
      "source": {
        "type": "promptpay",
        "scannable_code": {
          "image": {
            "download_uri": "https://..."
          }
        }
      },
      "expiresAt": "2025-03-08T14:47:15+07:00"
    },
    "createdAt": "2025-03-08T14:32:15+07:00"
  }
}
```

---

#### **POST** `/api/wallet/pay`
**Description:** Pay for order using wallet balance

**Authentication:** Required (JWT)

**Request Body:**
```json
{
  "amount": 320.00,
  "referenceType": "order",
  "referenceId": "A-00456",
  "branchId": 5,
  "description": "Payment for Order A-00456",
  "usePoints": 100
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionId": "TX-20250308-00125",
    "type": "payment",
    "amount": 320.00,
    "pointsUsed": 100,
    "pointsEarned": 32,
    "balanceBefore": 1750.00,
    "balanceAfter": 1430.00,
    "status": "completed",
    "referenceId": "A-00456",
    "completedAt": "2025-03-08T19:30:15+07:00"
  }
}
```

---

#### **POST** `/api/wallet/withdraw`
**Description:** Request wallet withdrawal to bank account

**Authentication:** Required (JWT)

**Request Body:**
```json
{
  "amount": 1000.00,
  "bankAccountId": "BA-00123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "withdrawalId": "WD-00125",
    "amount": 1000.00,
    "fee": 0.00,
    "netAmount": 1000.00,
    "bankAccount": {
      "id": "BA-00123",
      "bankCode": "SCB",
      "accountNumber": "****4567",
      "accountName": "Somchai Jaidee"
    },
    "status": "pending",
    "estimatedCompletion": "2025-03-11T17:00:00+07:00",
    "createdAt": "2025-03-08T15:00:00+07:00"
  }
}
```

---

#### **POST** `/api/wallet/voucher/redeem`
**Description:** Redeem voucher code for wallet credit

**Authentication:** Required (JWT)

**Request Body:**
```json
{
  "code": "WELCOME50"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionId": "TX-20250308-00126",
    "voucherCode": "WELCOME50",
    "amount": 50.00,
    "balanceBefore": 1750.00,
    "balanceAfter": 1800.00,
    "description": "Welcome Bonus",
    "createdAt": "2025-03-08T15:30:00+07:00"
  }
}
```

---

#### **POST** `/api/wallet/points/convert`
**Description:** Convert loyalty points to wallet credit

**Authentication:** Required (JWT)

**Request Body:**
```json
{
  "points": 500
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionId": "TX-20250308-00127",
    "pointsConverted": 500,
    "conversionRate": 10,
    "walletCredit": 50.00,
    "pointsRemaining": 250,
    "balanceBefore": 1750.00,
    "balanceAfter": 1800.00,
    "createdAt": "2025-03-08T16:00:00+07:00"
  }
}
```

---

### 3.2 Admin API Endpoints

#### **GET** `/api/admin/wallets`
**Description:** List all user wallets with filters

**Authentication:** Required (JWT, Role: Admin/Staff)

**Query Parameters:**
- `limit`, `offset` (pagination)
- `search` (user name, email, phone)
- `minBalance`, `maxBalance` (filter by balance range)
- `status` (active, frozen, suspended)
- `sortBy` (balance, lastTransaction, userId)
- `sortOrder` (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "wallets": [
      {
        "userId": 12345,
        "user": {
          "firstName": "Somchai",
          "lastName": "Jaidee",
          "email": "somchai@example.com",
          "phone": "0812345678"
        },
        "balance": 1250.00,
        "pendingBalance": 150.00,
        "frozenBalance": 0.00,
        "status": "active",
        "totalTransactions": 342,
        "lifetimeDeposits": 15230.00,
        "lifetimeSpending": 13830.00,
        "lastTransaction": "2025-03-08T14:32:15+07:00",
        "createdAt": "2023-01-15T10:00:00+07:00"
      }
    ],
    "pagination": {
      "total": 8456,
      "limit": 50,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

---

#### **GET** `/api/admin/wallet/:userId`
**Description:** Get detailed wallet information for specific user

**Authentication:** Required (JWT, Role: Admin/Staff)

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": 12345,
    "user": {
      "firstName": "Somchai",
      "lastName": "Jaidee",
      "email": "somchai@example.com",
      "phone": "0812345678",
      "memberSince": "2023-01-15T10:00:00+07:00"
    },
    "wallet": {
      "balance": 1250.00,
      "pendingBalance": 150.00,
      "frozenBalance": 0.00,
      "totalBalance": 1400.00,
      "status": "active",
      "points": 750
    },
    "statistics": {
      "totalTransactions": 342,
      "lifetimeDeposits": 15230.00,
      "lifetimeSpending": 13830.00,
      "totalRefunds": 450.00,
      "totalBonuses": 250.00,
      "lastTransaction": "2025-03-08T14:32:15+07:00"
    },
    "recentTransactions": [
      {
        "id": "TX-20250308-00124",
        "type": "top_up",
        "amount": 500.00,
        "status": "completed",
        "createdAt": "2025-03-08T14:32:15+07:00"
      }
    ]
  }
}
```

---

#### **POST** `/api/admin/wallet/adjust`
**Description:** Manually adjust user wallet balance (admin only)

**Authentication:** Required (JWT, Role: Admin)

**Request Body:**
```json
{
  "userId": 12345,
  "amount": 100.00,
  "type": "credit",
  "reason": "Customer service compensation",
  "requireApproval": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionId": "TX-20250308-00128",
    "userId": 12345,
    "type": "adjustment",
    "amount": 100.00,
    "balanceBefore": 1750.00,
    "balanceAfter": 1850.00,
    "reason": "Customer service compensation",
    "adjustedBy": {
      "adminId": 5,
      "adminName": "Admin User"
    },
    "status": "completed",
    "createdAt": "2025-03-08T16:30:00+07:00"
  }
}
```

---

#### **POST** `/api/admin/wallet/freeze`
**Description:** Freeze or unfreeze user wallet

**Authentication:** Required (JWT, Role: Admin)

**Request Body:**
```json
{
  "userId": 12345,
  "action": "freeze",
  "reason": "Suspicious activity detected",
  "autoUnfreezeAt": "2025-03-15T00:00:00+07:00"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": 12345,
    "status": "frozen",
    "frozenBy": {
      "adminId": 5,
      "adminName": "Admin User"
    },
    "reason": "Suspicious activity detected",
    "frozenAt": "2025-03-08T16:45:00+07:00",
    "autoUnfreezeAt": "2025-03-15T00:00:00+07:00"
  }
}
```

---

#### **GET** `/api/admin/wallet/transactions`
**Description:** Get all wallet transactions across all users

**Authentication:** Required (JWT, Role: Admin/Staff)

**Query Parameters:**
- `limit`, `offset` (pagination)
- `userId` (filter by user)
- `type` (filter by transaction type)
- `status` (filter by status)
- `minAmount`, `maxAmount`
- `fromDate`, `toDate`
- `paymentMethod`
- `referenceId` (search by order/booking ID)

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "TX-20250308-00124",
        "userId": 12345,
        "user": {
          "firstName": "Somchai",
          "lastName": "Jaidee",
          "email": "somchai@example.com"
        },
        "type": "top_up",
        "amount": 500.00,
        "balanceBefore": 1250.00,
        "balanceAfter": 1750.00,
        "status": "completed",
        "paymentMethod": "promptpay",
        "paymentTransactionId": "chrg_test_5v9xw1234567890",
        "referenceId": null,
        "description": "Wallet top-up via PromptPay",
        "createdAt": "2025-03-08T14:32:15+07:00",
        "completedAt": "2025-03-08T14:32:18+07:00"
      }
    ],
    "pagination": {
      "total": 125634,
      "limit": 100,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

---

#### **POST** `/api/admin/wallet/refund`
**Description:** Process refund for a transaction

**Authentication:** Required (JWT, Role: Admin)

**Request Body:**
```json
{
  "transactionId": "TX-20250308-00125",
  "refundType": "full",
  "reason": "Order cancelled by restaurant"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "refundTransactionId": "TX-20250308-00129",
    "originalTransactionId": "TX-20250308-00125",
    "refundAmount": 320.00,
    "refundType": "full",
    "userId": 12345,
    "balanceBefore": 1430.00,
    "balanceAfter": 1750.00,
    "reason": "Order cancelled by restaurant",
    "processedBy": {
      "adminId": 5,
      "adminName": "Admin User"
    },
    "status": "completed",
    "createdAt": "2025-03-08T17:00:00+07:00"
  }
}
```

---

#### **GET** `/api/admin/wallet/reports`
**Description:** Generate financial reports and analytics

**Authentication:** Required (JWT, Role: Admin)

**Query Parameters:**
- `reportType` (summary, revenue, user_activity, reconciliation)
- `fromDate`, `toDate`
- `groupBy` (day, week, month)

**Response:**
```json
{
  "success": true,
  "data": {
    "reportType": "summary",
    "period": {
      "from": "2025-03-01T00:00:00+07:00",
      "to": "2025-03-08T23:59:59+07:00"
    },
    "summary": {
      "totalWalletBalance": 2458320.50,
      "totalPendingBalance": 8450.00,
      "totalFrozenBalance": 1200.00,
      "activeWallets": 8456,
      "frozenWallets": 12,
      "suspendedWallets": 3
    },
    "transactionSummary": {
      "totalTransactions": 12345,
      "totalVolume": 3245890.00,
      "byType": {
        "top_up": {
          "count": 4523,
          "volume": 2456780.00
        },
        "payment": {
          "count": 6892,
          "volume": 1234560.00
        },
        "refund": {
          "count": 234,
          "volume": 45230.00
        },
        "bonus": {
          "count": 456,
          "volume": 23450.00
        },
        "adjustment": {
          "count": 23,
          "volume": 5670.00
        }
      }
    },
    "revenue": {
      "topUpFees": 34567.80,
      "withdrawalFees": 0.00,
      "totalRevenue": 34567.80
    }
  }
}
```

---

#### **POST** `/api/admin/wallet/voucher/create`
**Description:** Create wallet voucher code

**Authentication:** Required (JWT, Role: Admin)

**Request Body:**
```json
{
  "code": "WELCOME50",
  "amount": 50.00,
  "maxRedemptions": 1000,
  "validFrom": "2025-03-10T00:00:00+07:00",
  "validUntil": "2025-03-31T23:59:59+07:00",
  "conditions": {
    "firstTimeOnly": true,
    "minTopUp": 500.00
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "voucherId": "VC-00123",
    "code": "WELCOME50",
    "amount": 50.00,
    "maxRedemptions": 1000,
    "usedCount": 0,
    "validFrom": "2025-03-10T00:00:00+07:00",
    "validUntil": "2025-03-31T23:59:59+07:00",
    "status": "active",
    "createdBy": {
      "adminId": 5,
      "adminName": "Admin User"
    },
    "createdAt": "2025-03-08T17:30:00+07:00"
  }
}
```

---

## 4. Database Schema

### 4.1 New Tables

#### Table: `wallets`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Wallet ID |
| `user_id` | INT | FOREIGN KEY → users(id), UNIQUE | User reference |
| `balance` | DECIMAL(10,2) | NOT NULL, DEFAULT 0.00 | Available balance |
| `pending_balance` | DECIMAL(10,2) | NOT NULL, DEFAULT 0.00 | Pending transactions |
| `frozen_balance` | DECIMAL(10,2) | NOT NULL, DEFAULT 0.00 | Frozen/locked funds |
| `status` | ENUM | ('active', 'frozen', 'suspended') | Wallet status |
| `frozen_reason` | TEXT | NULL | Reason for freeze |
| `frozen_by` | INT | FOREIGN KEY → users(id), NULL | Admin who froze |
| `frozen_at` | DATETIME | NULL | Freeze timestamp |
| `auto_unfreeze_at` | DATETIME | NULL | Auto-unfreeze time |
| `created_at` | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation time |
| `updated_at` | DATETIME | ON UPDATE CURRENT_TIMESTAMP | Last update |

**Indexes:**
- PRIMARY KEY (`id`)
- UNIQUE KEY (`user_id`)
- INDEX (`status`)
- INDEX (`created_at`)

---

#### Table: `wallet_transactions`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | VARCHAR(50) | PRIMARY KEY | Transaction ID (TX-YYYYMMDD-XXXXX) |
| `user_id` | INT | FOREIGN KEY → users(id), NOT NULL | User reference |
| `type` | ENUM | ('top_up', 'payment', 'refund', 'bonus', 'adjustment', 'withdrawal', 'conversion') | Transaction type |
| `amount` | DECIMAL(10,2) | NOT NULL | Transaction amount (+ or -) |
| `balance_before` | DECIMAL(10,2) | NOT NULL | Balance before transaction |
| `balance_after` | DECIMAL(10,2) | NOT NULL | Balance after transaction |
| `status` | ENUM | ('pending', 'completed', 'failed', 'reversed') | Transaction status |
| `payment_method` | VARCHAR(50) | NULL | Payment method (card, promptpay, etc.) |
| `payment_transaction_id` | VARCHAR(255) | NULL | Omise charge/transaction ID |
| `reference_type` | VARCHAR(50) | NULL | Reference type (order, booking, event) |
| `reference_id` | VARCHAR(255) | NULL | Reference ID |
| `description` | TEXT | NULL | Transaction description |
| `fee` | DECIMAL(10,2) | DEFAULT 0.00 | Processing fee |
| `net_amount` | DECIMAL(10,2) | NULL | Net amount after fees |
| `admin_id` | INT | FOREIGN KEY → users(id), NULL | Admin for manual adjustments |
| `admin_reason` | TEXT | NULL | Reason for admin action |
| `metadata` | JSON | NULL | Additional data |
| `ip_address` | VARCHAR(45) | NULL | User IP address |
| `user_agent` | TEXT | NULL | User device info |
| `created_at` | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation time |
| `completed_at` | DATETIME | NULL | Completion time |
| `failed_at` | DATETIME | NULL | Failure time |

**Indexes:**
- PRIMARY KEY (`id`)
- INDEX (`user_id`, `created_at` DESC)
- INDEX (`type`, `status`)
- INDEX (`status`, `created_at`)
- INDEX (`reference_type`, `reference_id`)
- INDEX (`payment_transaction_id`)
- INDEX (`created_at` DESC)

---

#### Table: `wallet_vouchers`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | VARCHAR(50) | PRIMARY KEY | Voucher ID (VC-XXXXX) |
| `code` | VARCHAR(50) | UNIQUE, NOT NULL | Voucher code |
| `amount` | DECIMAL(10,2) | NOT NULL | Credit amount |
| `max_redemptions` | INT | DEFAULT NULL | Max total uses (NULL = unlimited) |
| `used_count` | INT | NOT NULL, DEFAULT 0 | Current usage count |
| `per_user_limit` | INT | DEFAULT 1 | Max uses per user |
| `valid_from` | DATETIME | NOT NULL | Valid start date |
| `valid_until` | DATETIME | NOT NULL | Valid end date |
| `status` | ENUM | ('active', 'expired', 'disabled') | Voucher status |
| `conditions` | JSON | NULL | Conditions (firstTimeOnly, minTopUp, etc.) |
| `description` | TEXT | NULL | Internal description |
| `created_by` | INT | FOREIGN KEY → users(id), NULL | Admin who created |
| `created_at` | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation time |
| `updated_at` | DATETIME | ON UPDATE CURRENT_TIMESTAMP | Last update |

**Indexes:**
- PRIMARY KEY (`id`)
- UNIQUE KEY (`code`)
- INDEX (`status`, `valid_from`, `valid_until`)

---

#### Table: `wallet_voucher_redemptions`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Redemption ID |
| `voucher_id` | VARCHAR(50) | FOREIGN KEY → wallet_vouchers(id) | Voucher reference |
| `user_id` | INT | FOREIGN KEY → users(id) | User who redeemed |
| `transaction_id` | VARCHAR(50) | FOREIGN KEY → wallet_transactions(id) | Transaction reference |
| `amount` | DECIMAL(10,2) | NOT NULL | Amount received |
| `redeemed_at` | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Redemption time |

**Indexes:**
- PRIMARY KEY (`id`)
- INDEX (`voucher_id`)
- INDEX (`user_id`, `voucher_id`)
- INDEX (`redeemed_at`)

---

#### Table: `wallet_withdrawals`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | VARCHAR(50) | PRIMARY KEY | Withdrawal ID (WD-XXXXX) |
| `user_id` | INT | FOREIGN KEY → users(id), NOT NULL | User reference |
| `transaction_id` | VARCHAR(50) | FOREIGN KEY → wallet_transactions(id) | Transaction reference |
| `amount` | DECIMAL(10,2) | NOT NULL | Withdrawal amount |
| `fee` | DECIMAL(10,2) | DEFAULT 0.00 | Processing fee |
| `net_amount` | DECIMAL(10,2) | NOT NULL | Net payout amount |
| `bank_account_id` | INT | FOREIGN KEY → user_bank_accounts(id) | Bank account |
| `status` | ENUM | ('pending', 'approved', 'processing', 'completed', 'rejected', 'failed') | Status |
| `approved_by` | INT | FOREIGN KEY → users(id), NULL | Admin who approved |
| `approved_at` | DATETIME | NULL | Approval time |
| `payout_transaction_id` | VARCHAR(255) | NULL | Bank transaction ID |
| `rejection_reason` | TEXT | NULL | Reason if rejected |
| `estimated_completion` | DATETIME | NULL | Expected completion |
| `completed_at` | DATETIME | NULL | Actual completion |
| `created_at` | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Request time |

**Indexes:**
- PRIMARY KEY (`id`)
- INDEX (`user_id`, `status`)
- INDEX (`status`, `created_at`)

---

#### Table: `user_bank_accounts`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | VARCHAR(50) | PRIMARY KEY | Bank account ID (BA-XXXXX) |
| `user_id` | INT | FOREIGN KEY → users(id), NOT NULL | User reference |
| `bank_code` | VARCHAR(10) | NOT NULL | Bank code (SCB, BBL, etc.) |
| `account_number` | VARCHAR(50) | NOT NULL | Account number (encrypted) |
| `account_name` | VARCHAR(255) | NOT NULL | Account holder name |
| `is_default` | BOOLEAN | DEFAULT FALSE | Default account flag |
| `verified` | BOOLEAN | DEFAULT FALSE | Verification status |
| `created_at` | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Added date |
| `updated_at` | DATETIME | ON UPDATE CURRENT_TIMESTAMP | Last update |

**Indexes:**
- PRIMARY KEY (`id`)
- INDEX (`user_id`)
- UNIQUE KEY (`user_id`, `bank_code`, `account_number`)

---

#### Table: `wallet_audit_logs`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Log ID |
| `wallet_id` | INT | FOREIGN KEY → wallets(id) | Wallet reference |
| `transaction_id` | VARCHAR(50) | FOREIGN KEY → wallet_transactions(id), NULL | Transaction reference |
| `action` | VARCHAR(50) | NOT NULL | Action type |
| `actor_id` | INT | FOREIGN KEY → users(id), NULL | Who performed action |
| `actor_type` | ENUM | ('user', 'admin', 'system') | Actor type |
| `balance_before` | DECIMAL(10,2) | NULL | Balance before |
| `balance_after` | DECIMAL(10,2) | NULL | Balance after |
| `changes` | JSON | NULL | Changes made |
| `ip_address` | VARCHAR(45) | NULL | IP address |
| `user_agent` | TEXT | NULL | Device info |
| `created_at` | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Log time |

**Indexes:**
- PRIMARY KEY (`id`)
- INDEX (`wallet_id`, `created_at` DESC)
- INDEX (`transaction_id`)
- INDEX (`actor_id`, `created_at`)

---

### 4.2 Schema Modifications to Existing Tables

#### Modify: `users` table

**Add columns:**
```sql
ALTER TABLE users
  ADD COLUMN wallet_pin VARCHAR(255) NULL COMMENT 'Encrypted wallet PIN',
  ADD COLUMN wallet_pin_enabled BOOLEAN DEFAULT FALSE,
  ADD COLUMN low_balance_threshold DECIMAL(10,2) DEFAULT 100.00,
  ADD COLUMN wallet_notifications_enabled BOOLEAN DEFAULT TRUE;
```

---

### 4.3 Migration Scripts

#### Migration 1: Create Wallets Table
```sql
CREATE TABLE `wallets` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `balance` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `pending_balance` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `frozen_balance` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `status` ENUM('active', 'frozen', 'suspended') NOT NULL DEFAULT 'active',
  `frozen_reason` TEXT NULL,
  `frozen_by` INT UNSIGNED NULL,
  `frozen_at` DATETIME NULL,
  `auto_unfreeze_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_wallet_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wallet_frozen_by` FOREIGN KEY (`frozen_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### Migration 2: Create Wallet Transactions Table
```sql
CREATE TABLE `wallet_transactions` (
  `id` VARCHAR(50) NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `type` ENUM('top_up', 'payment', 'refund', 'bonus', 'adjustment', 'withdrawal', 'conversion') NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `balance_before` DECIMAL(10,2) NOT NULL,
  `balance_after` DECIMAL(10,2) NOT NULL,
  `status` ENUM('pending', 'completed', 'failed', 'reversed') NOT NULL DEFAULT 'pending',
  `payment_method` VARCHAR(50) NULL,
  `payment_transaction_id` VARCHAR(255) NULL,
  `reference_type` VARCHAR(50) NULL,
  `reference_id` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `fee` DECIMAL(10,2) DEFAULT 0.00,
  `net_amount` DECIMAL(10,2) NULL,
  `admin_id` INT UNSIGNED NULL,
  `admin_reason` TEXT NULL,
  `metadata` JSON NULL,
  `ip_address` VARCHAR(45) NULL,
  `user_agent` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `completed_at` DATETIME NULL,
  `failed_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_created` (`user_id`, `created_at` DESC),
  KEY `idx_type_status` (`type`, `status`),
  KEY `idx_status_created` (`status`, `created_at`),
  KEY `idx_reference` (`reference_type`, `reference_id`),
  KEY `idx_payment_transaction` (`payment_transaction_id`),
  KEY `idx_created_at` (`created_at` DESC),
  CONSTRAINT `fk_wtrans_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wtrans_admin` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### Migration 3: Create Wallet Vouchers Tables
```sql
CREATE TABLE `wallet_vouchers` (
  `id` VARCHAR(50) NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `max_redemptions` INT NULL,
  `used_count` INT NOT NULL DEFAULT 0,
  `per_user_limit` INT DEFAULT 1,
  `valid_from` DATETIME NOT NULL,
  `valid_until` DATETIME NOT NULL,
  `status` ENUM('active', 'expired', 'disabled') NOT NULL DEFAULT 'active',
  `conditions` JSON NULL,
  `description` TEXT NULL,
  `created_by` INT UNSIGNED NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`),
  KEY `idx_status_valid` (`status`, `valid_from`, `valid_until`),
  CONSTRAINT `fk_voucher_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `wallet_voucher_redemptions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `voucher_id` VARCHAR(50) NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `transaction_id` VARCHAR(50) NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `redeemed_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_voucher` (`voucher_id`),
  KEY `idx_user_voucher` (`user_id`, `voucher_id`),
  KEY `idx_redeemed_at` (`redeemed_at`),
  CONSTRAINT `fk_redemption_voucher` FOREIGN KEY (`voucher_id`) REFERENCES `wallet_vouchers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_redemption_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_redemption_transaction` FOREIGN KEY (`transaction_id`) REFERENCES `wallet_transactions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### Migration 4: Initialize Wallets for Existing Users
```sql
INSERT INTO wallets (user_id, balance, status, created_at)
SELECT
  id,
  0.00,
  'active',
  NOW()
FROM users
WHERE NOT EXISTS (
  SELECT 1 FROM wallets WHERE wallets.user_id = users.id
);
```

---

## 5. Implementation Phases

### Phase 1: Backend Foundation (Week 1-2)
- ✅ Database schema creation and migrations
- ✅ Wallet model and transaction model in Strapi
- ✅ Core wallet service (balance management, transaction logging)
- ✅ Transaction ID generation utility
- ✅ Database transaction wrapper for atomicity

### Phase 2: Top-up Integration (Week 3)
- ✅ Top-up API endpoint
- ✅ Omise integration for top-up (card, PromptPay)
- ✅ Webhook handler for payment confirmation
- ✅ Transaction status updates
- ✅ Fee calculation logic

### Phase 3: Payment Integration (Week 4)
- ✅ Payment API endpoint
- ✅ Integrate wallet payment into checkout flow
- ✅ Balance validation and insufficient balance handling
- ✅ Split payment support (wallet + points)
- ✅ Receipt generation

### Phase 4: Admin Panel UI (Week 5-6)
- ✅ Wallet list page
- ✅ Wallet detail page
- ✅ Transaction list page with filters
- ✅ Manual adjustment form
- ✅ Freeze/unfreeze functionality
- ✅ Financial dashboard widgets
- ✅ Reports page

### Phase 5: Mobile App UI (Week 7-8)
- ✅ Wallet overview screen
- ✅ Top-up flow (amount selection, payment method, confirmation)
- ✅ Transaction history screen
- ✅ Transaction detail screen
- ✅ Filter/search functionality
- ✅ Integration with existing checkout flow

### Phase 6: Advanced Features (Week 9-10)
- ✅ Voucher system (creation, redemption)
- ✅ Points-to-wallet conversion
- ✅ Wallet security (PIN, biometric)
- ✅ Push notifications for transactions
- ✅ Low balance alerts
- ✅ Promotional campaigns

### Phase 7: Withdrawal (Optional - Week 11-12)
- ✅ Bank account management
- ✅ Withdrawal request flow
- ✅ Admin approval queue
- ✅ Payout processing
- ✅ Withdrawal status tracking

### Phase 8: Testing & QA (Week 13)
- ✅ Unit tests for wallet service
- ✅ Integration tests for APIs
- ✅ E2E tests for user flows
- ✅ Load testing for transaction processing
- ✅ Security audit (SQL injection, XSS, etc.)
- ✅ UAT with stakeholders

### Phase 9: Deployment (Week 14)
- ✅ Staging deployment
- ✅ Production database migration
- ✅ Production deployment
- ✅ Monitoring setup
- ✅ Documentation finalization

---

## 6. Technical Considerations

### 6.1 Transaction Atomicity
- Use database transactions for all balance updates
- Implement optimistic locking to prevent race conditions
- Rollback on any failure in multi-step operations

### 6.2 Security
- Encrypt sensitive data (bank account numbers, PINs)
- Rate limiting on API endpoints
- IP whitelisting for admin actions
- Audit logging for all balance changes
- Two-factor authentication for large withdrawals

### 6.3 Performance
- Index frequently queried columns
- Pagination for transaction lists
- Caching for wallet balance (with invalidation)
- Background jobs for async operations (refunds, payouts)

### 6.4 Compliance
- Financial transaction logging for audits
- Data retention policies
- PDPA compliance for user data
- Tax reporting (if applicable)

### 6.5 Error Handling
- Idempotency for all transaction endpoints
- Graceful degradation for payment gateway failures
- Automatic retry logic with exponential backoff
- Clear error messages for users

---

## 7. Success Metrics

### Key Performance Indicators (KPIs)

1. **Adoption Rate**
   - % of users who add wallet balance
   - % of payments made via wallet
   - Target: 40% adoption in first 3 months

2. **Transaction Volume**
   - Total wallet top-ups per month
   - Total wallet payments per month
   - Average transaction value
   - Target: ฿500K monthly volume in first quarter

3. **User Engagement**
   - Average wallet balance per user
   - Frequency of wallet usage
   - Retention rate of wallet users

4. **Operational Efficiency**
   - Transaction success rate (target: >99%)
   - Average top-up time (target: <30 seconds)
   - Refund processing time (target: <24 hours)

5. **Revenue Impact**
   - Top-up fee revenue
   - Increase in average order value
   - Reduction in payment processing costs

---

## 8. Support & Maintenance

### 8.1 User Support
- In-app help center with FAQs
- Live chat support for wallet issues
- Email support: wallet@chongjaroen.com
- Phone hotline during business hours

### 8.2 Monitoring
- Real-time transaction monitoring
- Alert system for failed transactions
- Daily reconciliation reports
- Fraud detection patterns

### 8.3 Maintenance Windows
- Scheduled maintenance: Sundays 2-4 AM
- Emergency maintenance: As needed with user notification
- Backup schedule: Daily at 1 AM

---

## Appendix A: Transaction ID Format

**Format:** `TX-YYYYMMDD-XXXXX`

**Example:** `TX-20250308-00124`

**Components:**
- `TX` - Prefix for wallet transactions
- `YYYYMMDD` - Date (ISO 8601)
- `XXXXX` - Sequential number (zero-padded, 5 digits)

**Generation Logic:**
```javascript
function generateTransactionId() {
  const date = moment().format('YYYYMMDD');
  const count = await getTransactionCountForToday();
  const sequence = String(count + 1).padStart(5, '0');
  return `TX-${date}-${sequence}`;
}
```

---

## Appendix B: Transaction Status Flow

```
Top-up Flow:
pending → completed
pending → failed

Payment Flow:
pending → completed
pending → failed
completed → reversed (refund)

Withdrawal Flow:
pending → approved → processing → completed
pending → rejected
processing → failed
```

---

## Appendix C: Error Codes

| Code | Message | Description |
|------|---------|-------------|
| `WALLET_001` | Insufficient balance | User balance < transaction amount |
| `WALLET_002` | Wallet frozen | Wallet is frozen, no transactions allowed |
| `WALLET_003` | Transaction limit exceeded | Daily/monthly limit reached |
| `WALLET_004` | Invalid amount | Amount below min or above max |
| `WALLET_005` | Payment gateway error | Omise API error |
| `WALLET_006` | Duplicate transaction | Idempotency key already used |
| `WALLET_007` | Voucher expired | Voucher code past expiration |
| `WALLET_008` | Voucher limit reached | Max redemptions exceeded |
| `WALLET_009` | Bank account not verified | Bank account needs verification |
| `WALLET_010` | Withdrawal limit exceeded | Daily/monthly withdrawal limit reached |

---

## Document Information

**Version:** 1.0
**Last Updated:** March 8, 2026
**Author:** Prachum Chanman
**Status:** Draft for Review
**Next Review Date:** March 15, 2026

---
