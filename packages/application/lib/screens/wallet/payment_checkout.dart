import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/screens/wallet/top_up.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class WalletPaymentCheckoutScreen extends StatefulWidget {
  final double orderTotal;
  final String branchName;
  final List<Map<String, dynamic>> orderItems;

  const WalletPaymentCheckoutScreen({
    Key? key,
    required this.orderTotal,
    required this.branchName,
    required this.orderItems,
  }) : super(key: key);

  @override
  _WalletPaymentCheckoutScreenState createState() =>
      _WalletPaymentCheckoutScreenState();
}

class _WalletPaymentCheckoutScreenState
    extends State<WalletPaymentCheckoutScreen> {
  String selectedPaymentMethod = 'wallet';
  bool usePoints = false;
  final int availablePoints = 100;
  final double pointsValue = 10.00; // 100 points = 10 baht
  final double walletBalance = 1750.00;

  double _calculateTotal() {
    double total = widget.orderTotal;
    if (usePoints) {
      total -= pointsValue;
    }
    return total;
  }

  double _calculateNewBalance() {
    return walletBalance - _calculateTotal();
  }

  int _calculateEarnedPoints() {
    return (_calculateTotal() * 0.1).round(); // 10% of total as points
  }

  bool _hasSufficientBalance() {
    return walletBalance >= _calculateTotal();
  }

  void _confirmPayment() {
    if (selectedPaymentMethod == 'wallet' && !_hasSufficientBalance()) {
      _showInsufficientBalanceDialog();
      return;
    }

    // Show confirmation dialog
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: ChongjaroenColors.primaryColors.shade800,
        title: const Text(
          'Confirm Payment',
          style: TextStyle(color: Colors.white),
        ),
        content: Text(
          'Pay ฿${_formatAmount(_calculateTotal())} using ${selectedPaymentMethod == 'wallet' ? 'Wallet Balance' : 'Credit Card'}?',
          style: const TextStyle(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text(
              'Cancel',
              style: TextStyle(color: Colors.white54),
            ),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _processPayment();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: ChongjaroenColors.secondaryColor,
            ),
            child: const Text('Confirm'),
          ),
        ],
      ),
    );
  }

  void _processPayment() {
    // Show loading
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => const Center(
        child: CircularProgressIndicator(),
      ),
    );

    // Simulate payment processing
    Future.delayed(const Duration(seconds: 2), () {
      if (!mounted) return;
      Navigator.pop(context); // Close loading
      if (!mounted) return;
      _showPaymentSuccess();
    });
  }

  void _showPaymentSuccess() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: ChongjaroenColors.primaryColors.shade800,
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.check_circle,
              color: Colors.green,
              size: 60,
            ),
            const SizedBox(height: 16),
            const Text(
              '✓ Payment Successful',
              style: TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Paid ฿${_formatAmount(_calculateTotal())} at ${widget.branchName}',
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: Colors.white70,
                fontSize: 14,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'You earned ${_calculateEarnedPoints()} points!',
              style: const TextStyle(
                color: ChongjaroenColors.secondaryColor,
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Balance: ฿${_formatAmount(_calculateNewBalance())}',
              style: const TextStyle(
                color: Colors.white70,
                fontSize: 14,
              ),
            ),
          ],
        ),
        actions: [
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              Navigator.pop(context); // Go back to previous screen
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: ChongjaroenColors.secondaryColor,
              minimumSize: const Size(double.infinity, 44),
            ),
            child: const Text('Done'),
          ),
        ],
      ),
    );
  }

  void _showInsufficientBalanceDialog() {
    final shortage = _calculateTotal() - walletBalance;

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: ChongjaroenColors.primaryColors.shade800,
        title: const Row(
          children: [
            Icon(Icons.warning_amber_rounded, color: Colors.orange),
            SizedBox(width: 8),
            Text(
              'Insufficient Balance',
              style: TextStyle(color: Colors.white),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildDetailRow('Order Total:', '฿${_formatAmount(_calculateTotal())}'),
            const SizedBox(height: 8),
            _buildDetailRow('Your Balance:', '฿${_formatAmount(walletBalance)}'),
            const SizedBox(height: 8),
            _buildDetailRow('Short by:', '฿${_formatAmount(shortage)}', isHighlight: true),
            const SizedBox(height: 16),
            const Text(
              'Choose an option:',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text(
              'Cancel',
              style: TextStyle(color: Colors.white54),
            ),
          ),
          OutlinedButton(
            onPressed: () {
              Navigator.pop(context);
              setState(() {
                selectedPaymentMethod = 'card';
              });
            },
            style: OutlinedButton.styleFrom(
              foregroundColor: Colors.white,
              side: const BorderSide(color: Colors.white54),
            ),
            child: const Text('Use Card'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const TopUpScreen(),
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: ChongjaroenColors.secondaryColor,
            ),
            child: Text('Top-up ฿${_formatAmount(shortage)}'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text('Pay at Branch'),
        backgroundColor: ChongjaroenColors.primaryColors,
      ),
      backgroundColor: ChongjaroenColors.primaryColors.shade900,
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildOrderSummary(),
                    const SizedBox(height: 24),
                    _buildPaymentMethod(),
                    const SizedBox(height: 24),
                    if (selectedPaymentMethod == 'wallet') _buildPointsOption(),
                    if (selectedPaymentMethod == 'wallet') const SizedBox(height: 24),
                    _buildTotalSummary(),
                  ],
                ),
              ),
            ),
          ),
          _buildConfirmButton(),
        ],
      ),
    );
  }

  Widget _buildOrderSummary() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: ChongjaroenColors.primaryColors.shade800,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Order Summary',
            style: TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            widget.branchName,
            style: TextStyle(
              color: Colors.white.withOpacity(0.7),
              fontSize: 14,
            ),
          ),
          Text(
            DateFormat('MMM d, yyyy, HH:mm').format(DateTime.now()),
            style: TextStyle(
              color: Colors.white.withOpacity(0.5),
              fontSize: 12,
            ),
          ),
          const SizedBox(height: 16),
          ...widget.orderItems.map((item) => Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      item['name'],
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 14,
                      ),
                    ),
                    Text(
                      '฿${_formatAmount(item['price'])}',
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              )),
          const Divider(color: Colors.white24, height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Subtotal:',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                '฿${_formatAmount(widget.orderTotal)}',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentMethod() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Payment Method:',
          style: TextStyle(
            color: Colors.white,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 12),
        _buildPaymentMethodOption(
          method: 'wallet',
          icon: Icons.account_balance_wallet,
          title: 'Wallet Balance',
          subtitle: '฿${_formatAmount(walletBalance)}',
        ),
        const SizedBox(height: 12),
        _buildPaymentMethodOption(
          method: 'card',
          icon: Icons.credit_card,
          title: 'Credit Card',
          subtitle: null,
        ),
        const SizedBox(height: 12),
        _buildPaymentMethodOption(
          method: 'cash',
          icon: Icons.money,
          title: 'Cash / Pay at Counter',
          subtitle: null,
        ),
      ],
    );
  }

  Widget _buildPaymentMethodOption({
    required String method,
    required IconData icon,
    required String title,
    String? subtitle,
  }) {
    final isSelected = selectedPaymentMethod == method;

    return GestureDetector(
      onTap: () {
        setState(() {
          selectedPaymentMethod = method;
        });
      },
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: ChongjaroenColors.primaryColors.shade800,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected
                ? ChongjaroenColors.secondaryColor
                : ChongjaroenColors.primaryColors.shade600,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            Radio<String>(
              value: method,
              groupValue: selectedPaymentMethod,
              onChanged: (value) {
                setState(() {
                  selectedPaymentMethod = value!;
                });
              },
              activeColor: ChongjaroenColors.secondaryColor,
            ),
            Icon(icon, color: Colors.white, size: 24),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  if (subtitle != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      subtitle,
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.6),
                        fontSize: 12,
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPointsOption() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: ChongjaroenColors.primaryColors.shade800,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Checkbox(
            value: usePoints,
            onChanged: (value) {
              setState(() {
                usePoints = value ?? false;
              });
            },
            activeColor: ChongjaroenColors.secondaryColor,
          ),
          Expanded(
            child: Text(
              'Use $availablePoints Points (-฿${_formatAmount(pointsValue)})',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 14,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTotalSummary() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: ChongjaroenColors.primaryColors.shade800,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: ChongjaroenColors.secondaryColor.withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Total to Pay:',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                '฿${_formatAmount(_calculateTotal())}',
                style: const TextStyle(
                  color: ChongjaroenColors.secondaryColor,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          if (selectedPaymentMethod == 'wallet') ...[
            const SizedBox(height: 16),
            _buildDetailRow('New balance:', '฿${_formatAmount(_calculateNewBalance())}'),
            const SizedBox(height: 8),
            _buildDetailRow('Points earned:', '+${_calculateEarnedPoints()} pts'),
          ],
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value, {bool isHighlight = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            color: isHighlight ? Colors.orange : Colors.white.withOpacity(0.7),
            fontSize: 14,
          ),
        ),
        Text(
          value,
          style: TextStyle(
            color: isHighlight ? Colors.orange : Colors.white,
            fontSize: 14,
            fontWeight: isHighlight ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ],
    );
  }

  Widget _buildConfirmButton() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: ChongjaroenColors.primaryColors.shade800,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 10,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SizedBox(
        width: double.infinity,
        child: ElevatedButton(
          onPressed: _confirmPayment,
          style: ElevatedButton.styleFrom(
            backgroundColor: ChongjaroenColors.secondaryColor,
            padding: const EdgeInsets.symmetric(vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
          child: const Text(
            'Confirm Payment',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }

  String _formatAmount(double amount) {
    return NumberFormat('#,##0.00').format(amount);
  }
}