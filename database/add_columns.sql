-- Simple SQL script to add columns to existing user_data table
-- Run this directly in your MySQL client or via command line

USE defaultdb;

-- Add columns if they don't exist
-- Note: MySQL doesn't support IF NOT EXISTS for ALTER TABLE ADD COLUMN
-- So check manually or use the script below

-- Add userid column (PRIMARY KEY with AUTO_INCREMENT)
-- Only run if userid doesn't exist
ALTER TABLE user_data 
ADD COLUMN userid INT AUTO_INCREMENT PRIMARY KEY FIRST;

-- Add username column
-- Only run if username doesn't exist
ALTER TABLE user_data 
ADD COLUMN username VARCHAR(100) NOT NULL AFTER userid;

-- Add email column
-- Only run if email doesn't exist
ALTER TABLE user_data 
ADD COLUMN email VARCHAR(255) NOT NULL UNIQUE AFTER username;

-- Add password column
-- Only run if password doesn't exist
ALTER TABLE user_data 
ADD COLUMN password VARCHAR(255) NOT NULL AFTER email;

-- Add phone_number column
-- Only run if phone_number doesn't exist
ALTER TABLE user_data 
ADD COLUMN phone_number VARCHAR(20) AFTER password;

-- Add timestamps (optional but recommended)
ALTER TABLE user_data 
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE user_data 
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Verify the table structure
DESCRIBE user_data;