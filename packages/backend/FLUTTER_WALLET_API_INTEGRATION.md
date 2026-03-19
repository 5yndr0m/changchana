# Flutter Wallet API Integration Guide

Complete guide for integrating Omise payment with Flutter app for wallet top-ups using mobile banking app-to-app flow.

## Table of Contents
- [API Endpoints](#api-endpoints)
- [Payment Flow](#payment-flow)
- [Flutter Setup](#flutter-setup)
- [Code Examples](#code-examples)
- [Deep Link Configuration](#deep-link-configuration)

---

## API Endpoints

### 1. Get Wallet Balance
```
GET /api/wallet/balance
Authorization: Bearer {jwt_token}
```

**Response:**
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
```
GET /api/wallet/transactions?limit=50&offset=0&type=topup&status=completed
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
- `limit` (optional): Number of records (default: 50)
- `offset` (optional): Pagination offset (default: 0)
- `type` (optional): Filter by type (topup, payment, transfer, refund, adjustment)
- `status` (optional): Filter by status (pending, completed, failed, cancelled)

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": 1,
        "transaction_id": "topup_1234567890",
        "type": "topup",
        "amount": "500.00",
        "status": "completed",
        "description": "Wallet top-up via mobile_banking_kbank",
        "created_at": "2024-03-15T10:30:00.000Z"
      }
    ],
    "total": 100,
    "limit": 50,
    "offset": 0
  }
}
```

---

### 3. Get Supported Payment Methods
```
GET /api/wallet/payment/methods
Authorization: Bearer {jwt_token}
```

**Response:**
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
      },
      {
        "id": "mobile_banking_scb",
        "name": "SCB Easy",
        "bank": "Siam Commercial Bank",
        "icon": "scb"
      },
      {
        "id": "mobile_banking_bay",
        "name": "KMA",
        "bank": "Bank of Ayudhya (Krungsri)",
        "icon": "bay"
      },
      {
        "id": "mobile_banking_bbl",
        "name": "Bualuang mBanking",
        "bank": "Bangkok Bank",
        "icon": "bbl"
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

### 4. Create Payment Source (Mobile Banking)
```
POST /api/wallet/payment/create-source
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "amount": 500,
  "paymentMethod": "mobile_banking_kbank",
  "returnUri": "myapp://payment-result"
}
```

**Parameters:**
- `amount` (required): Amount in THB (minimum: 10)
- `paymentMethod` (required): Payment method ID
  - Mobile Banking: `mobile_banking_kbank`, `mobile_banking_scb`, `mobile_banking_bay`, `mobile_banking_bbl`
  - PromptPay: `promptpay`
- `returnUri` (required): Deep link URL to return to your app

**Response:**
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

**For PromptPay QR:**
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
        "download_uri": "https://...",
        "large": "https://...",
        "small": "https://..."
      }
    }
  }
}
```

---

### 5. Check Payment Status
```
GET /api/wallet/payment/status/:chargeId
Authorization: Bearer {jwt_token}
```

**Response:**
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

**Possible Status Values:**
- `pending`: Payment is pending
- `successful`: Payment completed successfully
- `failed`: Payment failed
- `expired`: Payment expired

---

## Payment Flow

### Mobile Banking Flow (e.g., K PLUS)

```
┌─────────────┐
│ Flutter App │
└──────┬──────┘
       │
       │ 1. User selects "Pay with K PLUS" and amount
       │
       ▼
┌─────────────────────────┐
│ POST /payment/create-   │
│ source                  │
│ - amount: 500           │
│ - paymentMethod: kbank  │
│ - returnUri: myapp://   │
└──────┬──────────────────┘
       │
       │ 2. Backend creates source & charge
       │
       ▼
┌─────────────────────────┐
│ Response:               │
│ - chargeId              │
│ - authorizeUri          │
└──────┬──────────────────┘
       │
       │ 3. Open authorizeUri with url_launcher
       │
       ▼
┌─────────────────────────┐
│ K PLUS App Opens        │
│ User authorizes payment │
└──────┬──────────────────┘
       │
       │ 4. Payment confirmed
       │
       ▼
┌─────────────────────────┐
│ Deep Link Redirect:     │
│ myapp://payment-result  │
│ ?chargeId=chrg_xxx      │
└──────┬──────────────────┘
       │
       │ 5. App catches deep link
       │
       ▼
┌─────────────────────────┐
│ GET /payment/status/    │
│ {chargeId}              │
└──────┬──────────────────┘
       │
       │ 6. Check payment status
       │
       ▼
┌─────────────────────────┐
│ Show success/failure    │
│ Update wallet balance   │
└─────────────────────────┘
```

---

## Flutter Setup

### 1. Add Dependencies

```yaml
# pubspec.yaml
dependencies:
  url_launcher: ^6.2.0
  uni_links: ^0.5.1
  http: ^1.1.0
  qr_flutter: ^4.1.0  # For PromptPay QR
```

### 2. Configure Deep Links

#### Android (AndroidManifest.xml)
```xml
<activity android:name=".MainActivity">
    <!-- ... existing config ... -->

    <!-- Deep Link Configuration -->
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data
            android:scheme="myapp"
            android:host="payment-result" />
    </intent-filter>
</activity>
```

#### iOS (Info.plist)
```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleTypeRole</key>
        <string>Editor</string>
        <key>CFBundleURLName</key>
        <string>com.yourcompany.yourapp</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>myapp</string>
        </array>
    </dict>
</array>

<!-- For url_launcher -->
<key>LSApplicationQueriesSchemes</key>
<array>
    <string>kplus</string>
    <string>scbeasy</string>
    <string>krungsri</string>
    <string>bualuang</string>
</array>
```

---

## Code Examples

### 1. API Service

```dart
// lib/services/wallet_api_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class WalletApiService {
  final String baseUrl = 'http://your-api-url.com';
  final String token;

  WalletApiService(this.token);

  Map<String, String> get _headers => {
    'Authorization': 'Bearer $token',
    'Content-Type': 'application/json',
  };

  // Get wallet balance
  Future<Map<String, dynamic>> getBalance() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/wallet/balance'),
      headers: _headers,
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load balance');
    }
  }

  // Get transactions
  Future<Map<String, dynamic>> getTransactions({
    int limit = 50,
    int offset = 0,
    String? type,
    String? status,
  }) async {
    var url = '$baseUrl/api/wallet/transactions?limit=$limit&offset=$offset';
    if (type != null) url += '&type=$type';
    if (status != null) url += '&status=$status';

    final response = await http.get(
      Uri.parse(url),
      headers: _headers,
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load transactions');
    }
  }

  // Get payment methods
  Future<Map<String, dynamic>> getPaymentMethods() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/wallet/payment/methods'),
      headers: _headers,
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load payment methods');
    }
  }

  // Create payment source
  Future<Map<String, dynamic>> createPaymentSource({
    required double amount,
    required String paymentMethod,
    required String returnUri,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/wallet/payment/create-source'),
      headers: _headers,
      body: json.encode({
        'amount': amount,
        'paymentMethod': paymentMethod,
        'returnUri': returnUri,
      }),
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to create payment source');
    }
  }

  // Check payment status
  Future<Map<String, dynamic>> checkPaymentStatus(String chargeId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/wallet/payment/status/$chargeId'),
      headers: _headers,
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to check payment status');
    }
  }
}
```

### 2. Payment Screen

```dart
// lib/screens/wallet/top_up_screen.dart
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:uni_links/uni_links.dart';
import 'dart:async';

