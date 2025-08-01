import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RealLoginPage.css'; // Import custom CSS

const RealLoginPage = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'usernameOrEmail') setUsernameOrEmail(value);
    if (name === 'password') setPassword(value);
  };

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    // Check if fields are empty
    if (!usernameOrEmail || !password) {
      setError('Please fill in both fields');
      return;
    }

    // Check if email is in a valid format (basic validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (usernameOrEmail && !emailRegex.test(usernameOrEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const response = await axios.post('https://invota-backend-production.up.railway.app/api/auth/login', {
        usernameOrEmail,
        password,
      });

      // If login is successful, check the response
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token); // Store JWT token in localStorage
        navigate('/update-basic-details'); // Redirect to the account update page
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="glassy-container">
        <h2 className="text-center text-white">Login</h2>
        {error && <p className="error-message text-center text-danger">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <label htmlFor="usernameOrEmail" className="text-white">Username or Email:</label>
            <input
              type="text"
              id="usernameOrEmail"
              name="usernameOrEmail"
              className="form-control"
              value={usernameOrEmail}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="password" className="text-white">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn-login w-100">Login</button>
        </form>
      </div>
    </div>
  );
};

export default RealLoginPage;
