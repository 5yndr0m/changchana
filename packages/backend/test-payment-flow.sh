#!/bin/bash

echo "=== WALLET PAYMENT API - COMPLETE FLOW TEST ==="
echo ""

# Step 1: Login
echo "1️⃣  LOGIN & GET JWT TOKEN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

LOGIN_RESPONSE=$(curl -s -X POST http://localhost:7001/auth/local \
  -H 'Content-Type: application/json' \
  -d '{"identifier":"gazzium@gmail.com","password":"abc1234"}')

JWT=$(echo "$LOGIN_RESPONSE" | jq -r '.jwt')

if [ "$JWT" = "null" ] || [ -z "$JWT" ]; then
  echo "❌ Login failed!"
  echo "$LOGIN_RESPONSE" | jq .
  exit 1
fi

echo "✅ Login successful!"
echo "User: $(echo "$LOGIN_RESPONSE" | jq -r '.user.email')"
echo "User ID: $(echo "$LOGIN_RESPONSE" | jq -r '.user.id')"
echo "JWT Token: ${JWT:0:50}..."
echo ""

# Step 2: Get Wallet Balance
echo "2️⃣  GET WALLET BALANCE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

BALANCE_RESPONSE=$(curl -s -X GET http://localhost:7001/api/wallet/balance \
  -H "Authorization: Bearer $JWT")

echo "$BALANCE_RESPONSE" | jq .
echo ""

# Step 3: Get Payment Methods
echo "3️⃣  GET PAYMENT METHODS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

METHODS_RESPONSE=$(curl -s -X GET http://localhost:7001/api/wallet/payment/methods \
  -H "Authorization: Bearer $JWT")

echo "$METHODS_RESPONSE" | jq .
echo ""

# Step 4: Get Transaction History
echo "4️⃣  GET TRANSACTION HISTORY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

TRANSACTIONS_RESPONSE=$(curl -s -X GET "http://localhost:7001/api/wallet/transactions?limit=5" \
  -H "Authorization: Bearer $JWT")

echo "$TRANSACTIONS_RESPONSE" | jq .
echo ""

# Step 5: Create Payment Source (K PLUS)
echo "5️⃣  CREATE PAYMENT SOURCE (K PLUS)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

PAYMENT_RESPONSE=$(curl -s -X POST http://localhost:7001/api/wallet/payment/create-source \
  -H "Authorization: Bearer $JWT" \
  -H 'Content-Type: application/json' \
  -d '{
    "amount": 100,
    "paymentMethod": "mobile_banking_kbank",
    "returnUri": "myapp://payment-result"
  }')

echo "$PAYMENT_RESPONSE" | jq .

# Extract charge ID and authorize URI
CHARGE_ID=$(echo "$PAYMENT_RESPONSE" | jq -r '.data.chargeId')
AUTHORIZE_URI=$(echo "$PAYMENT_RESPONSE" | jq -r '.data.authorizeUri')

echo ""
echo "📱 NEXT STEPS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$AUTHORIZE_URI" != "null" ]; then
  echo "✓ Charge ID: $CHARGE_ID"
  echo "✓ Authorize URI: $AUTHORIZE_URI"
  echo ""
  echo "To complete payment:"
  echo "1. Open this URL in your browser:"
  echo "   $AUTHORIZE_URI"
  echo ""
  echo "2. Click 'Authorize Test Payment'"
  echo ""
  echo "3. Check payment status with:"
  echo "   curl -X GET http://localhost:7001/api/wallet/payment/status/$CHARGE_ID \\"
  echo "     -H 'Authorization: Bearer $JWT' | jq ."
else
  echo "⚠️  Payment creation response:"
  echo "$PAYMENT_RESPONSE" | jq .
fi

echo ""
echo "=== TEST COMPLETE ==="
