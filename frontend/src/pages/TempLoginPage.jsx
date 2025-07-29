import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './TempLoginPage.css'; // Import custom CSS

const TempLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://invota-backend-production.up.railway.app/api/auth/temp-login', { username, password });
      localStorage.setItem('token', response.data.token); // Store JWT token in localStorage
      navigate('/account-update'); // Redirect to the account update page
    } catch (error) {
      console.error('Error during temp login:', error);
      alert('Invalid credentials');
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
      </div>
    </div>
  );
};

export default TempLoginPage;
