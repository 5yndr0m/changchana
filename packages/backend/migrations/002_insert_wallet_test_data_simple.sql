-- ============================================================
-- WALLET SYSTEM TEST DATA (Simplified)
-- ============================================================

-- Clean up any existing test data
DELETE FROM `wallet_audit_logs` WHERE created_at >= '2026-03-01';
DELETE FROM `wallet_voucher_redemptions` WHERE redeemed_at >= '2026-03-01';
DELETE FROM `wallet_transactions` WHERE id LIKE 'TX-202603%';
DELETE FROM `wallet_vouchers` WHERE id LIKE 'VCH-%';

-- Get first 5 users for testing
SET @user1 = (SELECT id FROM `users-permissions_user` ORDER BY id ASC LIMIT 1 OFFSET 0);
SET @user2 = (SELECT id FROM `users-permissions_user` ORDER BY id ASC LIMIT 1 OFFSET 1);
SET @user3 = (SELECT id FROM `users-permissions_user` ORDER BY id ASC LIMIT 1 OFFSET 2);
SET @user4 = (SELECT id FROM `users-permissions_user` ORDER BY id ASC LIMIT 1 OFFSET 3);
SET @user5 = (SELECT id FROM `users-permissions_user` ORDER BY id ASC LIMIT 1 OFFSET 4);

-- Create vouchers
INSERT INTO `wallet_vouchers` VALUES
('VCH-WELCOME50', 'WELCOME50', 50.00, 1000, 45, 1, '2026-03-01 00:00:00', '2026-03-31 23:59:59', 'active', '{"firstTimeOnly": true}', 'Welcome bonus', NULL, NOW(), NULL),
('VCH-BONUS100', 'BONUS100', 100.00, 500, 12, 1, '2026-03-15 00:00:00', '2026-04-15 23:59:59', 'active', '{"minTopUp": 500}', 'Premium bonus', NULL, NOW(), NULL),
('VCH-VIP200', 'VIP200', 200.00, 100, 5, 1, '2026-03-01 00:00:00', '2026-06-30 23:59:59', 'active', NULL, 'VIP exclusive', NULL, NOW(), NULL),
('VCH-EXPIRED', 'EXPIRED20', 20.00, 500, 150, 1, '2026-01-01 00:00:00', '2026-02-28 23:59:59', 'expired', NULL, 'Expired voucher', NULL, NOW(), NULL);

-- Create transactions for user1
INSERT INTO `wallet_transactions` (
  id, user_id, type, amount, balance_before, balance_after, status,
  payment_method, payment_transaction_id, reference_type, reference_id,
  description, fee, net_amount, metadata, ip_address, user_agent, created_at, completed_at
) VALUES
('TX-20260310-00001', @user1, 'top_up', 500.00, 0.00, 483.00, 'completed', 'card', 'chrg_test_123', 'omise', 'chrg_test_123', 'Credit card top-up', 17.00, 483.00, '{"card_brand":"Visa","card_last4":"4242"}', '127.0.0.1', 'Mobile App v1.0', '2026-03-10 10:30:00', '2026-03-10 10:30:15'),
('TX-20260310-00002', @user1, 'payment', 120.00, 483.00, 363.00, 'completed', NULL, NULL, 'booking', 'BK001', 'Table booking payment', 0.00, 120.00, '{"branch_id":1}', '127.0.0.1', 'Mobile App v1.0', '2026-03-10 14:20:00', '2026-03-10 14:20:05'),
('TX-20260311-00003', @user1, 'bonus', 50.00, 363.00, 413.00, 'completed', NULL, NULL, 'voucher', 'WELCOME50', 'Voucher bonus', 0.00, 50.00, '{"voucher_code":"WELCOME50"}', '127.0.0.1', 'Mobile App v1.0', '2026-03-11 09:15:00', '2026-03-11 09:15:02');

-- Create transactions for user2
INSERT INTO `wallet_transactions` (
  id, user_id, type, amount, balance_before, balance_after, status,
  payment_method, payment_transaction_id, reference_type, reference_id,
  description, fee, net_amount, metadata, ip_address, user_agent, created_at, completed_at
) VALUES
('TX-20260308-00004', @user2, 'top_up', 1000.00, 0.00, 1000.00, 'completed', 'promptpay', 'pp_test_456', 'omise', 'pp_test_456', 'PromptPay top-up', 0.00, 1000.00, NULL, '192.168.1.100', 'Mobile App v1.0', '2026-03-08 08:20:00', '2026-03-08 08:25:30'),
('TX-20260309-00005', @user2, 'payment', 250.00, 1000.00, 750.00, 'completed', NULL, NULL, 'event', 'EVT123', 'Concert tickets', 0.00, 250.00, '{"event":"Rock Festival","tickets":2}', '192.168.1.100', 'Mobile App v1.0', '2026-03-09 19:30:00', '2026-03-09 19:30:10'),
('TX-20260310-00006', @user2, 'payment', 180.00, 750.00, 570.00, 'completed', NULL, NULL, 'booking', 'BK002', 'Dinner reservation', 0.00, 180.00, '{"branch_id":2,"guests":4}', '192.168.1.100', 'Mobile App v1.0', '2026-03-10 11:45:00', '2026-03-10 11:45:08'),
('TX-20260313-00007', @user2, 'bonus', 100.00, 570.00, 670.00, 'completed', NULL, NULL, 'voucher', 'BONUS100', 'Bonus voucher', 0.00, 100.00, '{"voucher_code":"BONUS100"}', '192.168.1.100', 'Mobile App v1.0', '2026-03-13 15:20:00', '2026-03-13 15:20:05');

