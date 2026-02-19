// Password encryption/decryption utilities
import crypto from 'crypto';

// Encryption key - In production, store this in environment variables
// For now, using a fixed key. In production, use: process.env.ENCRYPTION_KEY
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-character-secret-key-here!!'; // Must be 32 chars
const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; // For AES, this is always 16

/**
 * Encrypts a password using AES-256-CBC
 * @param {string} password - Plain text password
 * @returns {string} - Encrypted password (hex encoded)
 */
export const encryptPassword = (password) => {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY.slice(0, 32), 'utf8'),
      iv
    );
    
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Prepend IV to encrypted data (IV doesn't need to be secret)
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt password');
  }
};

/**
 * Decrypts a password using AES-256-CBC
 * @param {string} encryptedPassword - Encrypted password (hex encoded with IV)
 * @returns {string} - Decrypted password
 */
export const decryptPassword = (encryptedPassword) => {
  try {
    const parts = encryptedPassword.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted password format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY.slice(0, 32), 'utf8'),
      iv
    );
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt password');
  }
};