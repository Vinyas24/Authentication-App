// Utility script to view all users in the database
// Run with: node database/viewUsers.js

import mysql from 'mysql2/promise';
import { dbConfig } from './config.js';

async function viewUsers() {
    let connection;

    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to MySQL database\n');

        console.log('📋 Existing Users:');
        const [rows] = await connection.execute('SELECT userid, username, email, phone_number, created_at FROM user_data');

        if (rows.length === 0) {
            console.log('No users found in the database.');
        } else {
            console.table(rows);
        }

    } catch (error) {
        console.error('❌ Error viewing users:', error.message);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Connection closed');
        }
    }
}

viewUsers();
