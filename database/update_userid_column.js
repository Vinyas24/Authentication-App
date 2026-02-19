// Script to update existing userid column from INT to VARCHAR
// Run this if you already have a table with INT userid
// Run with: node database/update_userid_column.js

import mysql from 'mysql2/promise';
import { dbConfig } from './config.js';

async function updateUserIdColumn() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL database\n');

    // Check current table structure
    const [columns] = await connection.execute('DESCRIBE user_data');
    const useridColumn = columns.find(col => col.Field.toLowerCase() === 'userid');
    
    if (!useridColumn) {
      console.log('❌ userid column does not exist. Run addColumns.js first.');
      return;
    }

    console.log('Current userid column type:', useridColumn.Type);
    
    if (useridColumn.Type.includes('int')) {
      console.log('📋 Converting userid from INT to VARCHAR(50)...\n');
      
      // This is a complex operation - we need to:
      // 1. Drop the primary key constraint
      // 2. Change the column type
      // 3. Re-add the primary key constraint
      
      // Note: This will fail if there's existing data with INT values
      // You may need to migrate data first
      
      try {
        // Drop primary key if exists
        await connection.execute('ALTER TABLE user_data DROP PRIMARY KEY');
        console.log('✅ Dropped primary key constraint');
        
        // Change column type
        await connection.execute('ALTER TABLE user_data MODIFY COLUMN userid VARCHAR(50) NOT NULL');
        console.log('✅ Changed userid column type to VARCHAR(50)');
        
        // Re-add primary key
        await connection.execute('ALTER TABLE user_data ADD PRIMARY KEY (userid)');
        console.log('✅ Re-added primary key constraint');
        
        console.log('\n✅ Successfully updated userid column!');
      } catch (error) {
        console.error('❌ Error updating column:', error.message);
        console.log('\n💡 If you have existing data, you may need to:');
        console.log('   1. Export existing data');
        console.log('   2. Drop and recreate the table');
        console.log('   3. Import data with new userid values');
      }
    } else {
      console.log('✅ userid column is already VARCHAR. No changes needed.');
    }

    // Verify final table structure
    console.log('\n📋 Final table structure:');
    const [finalColumns] = await connection.execute('DESCRIBE user_data');
    console.table(finalColumns);

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

updateUserIdColumn();