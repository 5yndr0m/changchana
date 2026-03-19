// ignore_for_file: non_constant_identifier_names

class WalletTransaction {
  late String id;
  late String type;
  late double amount;
  late double balanceBefore;
  late double balanceAfter;
  late String status;
  late String? paymentMethod;
  late String? referenceId;
  late String? description;
  late DateTime createdAt;
  late DateTime? completedAt;

  WalletTransaction({
    String? id,
    String? type,
    double? amount,
    double? balanceBefore,
    double? balanceAfter,
    String? status,
    String? paymentMethod,
    String? referenceId,
    String? description,
    DateTime? createdAt,
    DateTime? completedAt,
  }) {
    this.id = id ?? "";
    this.type = type ?? "";
    this.amount = amount ?? 0.00;
    this.balanceBefore = balanceBefore ?? 0.00;
    this.balanceAfter = balanceAfter ?? 0.00;
    this.status = status ?? "pending";
    this.paymentMethod = paymentMethod;
    this.referenceId = referenceId;
    this.description = description;
    this.createdAt = createdAt ?? DateTime.now();
    this.completedAt = completedAt;
  }

  WalletTransaction.fromJson(Map<String, dynamic> json) {
    id = json['id'] ?? "";
    type = json['type'] ?? "";
    amount = (json['amount'] ?? 0.0).toDouble();
    balanceBefore = (json['balanceBefore'] ?? 0.0).toDouble();
    balanceAfter = (json['balanceAfter'] ?? 0.0).toDouble();
    status = json['status'] ?? "pending";
    paymentMethod = json['paymentMethod'];
    referenceId = json['referenceId'];
    description = json['description'];
    createdAt = json['createdAt'] != null
        ? DateTime.parse(json['createdAt'])
        : DateTime.now();
    completedAt = json['completedAt'] != null
        ? DateTime.parse(json['completedAt'])
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['id'] = id;
    data['type'] = type;
    data['amount'] = amount;
    data['balanceBefore'] = balanceBefore;
    data['balanceAfter'] = balanceAfter;
    data['status'] = status;
    data['paymentMethod'] = paymentMethod;
    data['referenceId'] = referenceId;
    data['description'] = description;
    data['createdAt'] = createdAt.toIso8601String();
    data['completedAt'] = completedAt?.toIso8601String();
    return data;
  }

  String getTypeIcon() {
    switch (type) {
      case 'top_up':
        return '↓';
      case 'payment':
        return '↑';
      case 'refund':
        return '↓';
      case 'bonus':
        return '↓';
      case 'adjustment':
        return type.contains('credit') ? '↓' : '↑';
      case 'withdrawal':
        return '↑';
      default:
        return '';
    }
  }

  String getTypeLabel() {
    switch (type) {
      case 'top_up':
        return 'Top-up';
      case 'payment':
        return 'Payment';
      case 'refund':
        return 'Refund';
      case 'bonus':
        return 'Bonus Credit';
      case 'adjustment':
        return 'Adjustment';
      case 'withdrawal':
        return 'Withdrawal';
      default:
        return type;
    }
  }
}