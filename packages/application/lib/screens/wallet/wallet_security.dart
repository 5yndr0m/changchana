import 'package:chongchana/constants/colors.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class WalletSecurityScreen extends StatefulWidget {
  const WalletSecurityScreen({Key? key}) : super(key: key);

  @override
  _WalletSecurityScreenState createState() => _WalletSecurityScreenState();
}

class _WalletSecurityScreenState extends State<WalletSecurityScreen> {
  String paymentAuthLevel = 'always';
  bool useFingerprintFaceId = true;
  bool usePin = true;
  bool usePassword = false;

  bool notifyTopUp = true;
  bool notifyPayment = true;
  bool notifyRefund = true;
  bool notifyLowBalance = true;
  bool notifySuspicious = true;

  final double lowBalanceThreshold = 100.00;
  final DateTime lastLogin = DateTime(2025, 3, 8, 14, 30);
  final String lastDevice = 'iPhone 13 Pro';
  final String lastLocation = 'Bangkok, Thailand';

  void _changePin() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: ChongjaroenColors.primaryColors.shade800,
        title: const Text(
          'Change PIN',
          style: TextStyle(color: Colors.white),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              obscureText: true,
              maxLength: 6,
              keyboardType: TextInputType.number,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                labelText: 'Current PIN',
                labelStyle: const TextStyle(color: Colors.white70),
                enabledBorder: OutlineInputBorder(
                  borderSide: BorderSide(
                    color: ChongjaroenColors.primaryColors.shade600,
                  ),
                ),
                focusedBorder: const OutlineInputBorder(
                  borderSide: BorderSide(
                    color: ChongjaroenColors.secondaryColor,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              obscureText: true,
              maxLength: 6,
              keyboardType: TextInputType.number,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                labelText: 'New PIN',
                labelStyle: const TextStyle(color: Colors.white70),
                enabledBorder: OutlineInputBorder(
                  borderSide: BorderSide(
                    color: ChongjaroenColors.primaryColors.shade600,
                  ),
                ),
                focusedBorder: const OutlineInputBorder(
                  borderSide: BorderSide(
                    color: ChongjaroenColors.secondaryColor,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              obscureText: true,
              maxLength: 6,
              keyboardType: TextInputType.number,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                labelText: 'Confirm New PIN',
                labelStyle: const TextStyle(color: Colors.white70),
                enabledBorder: OutlineInputBorder(
                  borderSide: BorderSide(
                    color: ChongjaroenColors.primaryColors.shade600,
                  ),
                ),
                focusedBorder: const OutlineInputBorder(
                  borderSide: BorderSide(
                    color: ChongjaroenColors.secondaryColor,
                  ),
                ),
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
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('PIN changed successfully'),
                  backgroundColor: Colors.green,
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: ChongjaroenColors.secondaryColor,
            ),
            child: const Text('Change PIN'),
          ),
        ],
      ),
    );
  }

  void _viewLoginHistory() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const LoginHistoryScreen(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text('Wallet Security'),
        backgroundColor: ChongjaroenColors.primaryColors,
      ),
      backgroundColor: ChongjaroenColors.primaryColors.shade900,
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildPaymentAuthorization(),
              const SizedBox(height: 24),
              _buildAuthenticationMethod(),
              const SizedBox(height: 24),
              _buildNotifications(),
              const SizedBox(height: 24),
              _buildActivityLog(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPaymentAuthorization() {
    return _buildSection(
      title: 'Payment Authorization',
      child: Column(
        children: [
          const Text(
            'Require authentication for payments',
            style: TextStyle(
              color: Colors.white70,
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 12),
          _buildRadioOption('Always', 'always'),
          _buildRadioOption('For payments above ฿500', 'above_500'),
          _buildRadioOption('Never', 'never'),
        ],
      ),
    );
  }

  Widget _buildAuthenticationMethod() {
    return _buildSection(
      title: 'Authentication Method',
      child: Column(
        children: [
          _buildSwitchTile(
            title: 'Fingerprint / Face ID',
            value: useFingerprintFaceId,
            onChanged: (value) {
              setState(() {
                useFingerprintFaceId = value;
              });
            },
          ),
          const SizedBox(height: 8),
          _buildSwitchTile(
            title: '6-digit PIN',
            value: usePin,
            onChanged: (value) {
              setState(() {
                usePin = value;
              });
            },
          ),
          const SizedBox(height: 8),
          _buildSwitchTile(
            title: 'Password',
            value: usePassword,
            onChanged: (value) {
              setState(() {
                usePassword = value;
              });
            },
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton(
              onPressed: _changePin,
              style: OutlinedButton.styleFrom(
                foregroundColor: Colors.white,
                side: const BorderSide(color: Colors.white54),
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text('Change PIN'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNotifications() {
    return _buildSection(
      title: 'Notifications',
      child: Column(
        children: [
          _buildSwitchTile(
            title: 'Top-up confirmation',
            value: notifyTopUp,
            onChanged: (value) {
              setState(() {
                notifyTopUp = value;
              });
            },
          ),
          const SizedBox(height: 8),
          _buildSwitchTile(
            title: 'Payment confirmation',
            value: notifyPayment,
            onChanged: (value) {
              setState(() {
                notifyPayment = value;
              });
            },
          ),
          const SizedBox(height: 8),
          _buildSwitchTile(
            title: 'Refund received',
            value: notifyRefund,
            onChanged: (value) {
              setState(() {
                notifyRefund = value;
              });
            },
          ),
          const SizedBox(height: 8),
          _buildSwitchTile(
            title: 'Low balance alert (฿${_formatAmount(lowBalanceThreshold)})',
            value: notifyLowBalance,
            onChanged: (value) {
              setState(() {
                notifyLowBalance = value;
              });
            },
          ),
          const SizedBox(height: 8),
          _buildSwitchTile(
            title: 'Suspicious activity',
            value: notifySuspicious,
            onChanged: (value) {
              setState(() {
                notifySuspicious = value;
              });
            },
          ),
        ],
      ),
    );
  }

  Widget _buildActivityLog() {
    return _buildSection(
      title: 'Activity Log',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildDetailRow(
            'Last login:',
            DateFormat('MMM d, yyyy, HH:mm').format(lastLogin),
          ),
          const SizedBox(height: 8),
          _buildDetailRow('Device:', lastDevice),
          const SizedBox(height: 8),
          _buildDetailRow('Location:', lastLocation),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton(
              onPressed: _viewLoginHistory,
              style: OutlinedButton.styleFrom(
                foregroundColor: Colors.white,
                side: const BorderSide(color: Colors.white54),
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text('View All Login History'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSection({
    required String title,
    required Widget child,
  }) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: ChongjaroenColors.primaryColors.shade800,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          child,
        ],
      ),
    );
  }

  Widget _buildRadioOption(String label, String value) {
    return RadioListTile<String>(
      title: Text(
        label,
        style: const TextStyle(color: Colors.white),
      ),
      value: value,
      groupValue: paymentAuthLevel,
      onChanged: (newValue) {
        setState(() {
          paymentAuthLevel = newValue!;
        });
      },
      activeColor: ChongjaroenColors.secondaryColor,
      contentPadding: EdgeInsets.zero,
    );
  }

  Widget _buildSwitchTile({
    required String title,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
      decoration: BoxDecoration(
        color: ChongjaroenColors.primaryColors.shade700,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Text(
              title,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 14,
              ),
            ),
          ),
          Switch(
            value: value,
            onChanged: onChanged,
            activeColor: ChongjaroenColors.secondaryColor,
          ),
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            color: Colors.white.withOpacity(0.7),
            fontSize: 14,
          ),
        ),
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 14,
          ),
        ),
      ],
    );
  }

  String _formatAmount(double amount) {
    return NumberFormat('#,##0.00').format(amount);
  }
}

// Login History Screen
class LoginHistoryScreen extends StatelessWidget {
  const LoginHistoryScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> loginHistory = [
      {
        'date': DateTime(2025, 3, 8, 14, 30),
        'device': 'iPhone 13 Pro',
        'location': 'Bangkok, Thailand',
        'ip': '103.xx.xx.xx',
      },
      {
        'date': DateTime(2025, 3, 7, 18, 15),
        'device': 'iPhone 13 Pro',
        'location': 'Bangkok, Thailand',
        'ip': '103.xx.xx.xx',
      },
      {
        'date': DateTime(2025, 3, 6, 12, 0),
        'device': 'iPhone 13 Pro',
        'location': 'Bangkok, Thailand',
        'ip': '103.xx.xx.xx',
      },
    ];

    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text('Login History'),
        backgroundColor: ChongjaroenColors.primaryColors,
      ),
      backgroundColor: ChongjaroenColors.primaryColors.shade900,
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: loginHistory.length,
        itemBuilder: (context, index) {
          final login = loginHistory[index];
          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: ChongjaroenColors.primaryColors.shade800,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  DateFormat('MMM d, yyyy, HH:mm').format(login['date']),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    const Icon(
                      Icons.phone_android,
                      size: 14,
                      color: Colors.white54,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      login['device'],
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(
                      Icons.location_on,
                      size: 14,
                      color: Colors.white54,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      login['location'],
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(
                      Icons.dns,
                      size: 14,
                      color: Colors.white54,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      login['ip'],
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}