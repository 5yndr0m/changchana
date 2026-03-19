# Wallet Payment Implementation Summary

Complete Omise payment integration for Flutter app with mobile banking app-to-app flow.

## What Was Created

### 1. Backend Files

#### `/api/wallet/services/payment.js`
Payment service that handles all Omise operations:
- `createMobileBankingSource()` - Creates payment source for mobile banking (K PLUS, SCB, etc.)
- `createPromptPaySource()` - Creates PromptPay QR payment source
- `createCharge()` - Creates a charge from a payment source
- `getChargeStatus()` - Retrieves payment status
- `processSuccessfulPayment()` - Credits wallet after successful payment
- `getSupportedPaymentMethods()` - Returns list of available payment methods

#### `/api/api/controllers/wallet.js` (Updated)
Added new controller functions:
- `getWalletBalance()` - Get user's wallet balance
- `getWalletTransactions()` - Get transaction history with filters
- `createPaymentSource()` - Initiate payment (mobile banking or PromptPay)
- `checkPaymentStatus()` - Check if payment completed
- `handlePaymentWebhook()` - Handle Omise webhook events
- `getPaymentMethods()` - Get supported payment methods

#### `/api/api/config/routes.json` (Updated)
Added 6 new API endpoints:
- `GET /api/wallet/balance`
- `GET /api/wallet/transactions`
- `POST /api/wallet/payment/create-source`
- `GET /api/wallet/payment/status/:chargeId`
- `POST /api/wallet/payment/webhook`
- `GET /api/wallet/payment/methods`

### 2. Documentation Files

#### `FLUTTER_WALLET_API_INTEGRATION.md`
Complete integration guide for Flutter developers including:
- All API endpoints with request/response examples
- Payment flow diagrams
- Flutter code examples (API service, payment screens, PromptPay)
- Deep link configuration for Android & iOS
- Production checklist

#### `WALLET_API_TESTING.md`
Testing guide with:
- cURL examples for all endpoints
- Postman collection
- End-to-end testing flow
- Webhook testing with ngrok
- Common issues and debugging tips

#### `.env` (Updated)
Added Omise configuration with helpful comments

---

## API Endpoints Overview

### Wallet Management
```
GET  /api/wallet/balance              - Get wallet balance
GET  /api/wallet/transactions         - Get transaction history
POST /api/wallet/transfer             - Transfer to another user (existing)
POST /api/wallet/redeem-points        - Redeem points (existing)
```

### Payment Operations
```
GET  /api/wallet/payment/methods      - Get supported payment methods
POST /api/wallet/payment/create-source - Create payment (mobile/QR)
GET  /api/wallet/payment/status/:id   - Check payment status
POST /api/wallet/payment/webhook      - Omise webhook handler
```

---

## Payment Flow

### Mobile Banking (K PLUS, SCB, etc.)

1. **Flutter App → Backend**
   ```
   POST /api/wallet/payment/create-source
   {
     "amount": 500,
     "paymentMethod": "mobile_banking_kbank",
     "returnUri": "myapp://payment-result"
   }
   ```

2. **Backend → Omise**
   - Creates payment source
   - Creates charge
   - Returns `authorizeUri`

3. **Flutter App**
   - Opens `authorizeUri` with url_launcher
   - Banking app launches
   - User confirms payment

4. **Banking App → Flutter App**
   - Deep link redirect: `myapp://payment-result?chargeId=xxx`

5. **Flutter App → Backend**
   ```
   GET /api/wallet/payment/status/{chargeId}
   ```

6. **Backend**
   - Checks Omise charge status
   - If successful, credits wallet
   - Returns payment result

7. **Omise → Backend (Webhook)**
   ```
   POST /api/wallet/payment/webhook
   ```
   - Backup confirmation via webhook
   - Ensures payment is processed even if app is closed

### PromptPay QR

1. **Flutter App → Backend**
   ```
   POST /api/wallet/payment/create-source
   {
     "amount": 500,
     "paymentMethod": "promptpay",
     "returnUri": "myapp://payment-result"
   }
   ```

