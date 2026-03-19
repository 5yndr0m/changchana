# Wallet API Testing Guide

Quick reference for testing wallet payment APIs using Postman or cURL.

## Prerequisites

1. Set your Omise test key in `.env`:
```env
OMISE_SECRET_KEY=skey_test_5xyz123abc
```

2. Get a JWT token by logging in:
```bash
POST /auth/local
{
  "identifier": "user@example.com",
  "password": "password123"
}
```

---

## API Testing Examples

### 1. Get Wallet Balance

```bash
curl -X GET http://localhost:7001/api/wallet/balance \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "balance": "1000.00",
    "pending_balance": "0.00",
    "frozen_balance": "0.00",
    "status": "active"
  }
}
```

---

### 2. Get Wallet Transactions

```bash
curl -X GET "http://localhost:7001/api/wallet/transactions?limit=10&offset=0" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 3. Get Payment Methods

```bash
curl -X GET http://localhost:7001/api/wallet/payment/methods \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "mobile_banking": [
      {
        "id": "mobile_banking_kbank",
        "name": "K PLUS",
        "bank": "Kasikorn Bank",
        "icon": "kbank"
      }
    ],
    "promptpay": {
      "id": "promptpay",
      "name": "PromptPay QR",
      "icon": "promptpay"
    }
  }
}
```

---

### 4. Create Payment Source (K PLUS)

```bash
curl -X POST http://localhost:7001/api/wallet/payment/create-source \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 500,
    "paymentMethod": "mobile_banking_kbank",
    "returnUri": "myapp://payment-result"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "chargeId": "chrg_test_5xyz123abc",
    "sourceId": "src_test_5xyz456def",
    "authorizeUri": "https://pay.omise.co/payments/paym_test_5xyz789ghi/authorize",
    "amount": 500,
    "status": "pending",
    "scannable_code": null
  }
}
```

**Next Steps:**
1. Copy the `authorizeUri`
2. Open it in a browser
3. Click "Authorize Test Payment" (in test mode)
4. You'll be redirected to: `myapp://payment-result?chargeId=chrg_test_5xyz123abc`

---

### 5. Create PromptPay QR Payment

```bash
curl -X POST http://localhost:7001/api/wallet/payment/create-source \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 500,
    "paymentMethod": "promptpay",
    "returnUri": "myapp://payment-result"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "chargeId": "chrg_test_5xyz123abc",
    "sourceId": "src_test_5xyz456def",
    "authorizeUri": null,
    "amount": 500,
    "status": "pending",
    "scannable_code": {
      "type": "qr",
      "image": {
        "download_uri": "https://cdn.omise.co/...",
        "large": "https://cdn.omise.co/...",
        "small": "https://cdn.omise.co/..."
      }
    }
  }
}
```

---

### 6. Check Payment Status

```bash
curl -X GET http://localhost:7001/api/wallet/payment/status/chrg_test_5xyz123abc \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response (Successful):**
```json
{
  "success": true,
  "data": {
    "chargeId": "chrg_test_5xyz123abc",
    "status": "successful",
    "paid": true,
    "amount": 500,
    "failureCode": null,
    "failureMessage": null
  }
}
```

**Expected Response (Failed):**
```json
{
  "success": true,
  "data": {
    "chargeId": "chrg_test_5xyz123abc",
    "status": "failed",
    "paid": false,
    "amount": 500,
    "failureCode": "insufficient_fund",
    "failureMessage": "Insufficient funds in account"
  }
}
```

---

### 7. Transfer to Another User

```bash
curl -X POST http://localhost:7001/api/wallet/transfer \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "receiverUserId": 123,
    "amount": 100,
    "description": "Payment for lunch"
  }'
```

---

### 8. Redeem Points

```bash
curl -X POST http://localhost:7001/api/wallet/redeem-points \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "points": 1000,
    "description": "Redeem points to wallet"
  }'
```

---

## Testing Payment Flow End-to-End

### Step 1: Create Payment Source
```bash
RESPONSE=$(curl -s -X POST http://localhost:7001/api/wallet/payment/create-source \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 500,
    "paymentMethod": "mobile_banking_kbank",
    "returnUri": "myapp://payment-result"
  }')

