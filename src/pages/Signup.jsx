import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { validateUserId, validateEmail, validatePassword } from '../utils/validation';
import { signup } from '../services/api';
import './Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    userid: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate userid
    const useridValidation = validateUserId(formData.userid);
    if (!useridValidation.valid) {
      setError(useridValidation.message);
      return;
    }
    
    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.valid) {
      setError(emailValidation.message);
      return;
    }
    
    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.message);
      return;
    }
    
    // Check password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Call signup API
      const response = await signup({
        userid: formData.userid,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber
      });
      
      // After successful signup, redirect to login
      navigate('/login', { 
        state: { 
          message: 'Account created successfully! Please sign in.' 
        } 
      });
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-gradient"></div>
      </div>
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-logo">MovieFlix</h1>
          <h2 className="auth-title">Sign Up</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          
          <div className="auth-form-row">
            <div className="auth-input-group">
              <input
                type="text"
                name="userid"
                placeholder="User ID"
                value={formData.userid}
                onChange={handleChange}
                required
                minLength={6}
                pattern="[a-zA-Z0-9]+"
                className="auth-input"
                title="6+ letters & numbers"
              />
            </div>
            
            <div className="auth-input-group">
              <input
                type="text"
                name="name"
                placeholder="Full name"
                value={formData.name}
                onChange={handleChange}
                required
                className="auth-input"
              />
            </div>
          </div>
          
          <div className="auth-form-row">
            <div className="auth-input-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="auth-input"
              />
            </div>
            
            <div className="auth-input-group">
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone (optional)"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="auth-input"
              />
            </div>
          </div>
          
          <div className="auth-form-row">
            <div className="auth-input-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="auth-input"
              />
            </div>
            
            <div className="auth-input-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="auth-input"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p className="auth-text">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;