class TopUpScreen extends StatefulWidget {
  @override
  _TopUpScreenState createState() => _TopUpScreenState();
}

class _TopUpScreenState extends State<TopUpScreen> {
  final WalletApiService _api = WalletApiService('your-jwt-token');
  StreamSubscription? _deepLinkSubscription;
  double _amount = 100;
  bool _isProcessing = false;
  String? _currentChargeId;

  @override
  void initState() {
    super.initState();
    _initDeepLinks();
  }

  @override
  void dispose() {
    _deepLinkSubscription?.cancel();
    super.dispose();
  }

  // Initialize deep link listener
  void _initDeepLinks() {
    _deepLinkSubscription = uriLinkStream.listen((Uri? uri) {
      if (uri != null && uri.scheme == 'myapp' && uri.host == 'payment-result') {
        _handlePaymentReturn(uri);
      }
    }, onError: (err) {
      print('Deep link error: $err');
    });
  }

  // Handle payment return from bank app
  void _handlePaymentReturn(Uri uri) async {
    if (_currentChargeId == null) return;

    setState(() => _isProcessing = true);

    try {
      final result = await _api.checkPaymentStatus(_currentChargeId!);
      final data = result['data'];

      if (data['paid'] == true && data['status'] == 'successful') {
        _showSuccessDialog(data['amount']);
      } else {
        _showFailureDialog(data['failureMessage'] ?? 'Payment failed');
      }
    } catch (e) {
      _showFailureDialog('Error checking payment status');
    } finally {
      setState(() {
        _isProcessing = false;
        _currentChargeId = null;
      });
    }
  }

  // Process payment with K PLUS
  Future<void> _payWithKPlus() async {
    setState(() => _isProcessing = true);

    try {
      final result = await _api.createPaymentSource(
        amount: _amount,
        paymentMethod: 'mobile_banking_kbank',
        returnUri: 'myapp://payment-result',
      );

      final data = result['data'];
      _currentChargeId = data['chargeId'];
      final authorizeUri = data['authorizeUri'];

      if (authorizeUri != null) {
        final uri = Uri.parse(authorizeUri);
        if (await canLaunchUrl(uri)) {
          await launchUrl(uri, mode: LaunchMode.externalApplication);
        } else {
          throw Exception('Cannot launch payment URL');
        }
      }
    } catch (e) {
      setState(() => _isProcessing = false);
      _showFailureDialog('Failed to initiate payment: $e');
    }
  }

