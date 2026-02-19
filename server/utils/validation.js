// Validation utilities (server-side)
// Duplicated from frontend to avoid import issues

export const validateUserId = (userid) => {
  // Must be at least 6 characters
  if (userid.length < 6) {
    return { valid: false, message: 'User ID must be at least 6 characters long' };
  }
  
  // Must contain only letters and numbers
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  if (!alphanumericRegex.test(userid)) {
    return { valid: false, message: 'User ID must contain only letters and numbers' };
  }
  
  return { valid: true, message: '' };
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }
  return { valid: true, message: '' };
};

export const validatePassword = (password) => {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long' };
  }
  return { valid: true, message: '' };
};