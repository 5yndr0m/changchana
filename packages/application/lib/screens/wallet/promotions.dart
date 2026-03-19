import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/screens/wallet/top_up.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class WalletPromotionsScreen extends StatefulWidget {
  const WalletPromotionsScreen({Key? key}) : super(key: key);

  @override
  _WalletPromotionsScreenState createState() => _WalletPromotionsScreenState();
}

class _WalletPromotionsScreenState extends State<WalletPromotionsScreen> {
  final TextEditingController _voucherCodeController = TextEditingController();

  final List<Map<String, dynamic>> activePromotions = [
    {
      'icon': '🎉',
      'title': 'First Top-up Bonus',
      'description': 'Get ฿50 bonus on your first wallet top-up of ฿500+',
      'validUntil': DateTime(2025, 3, 31),
      'type': 'first_topup',
    },
    {
      'icon': '💰',
      'title': 'Weekend Cashback',
      'description': 'Get 5% cashback on all wallet payments this weekend',
      'validUntil': DateTime(2025, 3, 10),
      'type': 'cashback',
    },
    {
      'icon': '🎁',
      'title': 'Loyalty Reward',
      'description': 'Spend ฿1,000 using wallet and get ฿100 bonus',
      'validUntil': DateTime(2025, 3, 15),
      'type': 'spending_reward',
    },
  ];

  final List<Map<String, dynamic>> rewardsHistory = [
    {
      'title': 'Welcome Bonus',
      'amount': 50.00,
      'date': DateTime(2025, 3, 7),
    },
    {
      'title': 'Referral Bonus',
      'amount': 100.00,
      'date': DateTime(2025, 2, 28),
    },
    {
      'title': 'Birthday Bonus',
      'amount': 200.00,
      'date': DateTime(2025, 1, 15),
    },
  ];

  @override
  void dispose() {
    _voucherCodeController.dispose();
    super.dispose();
  }

