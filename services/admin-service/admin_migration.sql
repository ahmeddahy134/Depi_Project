-- ============================================================
-- Admin Migration Script
-- Run this on your RDS MySQL database
-- ============================================================

USE techno_zone;

-- Add is_admin column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- ============================================================
-- Create your admin account (change email and password!)
-- ============================================================
-- First insert the admin user (password: Admin@123456)
-- The password hash below is for: Admin@123456
INSERT INTO users (name, email, password_hash, is_admin, created_at)
VALUES (
  'Ahmed Dahy Shaban',
  'admin@technozone.com',
  'scrypt:32768:8:1$placeholder$hash_will_be_set_by_script',
  TRUE,
  NOW()
) ON DUPLICATE KEY UPDATE is_admin = TRUE;
