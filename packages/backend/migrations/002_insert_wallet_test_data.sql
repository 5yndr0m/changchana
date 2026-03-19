-- ============================================================
-- WALLET SYSTEM TEST DATA
-- ============================================================
-- This script creates comprehensive test data for the wallet system
-- Run this AFTER the main wallet tables migration (001_create_wallet_tables.sql)

-- ============================================================
-- 0. CLEANUP EXISTING TEST DATA (if any)
-- ============================================================
DELETE FROM `wallet_audit_logs` WHERE created_at >= '2026-03-01';
DELETE FROM `wallet_voucher_redemptions` WHERE redeemed_at >= '2026-03-01';
DELETE FROM `wallet_transactions` WHERE id LIKE 'TX-202603%';
DELETE FROM `wallet_vouchers` WHERE id LIKE 'VCH-%';

-- ============================================================
-- 1. CREATE VOUCHERS
-- ============================================================

INSERT INTO `wallet_vouchers` (
  `id`, `code`, `amount`, `max_redemptions`, `per_user_limit`,
  `used_count`, `valid_from`, `valid_until`,
  `description`, `conditions`, `status`, `created_at`
) VALUES
-- Active promotional voucher
(
  'VCH-WELCOME50',
  'WELCOME50',
  50.00,
  1000,
  1,
  45,
  '2026-03-01 00:00:00',
  '2026-03-31 23:59:59',
  'Welcome bonus for new users',
  '{"firstTimeOnly": true}',
  'active',
  NOW()
),
-- Active bonus voucher
(
  'VCH-BONUS100',
  'BONUS100',
  100.00,
  500,
  1,
  12,
  '2026-03-15 00:00:00',
  '2026-04-15 23:59:59',
  'Special bonus for premium customers',
  '{"minTopUp": 500}',
  'active',
  NOW()
),
-- High value voucher with conditions
(
  'VCH-VIP200',
  'VIP200',
  200.00,
  100,
  1,
  5,
  '2026-03-01 00:00:00',
  '2026-06-30 23:59:59',
  'VIP member exclusive voucher',
  '{"minTopUp": 1000, "firstTimeOnly": false}',
  'active',
  NOW()
),
-- Expired voucher for testing
(
  'VCH-EXPIRED20',
  'EXPIRED20',
  20.00,
  500,
  1,
  150,
  '2026-01-01 00:00:00',
  '2026-02-28 23:59:59',
  'Expired promotional voucher',
  NULL,
  'expired',
  NOW()
),
-- Fully redeemed voucher
(
  'VCH-FULL50',
  'FULL50',
  50.00,
  10,
  1,
  10,
  '2026-03-01 00:00:00',
  '2026-12-31 23:59:59',
  'Fully redeemed limited voucher',
  NULL,
  'active',
  NOW()
);

-- ============================================================
-- 2. CREATE TEST TRANSACTIONS
-- ============================================================
-- We'll create transactions for the first 10 users in the database

SET @user1 = (SELECT id FROM `users-permissions_user` ORDER BY id ASC LIMIT 1 OFFSET 0);
SET @user2 = (SELECT id FROM `users-permissions_user` ORDER BY id ASC LIMIT 1 OFFSET 1);
SET @user3 = (SELECT id FROM `users-permissions_user` ORDER BY id ASC LIMIT 1 OFFSET 2);
SET @user4 = (SELECT id FROM `users-permissions_user` ORDER BY id ASC LIMIT 1 OFFSET 3);
SET @user5 = (SELECT id FROM `users-permissions_user` ORDER BY id ASC LIMIT 1 OFFSET 4);

