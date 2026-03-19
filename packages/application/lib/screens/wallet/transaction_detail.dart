import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/models/wallet_transaction.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class TransactionDetailScreen extends StatelessWidget {
  final WalletTransaction transaction;

  const TransactionDetailScreen({
    Key? key,
    required this.transaction,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final bool isPositive = transaction.amount >= 0;

    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text('Transaction Detail'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black87,
        elevation: 0,
      ),
      backgroundColor: Colors.grey.shade50,
      body: SingleChildScrollView(
        child: Column(
          children: [
            _buildStatusCard(isPositive),
            const SizedBox(height: 16),
            _buildTransactionInfo(),
            const SizedBox(height: 16),
            _buildPaymentDetails(),
            const SizedBox(height: 16),
            _buildBalanceChanges(),
            const SizedBox(height: 24),
            _buildActions(context),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusCard(bool isPositive) {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
      ),
      child: Column(
        children: [
          Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              color: _getStatusColor().withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              _getStatusIcon(),
              color: _getStatusColor(),
              size: 32,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            _getStatusText(),
            style: TextStyle(
              color: _getStatusColor(),
              fontSize: 14,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            transaction.getTypeLabel(),
            style: const TextStyle(
              color: Colors.black87,
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            '${isPositive ? '+' : ''}฿${_formatAmount(transaction.amount.abs())}',
            style: TextStyle(
              color: isPositive ? Colors.green : Colors.red,
              fontSize: 36,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTransactionInfo() {
    return _buildInfoSection(
      title: 'Transaction Information',
      children: [
        _buildDetailRow('Transaction ID', transaction.id),
        _buildDivider(),
        _buildDetailRow(
          'Date & Time',
          DateFormat('MMM d, yyyy, HH:mm').format(transaction.createdAt),
        ),
        if (transaction.referenceId != null) ...[
          _buildDivider(),
          _buildDetailRow('Reference', transaction.referenceId!),
        ],
      ],
    );
  }

  Widget _buildPaymentDetails() {
    return _buildInfoSection(
      title: 'Payment Details',
      children: [
        if (transaction.paymentMethod != null) ...[
          _buildDetailRow('Payment Method', transaction.paymentMethod!),
          _buildDivider(),
        ],
        if (transaction.description != null) ...[
          _buildDetailRow('Description', transaction.description!),
          _buildDivider(),
        ],
        _buildDetailRow('Amount Paid', '฿${_formatAmount(transaction.amount.abs())}'),
        _buildDivider(),
        _buildDetailRow('Processing Fee', '฿0.00'),
        _buildDivider(),
        _buildDetailRow(
          'You Received',
          '฿${_formatAmount(transaction.amount.abs())}',
          valueColor: ChongjaroenColors.secondaryColor,
          valueWeight: FontWeight.bold,
        ),
      ],
    );
  }

  Widget _buildBalanceChanges() {
    return _buildInfoSection(
      title: 'Balance Changes',
      children: [
        _buildDetailRow('Balance Before', '฿${_formatAmount(transaction.balanceBefore)}'),
        _buildDivider(),
        _buildDetailRow(
          'Change',
          '${transaction.amount >= 0 ? '+' : ''}฿${_formatAmount(transaction.amount.abs())}',
          valueColor: transaction.amount >= 0 ? Colors.green : Colors.red,
        ),
        _buildDivider(),
        _buildDetailRow(
          'Balance After',
          '฿${_formatAmount(transaction.balanceAfter)}',
          valueColor: ChongjaroenColors.secondaryColor,
          valueWeight: FontWeight.bold,
        ),
      ],
    );
  }

  Widget _buildInfoSection({
    required String title,
    required List<Widget> children,
  }) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              color: Colors.black87,
              fontSize: 14,
              fontWeight: FontWeight.bold,
              letterSpacing: 0.3,
            ),
          ),
          const SizedBox(height: 16),
          ...children,
        ],
      ),
    );
  }

  Widget _buildDetailRow(
    String label,
    String value, {
    Color? valueColor,
    FontWeight? valueWeight,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            color: Colors.grey.shade600,
            fontSize: 14,
          ),
        ),
        const SizedBox(width: 16),
        Flexible(
          child: Text(
            value,
            style: TextStyle(
              color: valueColor ?? Colors.black87,
              fontSize: 14,
              fontWeight: valueWeight ?? FontWeight.w500,
            ),
            textAlign: TextAlign.right,
          ),
        ),
      ],
    );
  }

  Widget _buildDivider() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Container(
        height: 1,
        color: Colors.grey.shade200,
      ),
    );
  }

  Widget _buildActions(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        children: [
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Receipt download coming soon'),
                    backgroundColor: ChongjaroenColors.secondaryColor,
                  ),
                );
              },
              icon: const Icon(Icons.download_outlined),
              label: const Text('Download Receipt'),
              style: ElevatedButton.styleFrom(
                backgroundColor: ChongjaroenColors.secondaryColor,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(30),
                ),
                elevation: 0,
              ),
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Share coming soon'),
                        backgroundColor: ChongjaroenColors.secondaryColor,
                      ),
                    );
                  },
                  icon: const Icon(Icons.share_outlined, size: 20),
                  label: const Text('Share'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.black87,
                    side: BorderSide(color: Colors.grey.shade300),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Help coming soon'),
                        backgroundColor: ChongjaroenColors.secondaryColor,
                      ),
                    );
                  },
                  icon: const Icon(Icons.help_outline, size: 20),
                  label: const Text('Help'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.black87,
                    side: BorderSide(color: Colors.grey.shade300),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Color _getStatusColor() {
    switch (transaction.status) {
      case 'completed':
        return Colors.green;
      case 'pending':
        return Colors.orange;
      case 'failed':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  IconData _getStatusIcon() {
    switch (transaction.status) {
      case 'completed':
        return Icons.check_circle_outline;
      case 'pending':
        return Icons.schedule;
      case 'failed':
        return Icons.error_outline;
      default:
        return Icons.help_outline;
    }
  }

  String _getStatusText() {
    switch (transaction.status) {
      case 'completed':
        return 'Completed';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
      default:
        return transaction.status.toUpperCase();
    }
  }

  String _formatAmount(double amount) {
    return NumberFormat('#,##0.00').format(amount);
  }
}