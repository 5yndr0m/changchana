import 'package:chongchana/constants/colors.dart';
import 'package:chongchana/models/wallet_transaction.dart';
import 'package:chongchana/screens/wallet/transaction_detail.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class TransactionHistoryScreen extends StatefulWidget {
  const TransactionHistoryScreen({Key? key}) : super(key: key);

  @override
  _TransactionHistoryScreenState createState() =>
      _TransactionHistoryScreenState();
}

class _TransactionHistoryScreenState extends State<TransactionHistoryScreen> {
  List<WalletTransaction> transactions = [];
  List<WalletTransaction> filteredTransactions = [];
  bool isLoading = false;

  // Filter options
  Set<String> selectedTypes = {'all'};
  String selectedDateRange = 'last_7';
  double? minAmount;
  double? maxAmount;
  Set<String> selectedStatuses = {'completed', 'pending'};

  @override
  void initState() {
    super.initState();
    _loadTransactions();
  }

  void _loadTransactions() {
    // Mock data - replace with actual API call
    transactions = [
      WalletTransaction(
        id: 'TX-20250308-00124',
        type: 'top_up',
        amount: 500.00,
        balanceAfter: 1750.00,
        balanceBefore: 1250.00,
        status: 'completed',
        paymentMethod: 'PromptPay',
        createdAt: DateTime(2025, 3, 8, 14, 32),
      ),
      WalletTransaction(
        id: 'TX-20250307-00123',
        type: 'payment',
        amount: -285.00,
        balanceAfter: 1250.00,
        balanceBefore: 1535.00,
        status: 'completed',
        description: 'Asoke Branch',
        referenceId: 'Order #A-00456',
        createdAt: DateTime(2025, 3, 7, 18, 15),
      ),
      WalletTransaction(
        id: 'TX-20250307-00122',
        type: 'bonus',
        amount: 50.00,
        balanceAfter: 1535.00,
        balanceBefore: 1485.00,
        status: 'completed',
        description: 'Welcome Bonus',
        referenceId: 'BONUS-2025-001',
        createdAt: DateTime(2025, 3, 7, 12, 0),
      ),
      WalletTransaction(
        id: 'TX-20250306-00121',
        type: 'payment',
        amount: -120.00,
        balanceAfter: 1485.00,
        balanceBefore: 1605.00,
        status: 'completed',
        description: 'Silom Branch',
        referenceId: 'Order #S-00789',
        createdAt: DateTime(2025, 3, 6, 19, 30),
      ),
      WalletTransaction(
        id: 'TX-20250305-00098',
        type: 'top_up',
        amount: 1000.00,
        balanceAfter: 1605.00,
        balanceBefore: 605.00,
        status: 'completed',
        paymentMethod: 'Card ****1234',
        createdAt: DateTime(2025, 3, 5, 16, 20),
      ),
      WalletTransaction(
        id: 'TX-20250305-00097',
        type: 'refund',
        amount: 95.00,
        balanceAfter: 605.00,
        balanceBefore: 510.00,
        status: 'completed',
        description: 'Order Cancelled',
        referenceId: 'Ref: Order #A-00432',
        createdAt: DateTime(2025, 3, 5, 10, 15),
      ),
    ];

    filteredTransactions = List.from(transactions);
  }

  void _applyFilters() {
    setState(() {
      filteredTransactions = transactions.where((transaction) {
        // Type filter
        if (!selectedTypes.contains('all') &&
            !selectedTypes.contains(transaction.type)) {
          return false;
        }

        // Status filter
        if (!selectedStatuses.contains(transaction.status)) {
          return false;
        }

        // Amount filter
        if (minAmount != null && transaction.amount.abs() < minAmount!) {
          return false;
        }
        if (maxAmount != null && transaction.amount.abs() > maxAmount!) {
          return false;
        }

        // Date range filter
        final now = DateTime.now();
        switch (selectedDateRange) {
          case 'last_7':
            return transaction.createdAt.isAfter(now.subtract(const Duration(days: 7)));
          case 'last_30':
            return transaction.createdAt.isAfter(now.subtract(const Duration(days: 30)));
          case 'last_90':
            return transaction.createdAt.isAfter(now.subtract(const Duration(days: 90)));
          case 'all':
          default:
            return true;
        }
      }).toList();
    });
  }

