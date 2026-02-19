// Script to setup user_data table with required columns
// Run with: node database/setupTable.js

import mysql from 'mysql2/promise';
import { dbConfig } from './config.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function setupTable() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database');

    // Read SQL file
    const sqlFile = join(__dirname, 'setup_user_data_table.sql');
    const sql = readFileSync(sqlFile, 'utf8');
    
    // Execute SQL
    const statements = sql.split(';').filter(s => s.trim().length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.execute(statement);
          console.log('Executed:', statement.substring(0, 50) + '...');
        } catch (error) {
          // Ignore errors for DESCRIBE and other non-critical statements
          if (!statement.trim().toUpperCase().startsWith('DESCRIBE')) {
            console.error('Error executing statement:', error.message);
          }
        }
      }
    }

    // Verify table structure
    const [rows] = await connection.execute('DESCRIBE user_data');
    console.log('\nTable structure:');
    console.table(rows);

    console.log('\n✅ Table setup completed successfully!');

  } catch (error) {
    console.error('Error setting up table:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Connection closed');
    }
  }
}

setupTable();