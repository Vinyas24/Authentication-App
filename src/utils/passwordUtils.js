// Password encoding/decoding utilities
// For now, using base64 encoding (in production, use proper hashing like bcrypt)

export const encodePassword = (password) => {
  // Base64 encoding (for frontend demo)
  // In production, this should be handled by the backend with proper hashing
  return btoa(password);
};

export const decodePassword = (encodedPassword) => {
  // Base64 decoding
  return atob(encodedPassword);
};

// Note: In a real application, passwords should NEVER be decoded
// This is only for demonstration purposes. Passwords should be hashed (one-way) on the backend