  void _showSuccessDialog(double amount) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Payment Successful'),
        content: Text('฿${amount.toStringAsFixed(2)} has been added to your wallet'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              Navigator.of(context).pop(); // Go back to wallet screen
            },
            child: Text('OK'),
          ),
        ],
      ),
    );
  }

  void _showFailureDialog(String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Payment Failed'),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Top Up Wallet')),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            // Amount input
            TextField(
              decoration: InputDecoration(
                labelText: 'Amount (THB)',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
              onChanged: (value) {
                setState(() => _amount = double.tryParse(value) ?? 100);
              },
            ),
            SizedBox(height: 20),

            // Payment method buttons
            ElevatedButton.icon(
              onPressed: _isProcessing ? null : _payWithKPlus,
              icon: Icon(Icons.payment),
              label: Text('Pay with K PLUS'),
              style: ElevatedButton.styleFrom(
                minimumSize: Size(double.infinity, 50),
              ),
            ),

            if (_isProcessing)
              Padding(
                padding: EdgeInsets.only(top: 20),
                child: CircularProgressIndicator(),
              ),
          ],
        ),
      ),
    );
  }
}
```

### 3. PromptPay QR Code Implementation

```dart
// lib/screens/wallet/promptpay_screen.dart
import 'package:qr_flutter/qr_flutter.dart';

class PromptPayScreen extends StatefulWidget {
  final double amount;

  PromptPayScreen({required this.amount});

  @override
  _PromptPayScreenState createState() => _PromptPayScreenState();
}

class _PromptPayScreenState extends State<PromptPayScreen> {
  final WalletApiService _api = WalletApiService('your-jwt-token');
  String? _qrImageUrl;
  String? _chargeId;
  Timer? _pollingTimer;

  @override
  void initState() {
    super.initState();
    _generateQR();
  }

  @override
  void dispose() {
    _pollingTimer?.cancel();
    super.dispose();
  }

  Future<void> _generateQR() async {
    try {
      final result = await _api.createPaymentSource(
        amount: widget.amount,
        paymentMethod: 'promptpay',
        returnUri: 'myapp://payment-result',
      );

      final data = result['data'];
      setState(() {
        _chargeId = data['chargeId'];
        _qrImageUrl = data['scannable_code']['image']['large'];
      });

      // Start polling for payment status
      _startPolling();
    } catch (e) {
      print('Error generating QR: $e');
    }
  }

  void _startPolling() {
    _pollingTimer = Timer.periodic(Duration(seconds: 3), (timer) async {
      if (_chargeId == null) {
        timer.cancel();
        return;
      }

      try {
        final result = await _api.checkPaymentStatus(_chargeId!);
        final data = result['data'];

        if (data['paid'] == true && data['status'] == 'successful') {
          timer.cancel();
          _showSuccessAndClose(data['amount']);
        }
      } catch (e) {
        print('Polling error: $e');
      }
    });
  }

  void _showSuccessAndClose(double amount) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Payment Successful'),
        content: Text('฿${amount.toStringAsFixed(2)} added to your wallet'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              Navigator.of(context).pop();
            },
            child: Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('PromptPay QR Payment')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              '฿${widget.amount.toStringAsFixed(2)}',
              style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 20),
            if (_qrImageUrl != null)
              Image.network(
                _qrImageUrl!,
                width: 300,
                height: 300,
              )
            else
              CircularProgressIndicator(),
            SizedBox(height: 20),
            Text('Scan with any PromptPay app'),
          ],
        ),
      ),
    );
  }
}
```

---

## Testing

### Test in Development Mode

1. Use Omise Test Keys:
```env
OMISE_SECRET_KEY=skey_test_xxxxx
```

2. Test Card Numbers (for testing only):
   - Success: `4242424242424242`
   - Failure: `4000000000000002`

3. Mobile Banking Test Flow:
   - In test mode, Omise provides a mock payment page
   - Click "Authorize Test Payment" to simulate success
   - Click "Fail Test Payment" to simulate failure

---

## Production Checklist

- [ ] Replace test API keys with production keys
- [ ] Configure Omise webhook endpoint: `https://your-domain.com/api/wallet/payment/webhook`
- [ ] Whitelist Omise webhook IPs
- [ ] Test deep link redirects on physical devices
- [ ] Implement error handling and retry logic
- [ ] Add transaction logging
- [ ] Set up monitoring and alerts
- [ ] Test all payment methods (K PLUS, SCB, etc.)
- [ ] Verify SSL certificates
- [ ] Test webhook events

---

## Support

For Omise documentation: https://docs.opn.ooo/

For issues, contact your backend team.