2. **Backend Response**
   - Returns QR code image URL
   - Returns `chargeId`

3. **Flutter App**
   - Displays QR code
   - Polls payment status every 3 seconds

4. **User Scans QR**
   - Any PromptPay app (banking app, payment wallet)
   - Confirms payment

5. **Polling Detects Success**
   - Shows success message
   - Updates wallet balance

---

## Supported Payment Methods

### Mobile Banking (App-to-App)
- **K PLUS** - Kasikorn Bank (`mobile_banking_kbank`)
- **SCB Easy** - Siam Commercial Bank (`mobile_banking_scb`)
- **KMA** - Bank of Ayudhya/Krungsri (`mobile_banking_bay`)
- **Bualuang mBanking** - Bangkok Bank (`mobile_banking_bbl`)

### QR Code
- **PromptPay** - Universal QR payment (`promptpay`)

---

## Database Schema

The implementation uses existing wallet tables:

### `wallets` table
```sql
- user_id (FK to users)
- balance (DECIMAL)
- pending_balance (DECIMAL)
- frozen_balance (DECIMAL)
- status (ENUM: active, frozen)
```

### `wallet_transactions` table
```sql
- transaction_id (VARCHAR, unique)
- user_id (FK to users)
- type (ENUM: topup, payment, transfer, refund, adjustment)
- amount (DECIMAL)
- status (ENUM: pending, completed, failed, cancelled)
- description (TEXT)
- metadata (JSON) - stores charge_id, source_id, payment_method
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

---

## Configuration Required

### 1. Environment Variables

Add to `.env`:
```env
OMISE_SECRET_KEY=skey_test_xxxxx  # Test mode
# OMISE_SECRET_KEY=skey_xxxxx     # Production mode
OMISE_PROMPT_PAY_EXPIRE=15
```

Get your keys from: https://dashboard.omise.co/

### 2. Omise Dashboard Setup

**Test Mode:**
1. Use test secret key (`skey_test_xxxxx`)
2. Test payments without real money
3. Use test authorization page

**Production Mode:**
1. Submit KYC documents to Omise
2. Get approved
3. Switch to live key (`skey_xxxxx`)
4. Configure webhook: `https://your-domain.com/api/wallet/payment/webhook`
5. Enable events: `charge.complete`

### 3. Flutter App Configuration

**Android** (`AndroidManifest.xml`):
```xml
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data
        android:scheme="myapp"
        android:host="payment-result" />
</intent-filter>
```

**iOS** (`Info.plist`):
```xml
<key>CFBundleURLSchemes</key>
<array>
    <string>myapp</string>
</array>

<key>LSApplicationQueriesSchemes</key>
<array>
    <string>kplus</string>
    <string>scbeasy</string>
    <string>krungsri</string>
    <string>bualuang</string>
</array>
```

**Flutter packages** (`pubspec.yaml`):
```yaml
dependencies:
  url_launcher: ^6.2.0
  uni_links: ^0.5.1
  http: ^1.1.0
  qr_flutter: ^4.1.0
```

---

## Security Considerations

### Authentication
- All wallet endpoints require JWT authentication
- User can only access their own wallet
- User ID extracted from JWT token

### Payment Security
- Payments processed via Omise (PCI DSS compliant)
- No card data stored on your server
- Webhook signature verification (if implemented)

### Transaction Integrity
- Database transactions ensure atomic operations
- Duplicate payment prevention (check existing transaction_id)
- Status tracking (pending → completed/failed)

---

## Testing

### Quick Test (Development)

1. **Set Test Key**
   ```env
   OMISE_SECRET_KEY=skey_test_5xyz123abc
   ```

2. **Get JWT Token**
   ```bash
   POST /auth/local
   {
     "identifier": "user@example.com",
     "password": "password"
   }
   ```

3. **Create Payment**
   ```bash
   curl -X POST http://localhost:7001/api/wallet/payment/create-source \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "amount": 100,
       "paymentMethod": "mobile_banking_kbank",
       "returnUri": "myapp://payment-result"
     }'
   ```