-- User 1: Active user with multiple transactions
INSERT INTO `wallet_transactions` (
  `id`, `user_id`, `type`, `amount`, `fee`, `net_amount`,
  `balance_before`, `balance_after`, `status`, `reference_type`,
  `reference_id`, `payment_method`, `description`, `metadata`,
  `ip_address`, `user_agent`, `created_at`, `completed_at`
) VALUES
-- Top-up transaction
(
  'TX-20260310-00001',
  @user1,
  'top_up',
  500.00,
  17.00,
  483.00,
  0.00,
  483.00,
  'completed',
  'omise_charge',
  'chrg_test_5xyzabc123',
  'card',
  'Top-up via credit card',
  '{"card_last4": "4242", "card_brand": "Visa"}',
  '127.0.0.1',
  'Mozilla/5.0',
  '2026-03-10 10:30:00',
  '2026-03-10 10:30:15'
),
-- Payment transaction
(
  'TX-20260310-00002',
  @user1,
  'payment',
  120.00,
  0.00,
  120.00,
  483.00,
  363.00,
  'completed',
  'booking',
  'BK001',
  NULL,
  'Payment for table booking',
  '{"branch_id": 1, "booking_date": "2026-03-15"}',
  '127.0.0.1',
  'Mobile App v1.0',
  '2026-03-10 14:20:00',
  '2026-03-10 14:20:05'
),
-- Bonus transaction
(
  'TX-20260311-00003',
  @user1,
  'bonus',
  50.00,
  0.00,
  50.00,
  363.00,
  413.00,
  'completed',
  'voucher',
  'WELCOME50',
  NULL,
  'Voucher redemption bonus',
  '{"voucher_code": "WELCOME50"}',
  '127.0.0.1',
  'Mobile App v1.0',
  '2026-03-11 09:15:00',
  '2026-03-11 09:15:02'
),
-- Points conversion
(
  'TX-20260312-00004',
  @user1,
  'conversion',
  25.00,
  0.00,
  25.00,
  413.00,
  438.00,
  'completed',
  'points_conversion',
  NULL,
  NULL,
  'Converted 250 points to wallet balance',
  '{"points_used": 250}',
  '127.0.0.1',
  'Mobile App v1.0',
  '2026-03-12 16:45:00',
  '2026-03-12 16:45:03'
);

-- Update user1's wallet balance
UPDATE `wallets` SET balance = 438.00, updated_at = NOW() WHERE user_id = @user1;

-- User 2: Top-up and multiple payments
INSERT INTO `wallet_transactions` (
  `id`, `user_id`, `type`, `amount`, `fee`, `net_amount`,
  `balance_before`, `balance_after`, `status`, `reference_type`,
  `reference_id`, `payment_method`, `description`, `metadata`,
  `ip_address`, `user_agent`, `created_at`, `completed_at`
) VALUES
(
  'TX-20260308-00005',
  @user2,
  'top_up',
  1000.00,
  0.00,
  1000.00,
  0.00,
  1000.00,
  'completed',
  'omise_charge',
  'chrg_test_6abc456',
  'promptpay',
  'Top-up via PromptPay',
  '{"qr_code": "0020160001234567890123"}',
  '192.168.1.100',
  'Mobile App v1.0',
  '2026-03-08 08:20:00',
  '2026-03-08 08:25:30'
),
(
  'TX-20260309-00006',
  @user2,
  'payment',
  250.00,
  0.00,
  250.00,
  1000.00,
  750.00,
  'completed',
  'event_ticket',
  'EVT123',
  NULL,
  'Concert ticket purchase',
  '{"event_name": "Rock Festival 2026", "tickets": 2}',
  '192.168.1.100',
  'Mobile App v1.0',
  '2026-03-09 19:30:00',
  '2026-03-09 19:30:10'
),
(
  'TX-20260310-00007',
  @user2,
  'payment',
  180.00,
  0.00,
  180.00,
  750.00,
  570.00,
  'completed',
  'booking',
  'BK002',
  NULL,
  'Dinner reservation',
  '{"branch_id": 2, "guests": 4}',
  '192.168.1.100',
  'Mobile App v1.0',
  '2026-03-10 11:45:00',
  '2026-03-10 11:45:08'
),
(
  'TX-20260313-00008',
  @user2,
  'bonus',
  100.00,
  0.00,
  100.00,
  570.00,
  670.00,
  'completed',
  'voucher',
  'BONUS100',
  NULL,
  'Voucher redemption bonus',
  '{"voucher_code": "BONUS100"}',
  '192.168.1.100',
  'Mobile App v1.0',
  '2026-03-13 15:20:00',
  '2026-03-13 15:20:05'
);

UPDATE `wallets` SET balance = 670.00, updated_at = NOW() WHERE user_id = @user2;

