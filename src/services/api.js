// API service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Make API request
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

/**
 * Sign up a new user
 */
export const signup = async (userData) => {
  return await apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      userid: userData.userid,
      username: userData.name,
      email: userData.email,
      password: userData.password,
      phone_number: userData.phoneNumber || null,
    }),
  });
};

/**
 * Login user
 */
export const login = async (email, password) => {
  return await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  });
};