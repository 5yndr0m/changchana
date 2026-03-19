import 'package:chongchana/constants/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';

class TopUpScreen extends StatefulWidget {
  const TopUpScreen({Key? key}) : super(key: key);

  @override
  _TopUpScreenState createState() => _TopUpScreenState();
}

class _TopUpScreenState extends State<TopUpScreen> {
  final TextEditingController _amountController = TextEditingController();
  double? selectedAmount;
  final double currentBalance = 1250.00;
  final double minAmount = 100.00;
  final double maxAmount = 20000.00;

  final String cardNumber = '4622';
  final String userName = 'ChongJaroen User';
  String? selectedPaymentMethod;

  final List<double> quickAmounts = [300, 500, 1000, 3000, 5000, 10000];

  @override
  void dispose() {
    _amountController.dispose();
    super.dispose();
  }

  void _selectAmount(double amount) {
    setState(() {
      selectedAmount = amount;
      _amountController.text = amount.toStringAsFixed(0);
    });
  }

  void _onCustomAmountChanged(String value) {
    if (value.isEmpty) {
      setState(() {
        selectedAmount = null;
      });
      return;
    }

    try {
      final amount = double.parse(value);
      setState(() {
        selectedAmount = amount;
      });
    } catch (e) {
      setState(() {
        selectedAmount = null;
      });
    }
  }

