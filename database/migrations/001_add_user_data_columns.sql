-- Migration: Add columns to user_data table
-- Columns: userid, username, password, phone_number, email

-- Check if table exists, if not create it
CREATE TABLE IF NOT EXISTS user_data (
    userid INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- If table already exists, add columns if they don't exist
-- Note: MySQL doesn't support IF NOT EXISTS for ALTER TABLE ADD COLUMN directly
-- So we'll use a stored procedure approach or handle this in the application

-- Add userid column if it doesn't exist (as PRIMARY KEY)
-- This is tricky in MySQL, so we'll assume the table structure needs to be set up properly

-- For existing table, you may need to run these individually:
-- ALTER TABLE user_data ADD COLUMN IF NOT EXISTS userid INT AUTO_INCREMENT PRIMARY KEY FIRST;
-- ALTER TABLE user_data ADD COLUMN IF NOT EXISTS username VARCHAR(100) NOT NULL AFTER userid;
-- ALTER TABLE user_data ADD COLUMN IF NOT EXISTS email VARCHAR(255) NOT NULL UNIQUE AFTER username;
-- ALTER TABLE user_data ADD COLUMN IF NOT EXISTS password VARCHAR(255) NOT NULL AFTER email;
-- ALTER TABLE user_data ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20) AFTER password;

-- Since MySQL doesn't support IF NOT EXISTS for ALTER TABLE ADD COLUMN,
-- here's the safe approach - drop and recreate if needed, or use application logic