-- Setup script for user_data table
-- This script creates/updates the user_data table with required columns

USE defaultdb;

-- Drop table if exists (use with caution in production)
-- DROP TABLE IF EXISTS user_data;

-- Create user_data table with all required columns
CREATE TABLE IF NOT EXISTS user_data (
    userid VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- If table already exists and you need to add missing columns, use these:
-- (Run these only if the columns don't exist)

-- Add userid if missing (this should be PRIMARY KEY, so handle carefully)
-- ALTER TABLE user_data ADD COLUMN userid INT AUTO_INCREMENT PRIMARY KEY FIRST;

-- Add username if missing
-- ALTER TABLE user_data ADD COLUMN username VARCHAR(100) NOT NULL;

-- Add email if missing
-- ALTER TABLE user_data ADD COLUMN email VARCHAR(255) NOT NULL UNIQUE;

-- Add password if missing
-- ALTER TABLE user_data ADD COLUMN password VARCHAR(255) NOT NULL;

-- Add phone_number if missing
-- ALTER TABLE user_data ADD COLUMN phone_number VARCHAR(20);

-- Verify table structure
DESCRIBE user_data;