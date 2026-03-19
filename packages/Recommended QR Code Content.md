Recommended QR Code Content

  {
    "userId": 12345,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "qrId": "QR-20250308-00123",
    "expiresAt": "2025-03-08T20:00:00+07:00",
    "type": "wallet_payment"
  }

  Or as a compact encoded string:

  wallet://pay?uid=12345&token=abc123xyz&qr=QR-20250308-00123&exp=1709906400

  Key Fields Explained:

  | Field     | Description                       | Purpose                                            |
  |-----------|-----------------------------------|----------------------------------------------------|
  | userId    | User's unique ID                  | Identify which wallet to deduct from               |
  | token     | Time-limited authentication token | Secure authorization for payment                   |
  | qrId      | Unique QR transaction ID          | Prevent duplicate scans, audit trail               |
  | expiresAt | Expiration timestamp              | Security - QR expires after 5-15 minutes           |
  | type      | "wallet_payment"                  | Distinguish from other QR types (checkout, top-up) |

  How It Works:

  1. Beer Vending Machine Flow

  User opens wallet → Generate QR code → Show to vending machine
                                                ↓
                                Vending machine scans QR
                                                ↓
                                API call: GET /api/wallet/validate-payment
                                Body: { userId, token, qrId }
                                                ↓
                                Response: { balance: 1250.00, canPay: true }
                                                ↓
                                User presses button (฿80 beer)
                                                ↓
                                API call: POST /api/wallet/deduct
                                Body: { userId, token, qrId, amount: 80.00,
                                        reference: "vending_machine_001" }
                                                ↓
                                Response: { success: true, newBalance: 1170.00 }

  2. Restaurant POS Flow

  User orders food (total: ฿320)
                  ↓
  User opens wallet → Generate QR code → Staff scans QR
                                                ↓
                                POS calls: GET /api/wallet/validate-payment
                                Body: { userId, token, qrId }
                                                ↓
                                Response: { balance: 1250.00, canPay: true }
                                                ↓
                                Staff enters amount: ฿320
                                                ↓
                                POS calls: POST /api/wallet/deduct
                                Body: { userId, token, qrId, amount: 320.00,
                                        reference: "order_A-00456" }
                                                ↓
                                Response: { success: true, newBalance: 930.00,
                                           transactionId: "TX-20250308-00125" }

  Required Backend API Endpoints:

  GET /api/wallet/validate-payment

  Validates the QR code and checks balance (called before payment)

  Request:
  {
    "userId": 12345,
    "token": "abc123xyz",
    "qrId": "QR-20250308-00123"
  }

  Response:
  {
    "success": true,
    "data": {
      "balance": 1250.00,
      "status": "active",
      "canPay": true,
      "minBalance": 500.00,
      "firstName": "Somchai",
      "lastName": "Jaidee"
    }
  }

  POST /api/wallet/deduct

  Deducts amount from wallet (called after confirming payment)

  Request:
  {
    "userId": 12345,
    "token": "abc123xyz",
    "qrId": "QR-20250308-00123",
    "amount": 320.00,
    "referenceType": "order",
    "referenceId": "A-00456",
    "description": "Payment for Order A-00456"
  }

  Response:
  {
    "success": true,
    "data": {
      "transactionId": "TX-20250308-00125",
      "amount": 320.00,
      "balanceBefore": 1250.00,
      "balanceAfter": 930.00,
      "timestamp": "2025-03-08T19:30:15+07:00",
      "receiptUrl": "https://..."
    }
  }

  Security Considerations:

  1. Token Expiration: QR code expires after 5-15 minutes
  2. One-time Use Token: Optional - invalidate token after first successful payment
  3. Rate Limiting: Prevent rapid successive payments
  4. Minimum Balance Check: For beer vending (฿500 minimum)
  5. Transaction Limits: Max ฿10,000 per transaction (configurable)
  6. Audit Log: Record all QR generations and payment attempts

  Mobile App Flow:

  // User taps "Show Payment QR" in wallet
  Future<String> generatePaymentQR() async {
    final response = await api.post('/api/wallet/generate-payment-qr');

    final qrData = {
      'userId': response.data['userId'],
      'token': response.data['token'],
      'qrId': response.data['qrId'],
      'expiresAt': response.data['expiresAt'],
      'type': 'wallet_payment'
    };

    return jsonEncode(qrData);
  }