  void _redeemVoucher() {
    final code = _voucherCodeController.text.trim();

    if (code.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter a voucher code'),
          backgroundColor: Colors.orange,
        ),
      );
      return;
    }

    // Simulate voucher redemption
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => const Center(
        child: CircularProgressIndicator(),
      ),
    );

    Future.delayed(const Duration(seconds: 1), () {
      Navigator.pop(context);

      // Show success
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
                'Voucher Redeemed!',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                '฿50.00 added to your wallet',
                textAlign: TextAlign.center,
                style: TextStyle(
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
                _voucherCodeController.clear();
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
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text('Wallet Promotions'),
        backgroundColor: ChongjaroenColors.primaryColors,
        actions: [
          IconButton(
            icon: const Icon(Icons.info_outline),
            onPressed: () {
              _showPromotionInfo();
            },
          ),
        ],
      ),
      backgroundColor: ChongjaroenColors.primaryColors.shade900,
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildActivePromotions(),
              const SizedBox(height: 32),
              _buildVoucherRedemption(),
              const SizedBox(height: 32),
              _buildRewardsHistory(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildActivePromotions() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Active Promotions',
          style: TextStyle(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 16),
        ...activePromotions.map((promo) => _buildPromotionCard(promo)).toList(),
      ],
    );
  }

  Widget _buildPromotionCard(Map<String, dynamic> promo) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            ChongjaroenColors.secondaryColor.withOpacity(0.2),
            ChongjaroenColors.primaryColors.shade800,
          ],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: ChongjaroenColors.secondaryColor.withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                promo['icon'],
                style: const TextStyle(fontSize: 32),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  promo['title'],
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            promo['description'],
            style: TextStyle(
              color: Colors.white.withOpacity(0.8),
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Valid until: ${DateFormat('MMM d, yyyy').format(promo['validUntil'])}',
                style: TextStyle(
                  color: Colors.white.withOpacity(0.6),
                  fontSize: 12,
                ),
              ),
              ElevatedButton(
                onPressed: () {
                  if (promo['type'] == 'first_topup') {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const TopUpScreen(),
                      ),
                    );
                  } else {
                    _showPromotionDetail(promo);
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: ChongjaroenColors.secondaryColor,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 8,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: Text(
                  promo['type'] == 'first_topup' ? 'Top-up Now' : 'Learn More',
                  style: const TextStyle(fontSize: 12),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildVoucherRedemption() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: ChongjaroenColors.primaryColors.shade800,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Redeem Voucher Code',
            style: TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _voucherCodeController,
                  textCapitalization: TextCapitalization.characters,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                  ),
                  decoration: InputDecoration(
                    hintText: 'Enter Code',
                    hintStyle: TextStyle(
                      color: Colors.white.withOpacity(0.5),
                    ),
                    filled: true,
                    fillColor: ChongjaroenColors.primaryColors.shade700,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 14,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              ElevatedButton(
                onPressed: _redeemVoucher,
                style: ElevatedButton.styleFrom(
                  backgroundColor: ChongjaroenColors.secondaryColor,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 14,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text('Redeem'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildRewardsHistory() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'My Rewards History',
          style: TextStyle(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 16),
        ...rewardsHistory.map((reward) => _buildRewardItem(reward)).toList(),
        const SizedBox(height: 16),
        Center(
          child: TextButton(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Full history coming soon'),
                  backgroundColor: Colors.orange,
                ),
              );
            },
            child: const Text(
              'View All',
              style: TextStyle(
                color: ChongjaroenColors.secondaryColor,
                fontSize: 14,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildRewardItem(Map<String, dynamic> reward) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: ChongjaroenColors.primaryColors.shade800,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.green.withOpacity(0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(
              Icons.card_giftcard,
              color: Colors.green,
              size: 24,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  reward['title'],
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  DateFormat('MMM d, yyyy').format(reward['date']),
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.6),
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          Text(
            '+฿${_formatAmount(reward['amount'])}',
            style: const TextStyle(
              color: Colors.green,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  void _showPromotionInfo() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: ChongjaroenColors.primaryColors.shade800,
        title: const Text(
          'About Promotions',
          style: TextStyle(color: Colors.white),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Wallet promotions help you save money and earn rewards when using your wallet.',
              style: TextStyle(
                color: Colors.white.withOpacity(0.8),
                fontSize: 14,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'Tips:',
              style: TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              '• Check back regularly for new promotions\n• Read terms and conditions carefully\n• Promotions are automatically applied when eligible\n• Rewards are added to your wallet instantly',
              style: TextStyle(
                color: Colors.white.withOpacity(0.7),
                fontSize: 13,
              ),
            ),
          ],
        ),
        actions: [
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            style: ElevatedButton.styleFrom(
              backgroundColor: ChongjaroenColors.secondaryColor,
              minimumSize: const Size(double.infinity, 44),
            ),
            child: const Text('Got it'),
          ),
        ],
      ),
    );
  }

  void _showPromotionDetail(Map<String, dynamic> promo) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: ChongjaroenColors.primaryColors.shade800,
        title: Row(
          children: [
            Text(promo['icon'], style: const TextStyle(fontSize: 24)),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                promo['title'],
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 18,
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
              promo['description'],
              style: TextStyle(
                color: Colors.white.withOpacity(0.8),
                fontSize: 14,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'Valid Until:',
              style: TextStyle(
                color: Colors.white.withOpacity(0.6),
                fontSize: 12,
              ),
            ),
            Text(
              DateFormat('MMMM d, yyyy').format(promo['validUntil']),
              style: const TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'Terms & Conditions:',
              style: TextStyle(
                color: Colors.white,
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              '• Offer valid for limited time only\n• One use per customer\n• Cannot be combined with other offers\n• Chongjaroen reserves the right to modify terms',
              style: TextStyle(
                color: Colors.white.withOpacity(0.7),
                fontSize: 11,
              ),
            ),
          ],
        ),
        actions: [
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            style: ElevatedButton.styleFrom(
              backgroundColor: ChongjaroenColors.secondaryColor,
              minimumSize: const Size(double.infinity, 44),
            ),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  String _formatAmount(double amount) {
    return NumberFormat('#,##0.00').format(amount);
  }
}