-- User 3: Refund scenario
INSERT INTO `wallet_transactions` (
  `id`, `user_id`, `type`, `amount`, `fee`, `net_amount`,
  `balance_before`, `balance_after`, `status`, `reference_type`,
  `reference_id`, `payment_method`, `description`, `metadata`,
  `ip_address`, `user_agent`, `created_at`, `completed_at`
) VALUES
(
  'TX-20260305-00009',
  @user3,
  'top_up',
  300.00,
  11.00,
  289.00,
  0.00,
  289.00,
  'completed',
  'omise_charge',
  'chrg_test_7def789',
  'card',
  'Top-up via credit card',
  '{"card_last4": "1234", "card_brand": "Mastercard"}',
  '10.0.0.50',
  'Mozilla/5.0',
  '2026-03-05 12:00:00',
  '2026-03-05 12:00:20'
),
(
  'TX-20260306-00010',
  @user3,
  'payment',
  150.00,
  0.00,
  150.00,
  289.00,
  139.00,
  'reversed',
  'booking',
  'BK003',
  NULL,
  'Table booking - cancelled',
  '{"branch_id": 1, "cancelled": true}',
  '10.0.0.50',
  'Mobile App v1.0',
  '2026-03-06 10:30:00',
  '2026-03-06 10:30:05'
),
(
  'TX-20260307-00011',
  @user3,
  'refund',
  150.00,
  0.00,
  150.00,
  139.00,
  289.00,
  'completed',
  'transaction',
  'TX-20260306-00010',
  NULL,
  'Refund for cancelled booking',
  '{"original_transaction": "TX-20260306-00010"}',
  'system',
  'Admin Panel',
  '2026-03-07 09:15:00',
  '2026-03-07 09:15:02'
);

UPDATE `wallets` SET balance = 289.00, updated_at = NOW() WHERE user_id = @user3;

-- User 4: Admin adjustment scenario
INSERT INTO `wallet_transactions` (
  `id`, `user_id`, `type`, `amount`, `fee`, `net_amount`,
  `balance_before`, `balance_after`, `status`, `reference_type`,
  `reference_id`, `payment_method`, `description`, `metadata`,
  `ip_address`, `user_agent`, `created_at`, `completed_at`, `admin_id`
) VALUES
(
  'TX-20260314-00012',
  @user4,
  'top_up',
  200.00,
  8.00,
  192.00,
  0.00,
  192.00,
  'completed',
  'omise_charge',
  'chrg_test_8ghi012',
  'card',
  'Initial top-up',
  '{"card_last4": "5678", "card_brand": "Visa"}',
  '172.16.0.10',
  'Mobile App v1.0',
  '2026-03-14 14:00:00',
  '2026-03-14 14:00:15'
),
(
  'TX-20260314-00013',
  @user4,
  'adjustment',
  50.00,
  0.00,
  50.00,
  192.00,
  242.00,
  'completed',
  'admin_adjustment',
  NULL,
  NULL,
  'Compensation for service issue',
  '{"reason": "Late delivery compensation", "admin_note": "Approved by manager"}',
  '10.1.1.1',
  'Admin Panel',
  '2026-03-14 16:30:00',
  '2026-03-14 16:30:05',
  107
);

UPDATE `wallets` SET balance = 242.00, updated_at = NOW() WHERE user_id = @user4;

-- User 5: Failed and pending transactions
INSERT INTO `wallet_transactions` (
  `id`, `user_id`, `type`, `amount`, `fee`, `net_amount`,
  `balance_before`, `balance_after`, `status`, `reference_type`,
  `reference_id`, `payment_method`, `description`, `metadata`,
  `ip_address`, `user_agent`, `created_at`, `error_message`
) VALUES
(
  'TX-20260313-00014',
  @user5,
  'top_up',
  500.00,
  17.00,
  483.00,
  0.00,
  0.00,
  'failed',
  'omise_charge',
  'chrg_test_9jkl345',
  'card',
  'Top-up attempt - card declined',
  '{"card_last4": "9999", "card_brand": "Visa"}',
  '192.168.2.50',
  'Mobile App v1.0',
  '2026-03-13 20:15:00',
  'Insufficient funds on card'
),
(
  'TX-20260314-00015',
  @user5,
  'top_up',
  300.00,
  11.00,
  289.00,
  0.00,
  0.00,
  'pending',
  'omise_charge',
  'chrg_test_10mno678',
  'bank_transfer',
  'Bank transfer pending confirmation',
  '{"bank": "SCB", "transfer_ref": "TRF20260314001"}',
  '192.168.2.50',
  'Mobile App v1.0',
  '2026-03-14 18:00:00',
  NULL
);

-- ============================================================
-- 3. CREATE VOUCHER REDEMPTIONS
-- ============================================================

INSERT INTO `wallet_voucher_redemptions` (
  `voucher_id`, `user_id`, `transaction_id`, `redeemed_at`
)
SELECT
  v.id,
  @user1,
  'TX-20260311-00003',
  '2026-03-11 09:15:00'
