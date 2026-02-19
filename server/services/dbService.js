// Database service for user operations
import mysql from 'mysql2/promise';
import { dbConfig } from '../../database/config.js';
import { encryptPassword, decryptPassword } from '../utils/encryption.js';

/**
 * Create a database connection
 */
const getConnection = async () => {
  return await mysql.createConnection(dbConfig);
};

/**
 * Sign up a new user
 * @param {Object} userData - User data (userid, username, email, password, phone_number)
 * @returns {Object} - Created user data (without password)
 */
export const createUser = async (userData) => {
  let connection;
  
  try {
    connection = await getConnection();
    
    // Encrypt password before storing
    const encryptedPassword = encryptPassword(userData.password);
    
    // Insert user into database directly
    // Database constraints (UNIQUE on email, PRIMARY KEY on userid) will handle duplicates
    await connection.execute(
      `INSERT INTO user_data (userid, username, email, password, phone_number) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        userData.userid,
        userData.username,
        userData.email,
        encryptedPassword,
        userData.phone_number || null
      ]
    );
    
    // Return user data without password
    return {
      userid: userData.userid,
      username: userData.username,
      email: userData.email,
      phone_number: userData.phone_number
    };
    
  } catch (error) {
    console.error('Database error in createUser:', error);
    
    // Handle duplicate key errors from database constraints
    if (error.code === 'ER_DUP_ENTRY') {
      if (error.sqlMessage.includes('userid')) {
        throw new Error('User ID already exists');
      }
      if (error.sqlMessage.includes('email')) {
        throw new Error('Email already exists');
      }
      throw new Error('User already exists');
    }
    
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

/**
 * Authenticate user (login)
 * @param {string} email - User email
 * @param {string} password - Plain text password
 * @returns {Object} - User data if authentication successful
 */
export const authenticateUser = async (email, password) => {
  let connection;
  
  try {
    connection = await getConnection();
    
    // Find user by email
    const [users] = await connection.execute(
      'SELECT * FROM user_data WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      throw new Error('Invalid email or password');
    }
    
    const user = users[0];
    
    // Decrypt stored password and compare
    let decryptedPassword;
    try {
      decryptedPassword = decryptPassword(user.password);
    } catch (decryptError) {
      console.error('Password decryption error:', decryptError);
      throw new Error('Invalid email or password');
    }
    
    // Compare passwords
    if (decryptedPassword !== password) {
      throw new Error('Invalid email or password');
    }
    
    // Return user data without password
    return {
      userid: user.userid,
      username: user.username,
      email: user.email,
      phone_number: user.phone_number
    };
    
  } catch (error) {
    console.error('Database error in authenticateUser:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

/**
 * Get user by userid
 * @param {string} userid - User ID
 * @returns {Object} - User data (without password)
 */
export const getUserById = async (userid) => {
  let connection;
  
  try {
    connection = await getConnection();
    
    const [users] = await connection.execute(
      'SELECT userid, username, email, phone_number, created_at FROM user_data WHERE userid = ?',
      [userid]
    );
    
    if (users.length === 0) {
      return null;
    }
    
    return users[0];
    
  } catch (error) {
    console.error('Database error in getUserById:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};