  void _showFilterDialog() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => _buildFilterModal(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text('Transaction History'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black87,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: _showFilterDialog,
          ),
        ],
      ),
      backgroundColor: Colors.grey.shade50,
      body: filteredTransactions.isEmpty
          ? _buildEmptyState()
          : _buildTransactionList(),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.receipt_long_outlined,
            size: 64,
            color: Colors.grey.shade400,
          ),
          const SizedBox(height: 16),
          Text(
            'No transactions found',
            style: TextStyle(
              color: Colors.grey.shade600,
              fontSize: 16,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Your transaction history will appear here',
            style: TextStyle(
              color: Colors.grey.shade500,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTransactionList() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _getGroupedTransactions().length,
      itemBuilder: (context, index) {
        final group = _getGroupedTransactions()[index];
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (index == 0) const SizedBox(height: 8),
            _buildDateHeader(group['date'] as DateTime),
            const SizedBox(height: 12),
            ...(group['transactions'] as List<WalletTransaction>)
                .map((transaction) => _buildTransactionItem(transaction))
                .toList(),
            const SizedBox(height: 20),
          ],
        );
      },
    );
  }

  List<Map<String, dynamic>> _getGroupedTransactions() {
    final Map<String, List<WalletTransaction>> grouped = {};

    for (var transaction in filteredTransactions) {
      final dateKey = DateFormat('yyyy-MM-dd').format(transaction.createdAt);
      if (!grouped.containsKey(dateKey)) {
        grouped[dateKey] = [];
      }
      grouped[dateKey]!.add(transaction);
    }

    return grouped.entries.map((entry) {
      return {
        'date': DateTime.parse(entry.key),
        'transactions': entry.value,
      };
    }).toList()
      ..sort((a, b) =>
          (b['date'] as DateTime).compareTo(a['date'] as DateTime));
  }

  Widget _buildDateHeader(DateTime date) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final yesterday = today.subtract(const Duration(days: 1));
    final transactionDate = DateTime(date.year, date.month, date.day);

    String dateLabel;
    if (transactionDate == today) {
      dateLabel = 'Today';
    } else if (transactionDate == yesterday) {
      dateLabel = 'Yesterday';
    } else {
      dateLabel = DateFormat('MMMM d, yyyy').format(date);
    }

    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Text(
        dateLabel,
        style: TextStyle(
          color: Colors.grey.shade700,
          fontSize: 14,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.3,
        ),
      ),
    );
  }

  Widget _buildTransactionItem(WalletTransaction transaction) {
    final bool isPositive = transaction.amount >= 0;
    final String amountStr =
        '${isPositive ? '+' : ''}฿${_formatAmount(transaction.amount.abs())}';

    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) =>
                TransactionDetailScreen(transaction: transaction),
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: Colors.grey.shade200,
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: isPositive
                    ? Colors.green.shade50
                    : Colors.red.shade50,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(
                isPositive ? Icons.arrow_downward : Icons.arrow_upward,
                color: isPositive ? Colors.green : Colors.red,
                size: 20,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        transaction.getTypeLabel(),
                        style: const TextStyle(
                          color: Colors.black87,
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      Text(
                        amountStr,
                        style: TextStyle(
                          color: isPositive ? Colors.green : Colors.red,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Text(
                        DateFormat('HH:mm').format(transaction.createdAt),
                        style: TextStyle(
                          color: Colors.grey.shade600,
                          fontSize: 13,
                        ),
                      ),
                      if (transaction.description != null || transaction.paymentMethod != null) ...[
                        Text(
                          '  •  ',
                          style: TextStyle(
                            color: Colors.grey.shade400,
                            fontSize: 13,
                          ),
                        ),
                        Expanded(
                          child: Text(
                            transaction.description ?? transaction.paymentMethod ?? '',
                            style: TextStyle(
                              color: Colors.grey.shade600,
                              fontSize: 13,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            Icon(
              Icons.chevron_right,
              color: Colors.grey.shade400,
              size: 20,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterModal() {
    return StatefulBuilder(
      builder: (context, setModalState) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom,
            left: 24,
            right: 24,
            top: 24,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Filter Transactions',
                    style: TextStyle(
                      color: Colors.black87,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.black87),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              const Text(
                'Transaction Type',
                style: TextStyle(
                  color: Colors.black87,
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  _buildFilterChip('All', 'all', setModalState),
                  _buildFilterChip('Top-up', 'top_up', setModalState),
                  _buildFilterChip('Payment', 'payment', setModalState),
                  _buildFilterChip('Refund', 'refund', setModalState),
                  _buildFilterChip('Bonus', 'bonus', setModalState),
                ],
              ),
              const SizedBox(height: 20),
              const Text(
                'Date Range',
                style: TextStyle(
                  color: Colors.black87,
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 8),
              _buildDateRangeOptions(setModalState),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        setModalState(() {
                          selectedTypes = {'all'};
                          selectedDateRange = 'last_7';
                          selectedStatuses = {'completed', 'pending'};
                        });
                        setState(() {
                          _applyFilters();
                        });
                      },
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.black87,
                        side: BorderSide(color: Colors.grey.shade300),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                      ),
                      child: const Text('Reset'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        setState(() {
                          _applyFilters();
                        });
                        Navigator.pop(context);
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: ChongjaroenColors.secondaryColor,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                        elevation: 0,
                      ),
                      child: const Text(
                        'Apply Filters',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
            ],
          ),
        );
      },
    );
  }

  Widget _buildFilterChip(String label, String value, StateSetter setModalState) {
    final isSelected = selectedTypes.contains(value);

    return FilterChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (selected) {
        setModalState(() {
          if (value == 'all') {
            selectedTypes = {'all'};
          } else {
            selectedTypes.remove('all');
            if (selected) {
              selectedTypes.add(value);
            } else {
              selectedTypes.remove(value);
            }
            if (selectedTypes.isEmpty) {
              selectedTypes = {'all'};
            }
          }
        });
      },
      backgroundColor: Colors.grey.shade100,
      selectedColor: ChongjaroenColors.secondaryColor.withOpacity(0.2),
      checkmarkColor: ChongjaroenColors.secondaryColor,
      side: BorderSide(
        color: isSelected ? ChongjaroenColors.secondaryColor : Colors.grey.shade300,
        width: isSelected ? 1.5 : 1,
      ),
      labelStyle: TextStyle(
        color: isSelected ? ChongjaroenColors.secondaryColor : Colors.black87,
        fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
      ),
    );
  }

  Widget _buildDateRangeOptions(StateSetter setModalState) {
    return Column(
      children: [
        _buildRadioOption('Last 7 days', 'last_7', setModalState),
        _buildRadioOption('Last 30 days', 'last_30', setModalState),
        _buildRadioOption('Last 90 days', 'last_90', setModalState),
        _buildRadioOption('All time', 'all', setModalState),
      ],
    );
  }

  Widget _buildRadioOption(String label, String value, StateSetter setModalState) {
    return RadioListTile<String>(
      title: Text(
        label,
        style: const TextStyle(color: Colors.black87, fontSize: 15),
      ),
      value: value,
      groupValue: selectedDateRange,
      onChanged: (newValue) {
        setModalState(() {
          selectedDateRange = newValue!;
        });
      },
      activeColor: ChongjaroenColors.secondaryColor,
      contentPadding: EdgeInsets.zero,
    );
  }

  String _formatAmount(double amount) {
    return NumberFormat('#,##0.00').format(amount);
  }
}
