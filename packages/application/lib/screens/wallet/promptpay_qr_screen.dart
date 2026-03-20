import 'dart:async';
import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/services/wallet_service.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class PromptPayQRScreen extends StatefulWidget {
  final String chargeId;
  final double amount;
  final String? qrImageUrl;

  const PromptPayQRScreen({
    Key? key,
    required this.chargeId,
    required this.amount,
    this.qrImageUrl,
  }) : super(key: key);

  @override
  State<PromptPayQRScreen> createState() => _PromptPayQRScreenState();
}

class _PromptPayQRScreenState extends State<PromptPayQRScreen> {
  Timer? _pollingTimer;
  String _status = 'pending';
  bool _paid = false;
  bool _isPolling = true;
  int _secondsRemaining = 900; // 15 minutes
  Timer? _countdownTimer;

  @override
  void initState() {
    super.initState();
    _startPolling();
    _startCountdown();
  }

  @override
  void dispose() {
    _pollingTimer?.cancel();
    _countdownTimer?.cancel();
    super.dispose();
  }

  void _startPolling() {
    _pollingTimer = Timer.periodic(const Duration(seconds: 5), (_) async {
      if (!_isPolling || !mounted) return;
      await _checkStatus();
    });
  }

  void _startCountdown() {
    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (!mounted) return;
      setState(() {
        if (_secondsRemaining > 0) {
          _secondsRemaining--;
        } else {
          _isPolling = false;
          _countdownTimer?.cancel();
          _pollingTimer?.cancel();
        }
      });
    });
  }

  Future<void> _checkStatus() async {
    final result = await WalletService.checkPaymentStatus(widget.chargeId);
    if (result == null || !mounted) return;

    setState(() {
      _status = result['status'] ?? 'pending';
      _paid = result['paid'] ?? false;
    });

    if (_paid || _status == 'failed' || _status == 'expired') {
      _isPolling = false;
      _pollingTimer?.cancel();
      _countdownTimer?.cancel();

      if (_paid) {
        _showSuccessDialog();
      }
    }
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.check_circle, color: Colors.green, size: 64),
            const SizedBox(height: 16),
            const Text(
              'Payment Successful!',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              '฿${NumberFormat('#,##0.00').format(widget.amount)} has been added to your wallet.',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 14, color: Colors.black54),
            ),
          ],
        ),
        actions: [
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                Navigator.of(context).popUntil((route) => route.isFirst);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: ChongjaroenColors.secondaryColor,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8)),
              ),
              child: const Text('Back to Home'),
            ),
          ),
        ],
      ),
    );
  }

  String get _formattedCountdown {
    final minutes = _secondsRemaining ~/ 60;
    final seconds = _secondsRemaining % 60;
    return '${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('PromptPay QR'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black87,
        elevation: 0,
        centerTitle: true,
      ),
      backgroundColor: Colors.white,
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.grey.shade50,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Column(
                children: [
                  const Text(
                    'Scan with any banking app',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Amount: ฿${NumberFormat('#,##0.00').format(widget.amount)}',
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                  ),
                  const SizedBox(height: 20),
                  if (widget.qrImageUrl != null)
                    Container(
                      width: 220,
                      height: 220,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.grey.shade300),
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Image.network(
                          widget.qrImageUrl!,
                          fit: BoxFit.contain,
                          loadingBuilder: (_, child, loadingProgress) {
                            if (loadingProgress == null) return child;
                            return const Center(
                                child: CircularProgressIndicator());
                          },
                          errorBuilder: (_, __, ___) => const Center(
                            child: Icon(Icons.qr_code,
                                size: 80, color: Colors.black54),
                          ),
                        ),
                      ),
                    )
                  else
                    Container(
                      width: 220,
                      height: 220,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.grey.shade300),
                      ),
                      child: const Center(
                        child: Icon(Icons.qr_code,
                            size: 80, color: Colors.black54),
                      ),
                    ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      if (_isPolling && !_paid) ...[
                        const SizedBox(
                          width: 14,
                          height: 14,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Waiting for payment · $_formattedCountdown',
                          style: const TextStyle(
                              fontSize: 13, color: Colors.black54),
                        ),
                      ] else if (_paid) ...[
                        const Icon(Icons.check_circle,
                            color: Colors.green, size: 16),
                        const SizedBox(width: 6),
                        const Text('Payment received!',
                            style: TextStyle(color: Colors.green)),
                      ] else ...[
                        const Icon(Icons.timer_off,
                            color: Colors.red, size: 16),
                        const SizedBox(width: 6),
                        const Text('QR expired',
                            style: TextStyle(color: Colors.red)),
                      ],
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'Keep this screen open until payment is confirmed.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 13, color: Colors.black54),
            ),
            const Spacer(),
            if (!_isPolling && !_paid)
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red.shade400,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('Cancel',
                      style: TextStyle(fontSize: 16, color: Colors.white)),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
