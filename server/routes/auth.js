// Authentication routes
import express from 'express';
import { createUser, authenticateUser } from '../services/dbService.js';
import { validateUserId, validateEmail, validatePassword } from '../utils/validation.js';

const router = express.Router();

/**
 * POST /api/auth/signup
 * Create a new user account
 */
router.post('/signup', async (req, res) => {
  try {
    const { userid, username, email, password, phone_number } = req.body;
    
    // Validate input
    if (!userid || !username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    
    // Validate userid format
    const useridValidation = validateUserId(userid);
    if (!useridValidation.valid) {
      return res.status(400).json({ 
        success: false, 
        message: useridValidation.message 
      });
    }
    
    // Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return res.status(400).json({ 
        success: false, 
        message: emailValidation.message 
      });
    }
    
    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ 
        success: false, 
        message: passwordValidation.message 
      });
    }
    
    // Create user
    const user = await createUser({
      userid,
      username,
      email,
      password,
      phone_number: phone_number || null
    });
    
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create account'
    });
  }
});

/**
 * POST /api/auth/login
 * Authenticate user and return user data
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }
    
    // Authenticate user
    const user = await authenticateUser(email, password);
    
    res.json({
      success: true,
      message: 'Login successful',
      user
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Invalid email or password'
    });
  }
});

export default router;