4. **Open Authorize URI**
   - Copy `authorizeUri` from response
   - Open in browser
   - Click "Authorize Test Payment"

5. **Check Status**
   ```bash
   curl -X GET http://localhost:7001/api/wallet/payment/status/CHARGE_ID \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

6. **Verify Balance**
   ```bash
   curl -X GET http://localhost:7001/api/wallet/balance \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

---

## Production Deployment Checklist

### Backend
- [ ] Replace test key with production key in `.env`
- [ ] Configure Omise webhook URL
- [ ] Whitelist Omise webhook IPs
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure logging for payment transactions
- [ ] Test all payment methods in production
- [ ] Set up alerts for failed payments
- [ ] Review transaction fees with Omise

### Flutter App
- [ ] Update deep link scheme (use production scheme)
- [ ] Test deep links on physical devices (both iOS/Android)
- [ ] Implement proper error messages
- [ ] Add loading states
- [ ] Test offline scenarios
- [ ] Add payment timeout handling
- [ ] Test on various screen sizes
- [ ] Submit app for review (App Store/Play Store)

### Compliance
- [ ] Review Omise terms of service
- [ ] Add privacy policy for payment data
- [ ] Add terms & conditions for wallet
- [ ] Ensure PDPA compliance (Thailand)
- [ ] Add refund policy

---

## Monitoring & Maintenance

### Logs to Monitor
```javascript
// Payment creation
[Payment] Created mobile banking source: { id, type, amount }
[Payment] Created charge: { id, amount, status, source }

// Payment completion
[Payment] Wallet credited successfully: { userId, amount, chargeId, transactionId }

// Webhook events
[Payment] Webhook received: { type, id }
[Payment] Webhook processed successfully: chargeId
```

### Metrics to Track
- Total top-up volume
- Success rate by payment method
- Average top-up amount
- Failed payment reasons
- Time from initiation to completion
- Webhook delivery success rate

### Common Issues
1. **Webhook not received** - Check URL, SSL, IP whitelist
2. **Payment stuck in pending** - User didn't complete, or webhook failed
3. **Duplicate transactions** - Transaction ID collision (unlikely)
4. **Deep link not working** - App not installed, or scheme misconfigured

---

## Support Resources

- **Omise Documentation**: https://docs.opn.ooo/
- **Omise Dashboard**: https://dashboard.omise.co/
- **Omise Support**: support@omise.co
- **Flutter Deep Links**: https://docs.flutter.dev/cookbook/navigation/set-up-app-links

---

## Next Steps

1. **Add Payment Methods**
   - Credit/Debit cards
   - Installment payments
   - Rabbit LINE Pay
   - TrueMoney Wallet

2. **Enhanced Features**
   - Auto top-up (when balance low)
   - Recurring payments
   - Payment schedules
   - Multi-currency support

3. **Analytics**
   - Payment method preferences
   - User top-up patterns
   - Failed payment analysis
   - Revenue tracking

4. **UX Improvements**
   - Save preferred payment method
   - Quick top-up amounts (100, 500, 1000)
   - Payment history filters
   - Receipt generation

---

## File Structure

```
backend/
├── api/
│   ├── wallet/
│   │   └── services/
│   │       └── payment.js          # NEW: Omise integration service
│   └── api/
│       ├── controllers/
│       │   └── wallet.js           # UPDATED: Added payment endpoints
│       └── config/
│           └── routes.json         # UPDATED: Added payment routes
├── .env                            # UPDATED: Omise config
├── FLUTTER_WALLET_API_INTEGRATION.md    # NEW: Flutter integration guide
├── WALLET_API_TESTING.md                # NEW: API testing guide
└── WALLET_PAYMENT_IMPLEMENTATION_SUMMARY.md  # NEW: This file
```

---

## License & Credits

- **Omise** - Payment gateway provider
- **Strapi** - Backend framework
- **Flutter** - Mobile app framework

---

**Implementation Date**: March 2024
**Version**: 1.0
**Status**: Ready for testing
