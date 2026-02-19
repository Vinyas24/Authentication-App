# Database Setup

This directory contains scripts to set up and manage the `user_data` table.

## Table Structure

The `user_data` table includes the following columns:
- `userid` - INT AUTO_INCREMENT PRIMARY KEY
- `username` - VARCHAR(100) NOT NULL
- `email` - VARCHAR(255) NOT NULL UNIQUE
- `password` - VARCHAR(255) NOT NULL
- `phone_number` - VARCHAR(20)
- `created_at` - TIMESTAMP (auto-set on creation)
- `updated_at` - TIMESTAMP (auto-updated on modification)

## Setup Options

### Option 1: Using Node.js Script (Recommended)

Run the automated script that checks for existing columns before adding:

```bash
node database/addColumns.js
```

This script will:
- Connect to your MySQL database
- Check which columns already exist
- Add only the missing columns
- Display the final table structure

### Option 2: Using SQL File Directly

If you prefer to run SQL directly, use:

```bash
mysql -h mysql-3c580c50-v1ny45248-6b02.i.aivencloud.com \
      -P 16892 \
      -u avnadmin \
      -p \
      defaultdb < database/add_columns.sql
```

Or connect to your MySQL client and run:

```sql
USE defaultdb;
SOURCE database/add_columns.sql;
```

### Option 3: Create Table from Scratch

If the table doesn't exist yet, run:

```bash
node database/setupTable.js
```

Or use the SQL file:

```bash
mysql -h mysql-3c580c50-v1ny45248-6b02.i.aivencloud.com \
      -P 16892 \
      -u avnadmin \
      -p \
      defaultdb < database/setup_user_data_table.sql
```

## Database Configuration

Connection details are stored in `database/config.js`:
- Host: mysql-3c580c50-v1ny45248-6b02.i.aivencloud.com
- Port: 16892
- Database: defaultdb
- SSL: Required

## Notes

- The `userid` column is set as PRIMARY KEY with AUTO_INCREMENT
- The `email` column has a UNIQUE constraint
- Passwords should be hashed before storing (use bcrypt or similar)
- The scripts handle existing columns gracefully