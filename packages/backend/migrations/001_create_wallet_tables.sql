-- Wallet Feature Database Migration
-- Version: 1.0
-- Date: 2026-03-15
-- Description: Creates all necessary tables for wallet functionality

-- ============================================================================
-- Table 1: wallets
-- ============================================================================
CREATE TABLE IF NOT EXISTS `wallets` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `balance` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `pending_balance` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `frozen_balance` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `status` ENUM('active', 'frozen', 'suspended') NOT NULL DEFAULT 'active',
  `frozen_reason` TEXT NULL,
  `frozen_by` INT UNSIGNED NULL,
  `frozen_at` DATETIME NULL,
  `auto_unfreeze_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_wallet_user` FOREIGN KEY (`user_id`) REFERENCES `users-permissions_user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wallet_frozen_by` FOREIGN KEY (`frozen_by`) REFERENCES `users-permissions_user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table 2: wallet_transactions
-- ============================================================================
CREATE TABLE IF NOT EXISTS `wallet_transactions` (
  `id` VARCHAR(50) NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `type` ENUM('top_up', 'payment', 'refund', 'bonus', 'adjustment', 'withdrawal', 'conversion') NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `balance_before` DECIMAL(10,2) NOT NULL,
  `balance_after` DECIMAL(10,2) NOT NULL,
  `status` ENUM('pending', 'completed', 'failed', 'reversed') NOT NULL DEFAULT 'pending',
  `payment_method` VARCHAR(50) NULL,
  `payment_transaction_id` VARCHAR(255) NULL,
  `reference_type` VARCHAR(50) NULL,
  `reference_id` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `fee` DECIMAL(10,2) DEFAULT 0.00,
  `net_amount` DECIMAL(10,2) NULL,
  `admin_id` INT UNSIGNED NULL,
  `admin_reason` TEXT NULL,
  `metadata` JSON NULL,
  `ip_address` VARCHAR(45) NULL,
  `user_agent` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `completed_at` DATETIME NULL,
  `failed_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_created` (`user_id`, `created_at` DESC),
  KEY `idx_type_status` (`type`, `status`),
  KEY `idx_status_created` (`status`, `created_at`),
  KEY `idx_reference` (`reference_type`, `reference_id`),
  KEY `idx_payment_transaction` (`payment_transaction_id`),
  KEY `idx_created_at` (`created_at` DESC),
  CONSTRAINT `fk_wtrans_user` FOREIGN KEY (`user_id`) REFERENCES `users-permissions_user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wtrans_admin` FOREIGN KEY (`admin_id`) REFERENCES `users-permissions_user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table 3: wallet_vouchers
