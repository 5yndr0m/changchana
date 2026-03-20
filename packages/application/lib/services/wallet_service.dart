import 'package:chongchana/services/api/fetcher.dart';

class WalletService {
  /// GET /api/wallet/balance
  static Future<Map<String, dynamic>?> getBalance() async {
    final response = await Fetcher.fetch(Fetcher.get, '/api/wallet/balance');
    if (response.isSuccess && response.data != null) {
      return response.data['data'];
    }
    return null;
  }

  /// GET /api/wallet/transactions
  static Future<Map<String, dynamic>?> getTransactions({
    int limit = 20,
    int offset = 0,
    String? type,
    String? status,
  }) async {
    final Map<String, dynamic> params = {
      'limit': limit,
      'offset': offset,
    };
    if (type != null) params['type'] = type;
    if (status != null) params['status'] = status;

    final response = await Fetcher.fetch(
      Fetcher.get,
      '/api/wallet/transactions',
      params: params,
    );
    if (response.isSuccess && response.data != null) {
      return response.data['data'];
    }
    return null;
  }

  /// POST /api/wallet/payment/create-source
  /// Creates Omise source + charge. Returns chargeId, authorizeUri (mobile banking)
  /// or scannable_code (PromptPay).
  static Future<Map<String, dynamic>> createPaymentSource({
    required double amount,
    required String paymentMethod,
    required String returnUri,
  }) async {
    final response = await Fetcher.fetch(
      Fetcher.post,
      '/api/wallet/payment/create-source',
      params: {
        'amount': amount,
        'paymentMethod': paymentMethod,
        'returnUri': returnUri,
      },
    );
    if (response.isSuccess && response.data != null) {
      return response.data['data'];
    }
    throw Exception(response.errorMessage ?? 'Failed to create payment source');
  }

  /// GET /api/wallet/payment/status/:chargeId
  /// Returns { chargeId, status, paid, amount, failureCode, failureMessage }
  static Future<Map<String, dynamic>?> checkPaymentStatus(
      String chargeId) async {
    final response = await Fetcher.fetch(
      Fetcher.get,
      '/api/wallet/payment/status/$chargeId',
    );
    if (response.isSuccess && response.data != null) {
      return response.data['data'];
    }
    return null;
  }

  /// GET /api/wallet/payment/methods
  static Future<Map<String, dynamic>?> getPaymentMethods() async {
    final response =
        await Fetcher.fetch(Fetcher.get, '/api/wallet/payment/methods');
    if (response.isSuccess && response.data != null) {
      return response.data['data'];
    }
    return null;
  }

  /// POST /wallet/pay
  /// Deducts wallet balance for an order payment.
  static Future<Map<String, dynamic>> payWithWallet({
    required double amount,
    String? referenceType,
    String? referenceId,
    String? branchId,
    String? description,
    int usePoints = 0,
  }) async {
    final Map<String, dynamic> params = {
      'amount': amount,
      'usePoints': usePoints,
    };
    if (referenceType != null) params['referenceType'] = referenceType;
    if (referenceId != null) params['referenceId'] = referenceId;
    if (branchId != null) params['branchId'] = branchId;
    if (description != null) params['description'] = description;

    final response =
        await Fetcher.fetch(Fetcher.post, '/wallet/pay', params: params);
    if (response.isSuccess && response.data != null) {
      return response.data['data'];
    }
    throw Exception(response.errorMessage ?? 'Payment failed');
  }
}