FROM `wallet_vouchers` v
WHERE v.code = 'WELCOME50'
LIMIT 1;

INSERT INTO `wallet_voucher_redemptions` (
  `voucher_id`, `user_id`, `transaction_id`, `redeemed_at`
)
SELECT
  v.id,
  @user2,
  'TX-20260313-00008',
  '2026-03-13 15:20:00'
FROM `wallet_vouchers` v
WHERE v.code = 'BONUS100'
LIMIT 1;

-- ============================================================
-- 4. CREATE AUDIT LOGS
-- ============================================================

INSERT INTO `wallet_audit_logs` (
  `user_id`, `action`, `entity_type`, `entity_id`,
  `old_value`, `new_value`, `performed_by`, `ip_address`, `created_at`
) VALUES
-- Balance changes from transactions
(
  @user1,
  'balance_change',
  'wallet',
  (SELECT id FROM wallets WHERE user_id = @user1),
  '{"balance": 0}',
  '{"balance": 483}',
  @user1,
  '127.0.0.1',
  '2026-03-10 10:30:15'
),
(
  @user1,
  'balance_change',
  'wallet',
  (SELECT id FROM wallets WHERE user_id = @user1),
  '{"balance": 483}',
  '{"balance": 363}',
  @user1,
  '127.0.0.1',
  '2026-03-10 14:20:05'
),
(
  @user4,
  'balance_adjustment',
  'wallet',
  (SELECT id FROM wallets WHERE user_id = @user4),
  '{"balance": 192}',
  '{"balance": 242}',
  107,
  '10.1.1.1',
  '2026-03-14 16:30:05'
),
-- Voucher creation
(
  NULL,
  'voucher_created',
  'voucher',
  (SELECT id FROM wallet_vouchers WHERE code = 'WELCOME50'),
  NULL,
  '{"code": "WELCOME50", "amount": 50}',
  107,
  '10.1.1.1',
  NOW()
),
-- Voucher redemption
(
  @user1,
  'voucher_redeemed',
  'voucher',
  (SELECT id FROM wallet_vouchers WHERE code = 'WELCOME50'),
  '{"used_count": 44}',
  '{"used_count": 45}',
  @user1,
  '127.0.0.1',
  '2026-03-11 09:15:00'
);

-- ============================================================
-- 5. CREATE DIVERSE TRANSACTION SCENARIOS
-- ============================================================

-- Add some more varied transactions for better test coverage
INSERT INTO `wallet_transactions` (
  `id`, `user_id`, `type`, `amount`, `fee`, `net_amount`,
  `balance_before`, `balance_after`, `status`, `reference_type`,
  `description`, `created_at`, `completed_at`
) VALUES
-- Large transaction
(
  'TX-20260314-00016',
  @user2,
  'payment',
  500.00,
  0.00,
  500.00,
  670.00,
  170.00,
  'completed',
  'event_ticket',
  'VIP concert tickets - 4 pcs',
  '2026-03-14 20:00:00',
  '2026-03-14 20:00:12'
),
-- Small transaction
(
  'TX-20260314-00017',
  @user1,
  'payment',
  15.50,
  0.00,
  15.50,
  438.00,
  422.50,
  'completed',
  'menu_order',
  'Coffee and snack order',
  '2026-03-14 08:30:00',
  '2026-03-14 08:30:05'
);

UPDATE `wallets` SET balance = 170.00, updated_at = NOW() WHERE user_id = @user2;
UPDATE `wallets` SET balance = 422.50, updated_at = NOW() WHERE user_id = @user1;

-- ============================================================
-- SUMMARY OF TEST DATA CREATED
-- ============================================================
-- - 5 Vouchers (3 active, 1 expired, 1 fully redeemed)
-- - 17 Transactions across 5 users
--   - 6 top_up (4 completed, 1 failed, 1 pending)
--   - 6 payment (5 completed, 1 refunded)
--   - 2 bonus
--   - 1 refund
--   - 1 adjustment
--   - 1 conversion
-- - 2 Voucher redemptions
-- - 5 Audit log entries
--
-- User balances after test data:
-- User 1: ฿422.50
-- User 2: ฿170.00
-- User 3: ฿289.00
-- User 4: ฿242.00
-- User 5: ฿0.00 (failed and pending transactions)
-- ============================================================

SELECT 'Test data successfully inserted!' as status;
