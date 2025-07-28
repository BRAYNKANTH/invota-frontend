import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './RealLoginPage.css'; // Import custom styles for this page

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

    if (!usernameOrEmail || !password) {
      setError('Please fill in both fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        usernameOrEmail,
        password,
      });

      // If login is successful, check the response
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        navigate('/update-basic-details');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center min-vh-100 bg-glass">
      <div className="card shadow-lg p-4 rounded">
        <h2 className="text-center mb-4 text-white">Login</h2>
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
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
};

export default RealLoginPage;
