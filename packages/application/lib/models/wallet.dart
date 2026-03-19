// ignore_for_file: non_constant_identifier_names

class Wallet {
  late int userId;
  late double balance;
  late double pendingBalance;
  late double frozenBalance;
  late double totalBalance;
  late String currency;
  late String status;
  late int points;
  late DateTime? lastTransaction;

  Wallet({
    int? userId,
    double? balance,
    double? pendingBalance,
    double? frozenBalance,
    double? totalBalance,
    String? currency,
    String? status,
    int? points,
    DateTime? lastTransaction,
  }) {
    this.userId = userId ?? 0;
    this.balance = balance ?? 0.00;
    this.pendingBalance = pendingBalance ?? 0.00;
    this.frozenBalance = frozenBalance ?? 0.00;
    this.totalBalance = totalBalance ?? 0.00;
    this.currency = currency ?? "THB";
    this.status = status ?? "active";
    this.points = points ?? 0;
    this.lastTransaction = lastTransaction;
  }

  Wallet.fromJson(Map<String, dynamic> json) {
    userId = json['userId'] ?? 0;
    balance = (json['balance'] ?? 0.0).toDouble();
    pendingBalance = (json['pendingBalance'] ?? 0.0).toDouble();
    frozenBalance = (json['frozenBalance'] ?? 0.0).toDouble();
    totalBalance = (json['totalBalance'] ?? 0.0).toDouble();
    currency = json['currency'] ?? "THB";
    status = json['status'] ?? "active";
    points = json['points'] ?? 0;
    lastTransaction = json['lastTransaction'] != null
        ? DateTime.parse(json['lastTransaction'])
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['userId'] = userId;
    data['balance'] = balance;
    data['pendingBalance'] = pendingBalance;
    data['frozenBalance'] = frozenBalance;
    data['totalBalance'] = totalBalance;
    data['currency'] = currency;
    data['status'] = status;
    data['points'] = points;
    data['lastTransaction'] = lastTransaction?.toIso8601String();
    return data;
  }
}