-- Create refund scenario for user3
INSERT INTO `wallet_transactions` (
  id, user_id, type, amount, balance_before, balance_after, status,
  payment_method, payment_transaction_id, reference_type, reference_id,
  description, fee, net_amount, metadata, ip_address, user_agent, created_at, completed_at
) VALUES
('TX-20260305-00008', @user3, 'top_up', 300.00, 0.00, 289.00, 'completed', 'card', 'chrg_test_789', 'omise', 'chrg_test_789', 'Card top-up', 11.00, 289.00, '{"card_brand":"Mastercard","card_last4":"1234"}', '10.0.0.50', 'Mozilla/5.0', '2026-03-05 12:00:00', '2026-03-05 12:00:20'),
('TX-20260306-00009', @user3, 'payment', 150.00, 289.00, 139.00, 'reversed', NULL, NULL, 'booking', 'BK003', 'Cancelled booking', 0.00, 150.00, '{"branch_id":1,"cancelled":true}', '10.0.0.50', 'Mobile App v1.0', '2026-03-06 10:30:00', '2026-03-06 10:30:05'),
('TX-20260307-00010', @user3, 'refund', 150.00, 139.00, 289.00, 'completed', NULL, NULL, 'transaction', 'TX-20260306-00009', 'Booking refund', 0.00, 150.00, '{"original":"TX-20260306-00009"}', 'system', 'Admin Panel', '2026-03-07 09:15:00', '2026-03-07 09:15:02');

-- Admin adjustment for user4
INSERT INTO `wallet_transactions` (
  id, user_id, type, amount, balance_before, balance_after, status,
  payment_method, payment_transaction_id, reference_type, reference_id,
  description, fee, net_amount, admin_id, admin_reason, metadata, ip_address, user_agent, created_at, completed_at
) VALUES
('TX-20260314-00011', @user4, 'top_up', 200.00, 0.00, 192.00, 'completed', 'card', 'chrg_test_012', 'omise', 'chrg_test_012', 'Initial top-up', 8.00, 192.00, NULL, NULL, '{"card_brand":"Visa"}', '172.16.0.10', 'Mobile App v1.0', '2026-03-14 14:00:00', '2026-03-14 14:00:15'),
('TX-20260314-00012', @user4, 'adjustment', 50.00, 192.00, 242.00, 'completed', NULL, NULL, 'admin', NULL, 'Service compensation', 0.00, 50.00, 107, 'Late delivery compensation', '{"reason":"service_issue"}', '10.1.1.1', 'Admin Panel', '2026-03-14 16:30:00', '2026-03-14 16:30:05');

-- Failed transaction for user5
INSERT INTO `wallet_transactions` (
  id, user_id, type, amount, balance_before, balance_after, status,
  payment_method, payment_transaction_id, reference_type, reference_id,
  description, fee, net_amount, admin_reason, metadata, ip_address, user_agent, created_at, failed_at
) VALUES
('TX-20260313-00013', @user5, 'top_up', 500.00, 0.00, 0.00, 'failed', 'card', 'chrg_test_345', 'omise', 'chrg_test_345', 'Failed top-up', 17.00, 483.00, 'Insufficient funds', '{"card_brand":"Visa"}', '192.168.2.50', 'Mobile App v1.0', '2026-03-13 20:15:00', '2026-03-13 20:15:10');

-- Pending transaction for user5
INSERT INTO `wallet_transactions` (
  id, user_id, type, amount, balance_before, balance_after, status,
  payment_method, payment_transaction_id, reference_type, reference_id,
  description, fee, net_amount, metadata, ip_address, user_agent, created_at
) VALUES
('TX-20260314-00014', @user5, 'top_up', 300.00, 0.00, 0.00, 'pending', 'bank_transfer', 'bxf_test_678', 'bank', 'bxf_test_678', 'Pending bank transfer', 11.00, 289.00, '{"bank":"SCB"}', '192.168.2.50', 'Mobile App v1.0', '2026-03-14 18:00:00');

-- Update wallet balances
UPDATE `wallets` SET balance = 413.00, updated_at = NOW() WHERE user_id = @user1;
UPDATE `wallets` SET balance = 670.00, updated_at = NOW() WHERE user_id = @user2;
UPDATE `wallets` SET balance = 289.00, updated_at = NOW() WHERE user_id = @user3;
UPDATE `wallets` SET balance = 242.00, updated_at = NOW() WHERE user_id = @user4;
UPDATE `wallets` SET balance = 0.00, updated_at = NOW() WHERE user_id = @user5;

SELECT 'Test data inserted successfully!' as status,
       'User 1: ฿413.00' as user1_balance,
       'User 2: ฿670.00' as user2_balance,
       'User 3: ฿289.00' as user3_balance,
       'User 4: ฿242.00' as user4_balance,
       'User 5: ฿0.00 (pending/failed)' as user5_balance;
