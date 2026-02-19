// Script to safely add columns to user_data table
// This script creates the table if it doesn't exist, then adds missing columns
// Run with: node database/addColumns.js

import mysql from 'mysql2/promise';
import { dbConfig } from './config.js';

async function addColumns() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL database\n');

    // Check if table exists
    const [tables] = await connection.execute(
      "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'defaultdb' AND table_name = 'user_data'"
    );
    
    const tableExists = tables[0].count > 0;

    if (!tableExists) {
      console.log('📋 Table user_data does not exist. Creating it with all columns...\n');
      
      // Create table with all required columns
      // Using IF NOT EXISTS for extra safety (though we already check above)
      const createTableSQL = `
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `;
      
      await connection.execute(createTableSQL);
      console.log('✅ Table user_data created successfully with all columns!\n');
      
      // Show table structure
      const [finalColumns] = await connection.execute('DESCRIBE user_data');
      console.log('📋 Table structure:');
      console.table(finalColumns);
      console.log('\n✅ Setup completed successfully!');
      return;
    }

    // Table exists - check current structure and add missing columns
    console.log('📋 Table user_data exists. Checking for missing columns...\n');
    const [columns] = await connection.execute('DESCRIBE user_data');
    const existingColumns = columns.map(col => col.Field.toLowerCase());
    console.log('Existing columns:', existingColumns.join(', '));
    console.log('');

    // Define columns to add
    const columnsToAdd = [
      {
        name: 'userid',
        definition: 'VARCHAR(50) PRIMARY KEY',
        position: 'FIRST',
        checkExists: existingColumns.includes('userid')
      },
      {
        name: 'username',
        definition: 'VARCHAR(100) NOT NULL',
        position: 'AFTER userid',
        checkExists: existingColumns.includes('username')
      },
      {
        name: 'email',
        definition: 'VARCHAR(255) NOT NULL UNIQUE',
        position: 'AFTER username',
        checkExists: existingColumns.includes('email')
      },
      {
        name: 'password',
        definition: 'VARCHAR(255) NOT NULL',
        position: 'AFTER email',
        checkExists: existingColumns.includes('password')
      },
      {
        name: 'phone_number',
        definition: 'VARCHAR(20)',
        position: 'AFTER password',
        checkExists: existingColumns.includes('phone_number')
      },
      {
        name: 'created_at',
        definition: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
        position: '',
        checkExists: existingColumns.includes('created_at')
      },
      {
        name: 'updated_at',
        definition: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
        position: '',
        checkExists: existingColumns.includes('updated_at')
      }
    ];

    // Add columns that don't exist
    let addedCount = 0;
    for (const col of columnsToAdd) {
      if (!col.checkExists) {
        try {
          const position = col.position ? ` ${col.position}` : '';
          const sql = `ALTER TABLE user_data ADD COLUMN ${col.name} ${col.definition}${position}`;
          await connection.execute(sql);
          console.log(`✅ Added column: ${col.name}`);
          addedCount++;
        } catch (error) {
          if (error.code === 'ER_DUP_FIELDNAME') {
            console.log(`⚠️  Column ${col.name} already exists, skipping...`);
          } else {
            console.error(`❌ Error adding column ${col.name}:`, error.message);
          }
        }
      } else {
        console.log(`⏭️  Column ${col.name} already exists, skipping...`);
      }
    }

    if (addedCount === 0) {
      console.log('\n✅ All required columns already exist!');
    }

    // Verify final table structure
    console.log('\n📋 Final table structure:');
    const [finalColumns] = await connection.execute('DESCRIBE user_data');
    console.table(finalColumns);

    console.log('\n✅ Column setup completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Error code:', error.code);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connection closed');
    }
  }
}

addColumns();