-- ============================================================================
CREATE TABLE IF NOT EXISTS `wallet_vouchers` (
  `id` VARCHAR(50) NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `max_redemptions` INT NULL,
  `used_count` INT NOT NULL DEFAULT 0,
  `per_user_limit` INT DEFAULT 1,
  `valid_from` DATETIME NOT NULL,
  `valid_until` DATETIME NOT NULL,
  `status` ENUM('active', 'expired', 'disabled') NOT NULL DEFAULT 'active',
  `conditions` JSON NULL,
  `description` TEXT NULL,
  `created_by` INT UNSIGNED NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`),
  KEY `idx_status_valid` (`status`, `valid_from`, `valid_until`),
  CONSTRAINT `fk_voucher_created_by` FOREIGN KEY (`created_by`) REFERENCES `users-permissions_user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table 4: wallet_voucher_redemptions
-- ============================================================================
CREATE TABLE IF NOT EXISTS `wallet_voucher_redemptions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `voucher_id` VARCHAR(50) NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `transaction_id` VARCHAR(50) NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `redeemed_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_voucher` (`voucher_id`),
  KEY `idx_user_voucher` (`user_id`, `voucher_id`),
  KEY `idx_redeemed_at` (`redeemed_at`),
  CONSTRAINT `fk_redemption_voucher` FOREIGN KEY (`voucher_id`) REFERENCES `wallet_vouchers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_redemption_user` FOREIGN KEY (`user_id`) REFERENCES `users-permissions_user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_redemption_transaction` FOREIGN KEY (`transaction_id`) REFERENCES `wallet_transactions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table 5: user_bank_accounts (Optional - for withdrawals)
-- ============================================================================
CREATE TABLE IF NOT EXISTS `user_bank_accounts` (
  `id` VARCHAR(50) NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `bank_code` VARCHAR(10) NOT NULL,
  `account_number` VARCHAR(255) NOT NULL,
  `account_name` VARCHAR(255) NOT NULL,
  `is_default` BOOLEAN DEFAULT FALSE,
  `verified` BOOLEAN DEFAULT FALSE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  UNIQUE KEY `uk_user_bank_account` (`user_id`, `bank_code`, `account_number`),
  CONSTRAINT `fk_bank_account_user` FOREIGN KEY (`user_id`) REFERENCES `users-permissions_user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table 6: wallet_withdrawals (Optional)
-- ============================================================================
CREATE TABLE IF NOT EXISTS `wallet_withdrawals` (
  `id` VARCHAR(50) NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `transaction_id` VARCHAR(50) NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `fee` DECIMAL(10,2) DEFAULT 0.00,
  `net_amount` DECIMAL(10,2) NOT NULL,
  `bank_account_id` VARCHAR(50) NULL,
  `status` ENUM('pending', 'approved', 'processing', 'completed', 'rejected', 'failed') NOT NULL DEFAULT 'pending',
  `approved_by` INT UNSIGNED NULL,
  `approved_at` DATETIME NULL,
  `payout_transaction_id` VARCHAR(255) NULL,
  `rejection_reason` TEXT NULL,
  `estimated_completion` DATETIME NULL,
  `completed_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_status` (`user_id`, `status`),
  KEY `idx_status_created` (`status`, `created_at`),
  CONSTRAINT `fk_withdrawal_user` FOREIGN KEY (`user_id`) REFERENCES `users-permissions_user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_withdrawal_transaction` FOREIGN KEY (`transaction_id`) REFERENCES `wallet_transactions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_withdrawal_bank_account` FOREIGN KEY (`bank_account_id`) REFERENCES `user_bank_accounts` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_withdrawal_approved_by` FOREIGN KEY (`approved_by`) REFERENCES `users-permissions_user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table 7: wallet_audit_logs
-- ============================================================================
CREATE TABLE IF NOT EXISTS `wallet_audit_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `wallet_id` INT UNSIGNED NULL,
  `transaction_id` VARCHAR(50) NULL,
  `action` VARCHAR(50) NOT NULL,
  `actor_id` INT UNSIGNED NULL,
  `actor_type` ENUM('user', 'admin', 'system') NOT NULL,
  `balance_before` DECIMAL(10,2) NULL,
  `balance_after` DECIMAL(10,2) NULL,
  `changes` JSON NULL,
  `ip_address` VARCHAR(45) NULL,
  `user_agent` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_wallet_created` (`wallet_id`, `created_at` DESC),
  KEY `idx_transaction_id` (`transaction_id`),
  KEY `idx_actor_created` (`actor_id`, `created_at`),
  CONSTRAINT `fk_audit_wallet` FOREIGN KEY (`wallet_id`) REFERENCES `wallets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_audit_transaction` FOREIGN KEY (`transaction_id`) REFERENCES `wallet_transactions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_audit_actor` FOREIGN KEY (`actor_id`) REFERENCES `users-permissions_user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Initialize wallets for existing users
-- ============================================================================
INSERT INTO wallets (user_id, balance, status, created_at)
SELECT
  id,
  0.00,
  'active',
  NOW()
FROM `users-permissions_user`
WHERE NOT EXISTS (
  SELECT 1 FROM wallets WHERE wallets.user_id = `users-permissions_user`.id
);
