import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { login } from '../services/api';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if redirected from signup with success message
    if (location.state?.message) {
      setSuccess(location.state.message);
      // Clear the state to prevent showing message on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

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
    setLoading(true);

    try {
      // Call login API
      const response = await login(formData.email, formData.password);
      
      // Store user session
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', response.user.email);
      localStorage.setItem('userId', response.user.userid);
      localStorage.setItem('userName', response.user.username);
      
      // Redirect to MovieFlix page
      window.location.href = 'https://movie-flix-inky.vercel.app/';
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
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
          <h2 className="auth-title">Sign In</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {success && <div className="auth-success">{success}</div>}
          {error && <div className="auth-error">{error}</div>}
          
          <div className="auth-input-group">
            <input
              type="email"
              name="email"
              placeholder="Email or phone number"
              value={formData.email}
              onChange={handleChange}
              required
              className="auth-input"
            />
          </div>
          
          <div className="auth-input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="auth-input"
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p className="auth-text">
            New to MovieFlix?{' '}
            <Link to="/signup" className="auth-link">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;