import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './TempLoginPage.css'; // Import custom CSS

const TempLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Please fill in both fields');
      return;
    }

    try {
      // Make a POST request to the backend for temporary login
      const response = await axios.post(
        'https://invota-backend-production.up.railway.app/api/auth/temp-login', 
        { username, password }
      );

      if (response.status === 200 && response.data.token) {
        // Store the token in localStorage
        localStorage.setItem('token', response.data.token);
        navigate('/account-update'); // Redirect to account update page
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.error || 'Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="glassy-container">
        <h1>Temporary Login</h1>
        <form onSubmit={handleLogin}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className="input-field"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="input-field"
          />
          <button type="submit" className="btn-login">Login</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default TempLoginPage;