  void _continue() {
    if (selectedAmount == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select an amount'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    if (selectedPaymentMethod == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select a payment method'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    if (selectedAmount! < minAmount) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Minimum top-up amount is ฿${_formatAmount(minAmount)}'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    if (selectedAmount! > maxAmount) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Maximum top-up amount is ฿${_formatAmount(maxAmount)}'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    // Show success confirmation
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        title: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: Colors.green.shade50,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.check_circle,
                color: Colors.green,
                size: 32,
              ),
            ),
            const SizedBox(width: 12),
            const Expanded(
              child: Text(
                'Top-up Successful!',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Amount: ฿${_formatAmount(selectedAmount!)}',
              style: const TextStyle(fontSize: 15),
            ),
            const SizedBox(height: 8),
            Text(
              'Payment Method: ${selectedPaymentMethod!.replaceAll('_', ' ').toUpperCase()}',
              style: const TextStyle(fontSize: 15),
            ),
            const SizedBox(height: 12),
            Text(
              'Your wallet has been topped up successfully.',
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey.shade600,
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context); // Close dialog
              Navigator.pop(context); // Go back to wallet overview
            },
            child: const Text(
              'Done',
              style: TextStyle(
                color: ChongjaroenColors.secondaryColor,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
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
        title: const Text('Add money'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black87,
        elevation: 0,
      ),
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 16),
            _buildCardSelector(),
            const SizedBox(height: 24),
            _buildAmountSection(),
            const SizedBox(height: 24),
            _buildPaymentMethodSection(),
            const SizedBox(height: 32),
            _buildContinueButton(),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildCardSelector() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'To',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: Colors.black87,
            ),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: Colors.grey.shade300,
              ),
            ),
            child: Row(
              children: [
                Container(
                  width: 60,
                  height: 40,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        ChongjaroenColors.primaryColors.shade400,
                        ChongjaroenColors.primaryColors.shade600,
                      ],
                    ),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Center(
                    child: Icon(
                      Icons.account_balance_wallet,
                      color: Colors.white,
                      size: 20,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '$userName ($cardNumber)',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.black87,
                        ),
                      ),
                      Text(
                        '฿${_formatAmount(currentBalance)}',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey.shade600,
                        ),
                      ),
                    ],
                  ),
                ),
                Icon(
                  Icons.keyboard_arrow_down,
                  color: Colors.grey.shade600,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAmountSection() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Amount',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: Colors.black87,
            ),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: selectedAmount != null
                    ? ChongjaroenColors.secondaryColor
                    : Colors.grey.shade300,
                width: selectedAmount != null ? 2 : 1,
              ),
            ),
            child: Row(
              children: [
                const Text(
                  '฿',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w600,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: TextField(
                    controller: _amountController,
                    keyboardType: TextInputType.number,
                    inputFormatters: [
                      FilteringTextInputFormatter.digitsOnly,
                    ],
                    onChanged: _onCustomAmountChanged,
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w600,
                      color: Colors.black87,
                    ),
                    decoration: const InputDecoration(
                      border: InputBorder.none,
                      hintText: '0',
                      hintStyle: TextStyle(
                        color: Colors.grey,
                        fontSize: 24,
                      ),
                    ),
                  ),
                ),
                if (selectedAmount != null)
                  Icon(
                    Icons.keyboard_arrow_down,
                    color: Colors.grey.shade600,
                  ),
              ],
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'The value of a card should not exceed ฿${_formatAmount(maxAmount)}',
            style: TextStyle(
              fontSize: 12,
              color: Colors.grey.shade600,
            ),
          ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: quickAmounts.map((amount) => _buildQuickAmountButton(amount)).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickAmountButton(double amount) {
    final isSelected = selectedAmount == amount;

    return GestureDetector(
      onTap: () => _selectAmount(amount),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected
              ? ChongjaroenColors.secondaryColor.withOpacity(0.1)
              : Colors.grey.shade50,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected
                ? ChongjaroenColors.secondaryColor
                : Colors.grey.shade300,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Text(
          amount.toStringAsFixed(0),
          style: TextStyle(
            color: isSelected
                ? ChongjaroenColors.secondaryColor
                : Colors.black87,
            fontSize: 16,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
          ),
        ),
      ),
    );
  }

  Widget _buildPaymentMethodSection() {
    return Column(
      children: [
        const Divider(height: 1),
        _buildPaymentMethodOption(
          icon: Icons.credit_card,
          title: 'Use other credit / debit cards',
          value: 'credit_card',
        ),
        const Divider(height: 1),
        _buildPaymentMethodOption(
          icon: Icons.phone_android,
          title: 'Mobile Banking',
          value: 'mobile_banking',
          hasSubOptions: true,
        ),
        if (selectedPaymentMethod == 'mobile_banking') ...[
          _buildBankOption('Bangkok Bank Mobile Banking', 'bbl'),
          _buildBankOption('K PLUS', 'kplus'),
          _buildBankOption('Krungsri Mobile App', 'krungsri'),
          _buildBankOption('Krungthai NEXT', 'ktb'),
        ],
        const Divider(height: 1),
      ],
    );
  }

  Widget _buildPaymentMethodOption({
    required IconData icon,
    required String title,
    required String value,
    bool hasSubOptions = false,
  }) {
    final isSelected = selectedPaymentMethod == value;

    return InkWell(
      onTap: () {
        setState(() {
          if (selectedPaymentMethod == value && hasSubOptions) {
            selectedPaymentMethod = null;
          } else {
            selectedPaymentMethod = value;
          }
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        child: Row(
          children: [
            Container(
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: isSelected
                      ? ChongjaroenColors.secondaryColor
                      : Colors.grey.shade400,
                  width: 2,
                ),
                color: isSelected
                    ? ChongjaroenColors.secondaryColor
                    : Colors.transparent,
              ),
              child: isSelected
                  ? const Icon(
                      Icons.circle,
                      size: 12,
                      color: Colors.white,
                    )
                  : null,
            ),
            const SizedBox(width: 16),
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: Colors.grey.shade100,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                icon,
                color: Colors.grey.shade700,
                size: 24,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Text(
                title,
                style: const TextStyle(
                  fontSize: 16,
                  color: Colors.black87,
                ),
              ),
            ),
            if (hasSubOptions)
              Icon(
                isSelected ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down,
                color: Colors.grey.shade600,
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildBankOption(String name, String value) {
    final isSelected = selectedPaymentMethod == 'mobile_banking_$value';

    return InkWell(
      onTap: () {
        setState(() {
          selectedPaymentMethod = 'mobile_banking_$value';
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        margin: const EdgeInsets.only(left: 40),
        child: Row(
          children: [
            Container(
              width: 20,
              height: 20,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: isSelected
                      ? ChongjaroenColors.secondaryColor
                      : Colors.grey.shade400,
                  width: 2,
                ),
                color: isSelected
                    ? ChongjaroenColors.secondaryColor
                    : Colors.transparent,
              ),
              child: isSelected
                  ? const Icon(
                      Icons.circle,
                      size: 10,
                      color: Colors.white,
                    )
                  : null,
            ),
            const SizedBox(width: 12),
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: ChongjaroenColors.primaryColors.shade100,
                borderRadius: BorderRadius.circular(6),
              ),
              child: Center(
                child: Text(
                  name.substring(0, 1),
                  style: TextStyle(
                    color: ChongjaroenColors.primaryColors,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                name,
                style: const TextStyle(
                  fontSize: 15,
                  color: Colors.black87,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildContinueButton() {
    final isEnabled = selectedAmount != null && selectedPaymentMethod != null;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: SizedBox(
        width: double.infinity,
        child: ElevatedButton(
          onPressed: isEnabled ? _continue : null,
          style: ElevatedButton.styleFrom(
            backgroundColor: ChongjaroenColors.secondaryColor,
            disabledBackgroundColor: Colors.grey.shade300,
            padding: const EdgeInsets.symmetric(vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(30),
            ),
            elevation: 0,
          ),
          child: Text(
            'Continue',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: isEnabled ? Colors.white : Colors.grey.shade500,
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