echo $RESPONSE
```

### Step 2: Extract chargeId and authorizeUri
```bash
CHARGE_ID=$(echo $RESPONSE | jq -r '.data.chargeId')
AUTHORIZE_URI=$(echo $RESPONSE | jq -r '.data.authorizeUri')

echo "Charge ID: $CHARGE_ID"
echo "Authorize URI: $AUTHORIZE_URI"
```

### Step 3: Open in Browser (Manual)
Open the `AUTHORIZE_URI` in a browser and click "Authorize Test Payment"

### Step 4: Check Payment Status
```bash
curl -X GET "http://localhost:7001/api/wallet/payment/status/$CHARGE_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Step 5: Verify Wallet Balance Increased
```bash
curl -X GET http://localhost:7001/api/wallet/balance \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Webhook Testing

### Setup Webhook Endpoint

In Omise Dashboard:
1. Go to Settings > Webhooks
2. Add endpoint: `https://your-domain.com/api/wallet/payment/webhook`
3. Select events: `charge.complete`

### Test Webhook Locally with ngrok

1. Install ngrok: `npm install -g ngrok`

2. Start ngrok:
```bash
ngrok http 7001
```

3. Use the ngrok URL in Omise webhook settings:
```
https://abc123.ngrok.io/api/wallet/payment/webhook
```

4. Test webhook manually:
```bash
curl -X POST http://localhost:7001/api/wallet/payment/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "id": "evt_test_123",
    "key": "charge.complete",
    "data": {
      "id": "chrg_test_5xyz123abc",
      "paid": true,
      "status": "successful",
      "amount": 50000,
      "metadata": {
        "user_id": 1
      }
    }
  }'
```

---

## Common Test Scenarios

### 1. Minimum Top-up Amount
```bash
# Should fail - amount too low
curl -X POST http://localhost:7001/api/wallet/payment/create-source \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5,
    "paymentMethod": "mobile_banking_kbank",
    "returnUri": "myapp://payment-result"
  }'
```

**Expected:** Error response with minimum amount requirement

---

### 2. Invalid Payment Method
```bash
curl -X POST http://localhost:7001/api/wallet/payment/create-source \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "paymentMethod": "invalid_method",
    "returnUri": "myapp://payment-result"
  }'
```

**Expected:** Error response with invalid payment method

---

### 3. Unauthorized Access
```bash
curl -X GET http://localhost:7001/api/wallet/balance
```

**Expected:** 401 Unauthorized

---

## Debugging Tips

### Check Logs
```bash
# Backend logs
tail -f backend/logs/strapi.log

# Or check console output where backend is running
```

### Common Issues

1. **"Authentication required"**
   - Make sure JWT token is included in Authorization header
   - Token format: `Bearer YOUR_TOKEN`

2. **"Failed to create payment source"**
   - Check OMISE_SECRET_KEY in .env
   - Verify key starts with `skey_test_` for test mode
   - Check Omise API status

3. **"Invalid payment method"**
   - Use exact method IDs from `/payment/methods` endpoint
   - Common: `mobile_banking_kbank`, not `kbank`

4. **Webhook not received**
   - Verify webhook URL is publicly accessible
   - Check Omise webhook logs in dashboard
   - Ensure endpoint returns 200 status

---

## Postman Collection

Import this collection to Postman:

```json
{
  "info": {
    "name": "Wallet API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:7001"
    },
    {
      "key": "token",
      "value": "YOUR_JWT_TOKEN"
    }
  ],
  "item": [
    {
      "name": "Get Balance",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": "{{baseUrl}}/api/wallet/balance"
      }
    },
    {
      "name": "Create Payment",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"amount\": 500,\n  \"paymentMethod\": \"mobile_banking_kbank\",\n  \"returnUri\": \"myapp://payment-result\"\n}"
        },
        "url": "{{baseUrl}}/api/wallet/payment/create-source"
      }
    }
  ]
}
```

Save this to a file and import it into Postman for quick testing.
