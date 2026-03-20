import 'dart:async';
import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/services/wallet_service.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class PaymentStatusScreen extends StatefulWidget {
  final String chargeId;
  final double amount;
  final String paymentMethod;

  const PaymentStatusScreen({
    Key? key,
    required this.chargeId,
    required this.amount,
    required this.paymentMethod,
  }) : super(key: key);

  @override
  State<PaymentStatusScreen> createState() => _PaymentStatusScreenState();
}

class _PaymentStatusScreenState extends State<PaymentStatusScreen> {
  Timer? _pollingTimer;
  String _status = 'pending';
  bool _paid = false;
  String? _failureMessage;
  bool _isLoading = true;
  int _pollCount = 0;
  static const int _maxPolls = 40; // ~3 minutes (40 × 5s)

  @override
  void initState() {
    super.initState();
    _startPolling();
  }

  @override
  void dispose() {
    _pollingTimer?.cancel();
    super.dispose();
  }

  void _startPolling() {
    // Check immediately on open
    _checkStatus();
    _pollingTimer = Timer.periodic(const Duration(seconds: 5), (_) {
      if (_pollCount >= _maxPolls) {
        _pollingTimer?.cancel();
        if (mounted) setState(() => _isLoading = false);
        return;
      }
      _checkStatus();
    });
  }

  Future<void> _checkStatus() async {
    _pollCount++;
    final result = await WalletService.checkPaymentStatus(widget.chargeId);
    if (result == null || !mounted) return;

    setState(() {
      _status = result['status'] ?? 'pending';
      _paid = result['paid'] ?? false;
      _failureMessage = result['failureMessage'];
      _isLoading = false;
    });

    if (_paid || _status == 'failed' || _status == 'expired') {
      _pollingTimer?.cancel();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Payment Status'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black87,
        elevation: 0,
        centerTitle: true,
        automaticallyImplyLeading: !_isLoading && !_paid,
      ),
      backgroundColor: Colors.white,
      body: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _buildStatusIcon(),
            const SizedBox(height: 24),
            _buildStatusText(),
            const SizedBox(height: 12),
            Text(
              '฿${NumberFormat('#,##0.00').format(widget.amount)}',
              style: const TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.bold,
                color: Colors.black,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              widget.paymentMethod
                  .replaceAll('_', ' ')
                  .toUpperCase(),
              style: const TextStyle(fontSize: 13, color: Colors.black54),
            ),
            if (_failureMessage != null) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.red.shade50,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  _failureMessage!,
                  textAlign: TextAlign.center,
                  style:
                      TextStyle(color: Colors.red.shade700, fontSize: 13),
                ),
              ),
            ],
            const SizedBox(height: 40),
            _buildAction(),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusIcon() {
    if (_isLoading || (_status == 'pending' && !_paid)) {
      return Container(
        width: 80,
        height: 80,
        decoration: BoxDecoration(
          color: Colors.blue.shade50,
          shape: BoxShape.circle,
        ),
        child: const Padding(
          padding: EdgeInsets.all(20),
          child: CircularProgressIndicator(strokeWidth: 3),
        ),
      );
    }
    if (_paid) {
      return Container(
        width: 80,
        height: 80,
        decoration: const BoxDecoration(
          color: Color(0xFFE8F5E9),
          shape: BoxShape.circle,
        ),
        child: const Icon(Icons.check_circle, color: Colors.green, size: 48),
      );
    }
    return Container(
      width: 80,
      height: 80,
      decoration: BoxDecoration(
        color: Colors.red.shade50,
        shape: BoxShape.circle,
      ),
      child: Icon(Icons.cancel, color: Colors.red.shade400, size: 48),
    );
  }

  Widget _buildStatusText() {
    if (_isLoading || (_status == 'pending' && !_paid)) {
      return Column(
        children: [
          const Text(
            'Waiting for payment...',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 6),
          Text(
            'Please complete the payment in your banking app.\nThis screen will update automatically.',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 13, color: Colors.grey.shade600),
          ),
        ],
      );
    }
    if (_paid) {
      return const Text(
        'Payment Successful!',
        style: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.bold,
          color: Colors.green,
        ),
      );
    }
    return Text(
      _status == 'expired' ? 'Payment Expired' : 'Payment Failed',
      style: TextStyle(
        fontSize: 20,
        fontWeight: FontWeight.bold,
        color: Colors.red.shade600,
      ),
    );
  }

  Widget _buildAction() {
    if (_isLoading || (_status == 'pending' && !_paid)) {
      return TextButton(
        onPressed: () {
          _pollingTimer?.cancel();
          Navigator.pop(context);
        },
        child: const Text(
          'Cancel',
          style: TextStyle(color: Colors.black54),
        ),
      );
    }
    if (_paid) {
      return SizedBox(
        width: double.infinity,
        child: ElevatedButton(
          onPressed: () =>
              Navigator.of(context).popUntil((route) => route.isFirst),
          style: ElevatedButton.styleFrom(
            backgroundColor: ChongjaroenColors.secondaryColor,
            padding: const EdgeInsets.symmetric(vertical: 16),
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
          child: const Text(
            'Back to Home',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
        ),
      );
    }
    return Column(
      children: [
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: () => Navigator.pop(context),
            style: ElevatedButton.styleFrom(
              backgroundColor: ChongjaroenColors.secondaryColor,
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text(
              'Try Again',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
          ),
        ),
        const SizedBox(height: 12),
        TextButton(
          onPressed: () =>
              Navigator.of(context).popUntil((route) => route.isFirst),
          child: const Text('Back to Home',
              style: TextStyle(color: Colors.black54)),
        ),
      ],
    );
  }
}
