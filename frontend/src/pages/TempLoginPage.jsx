import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';

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
    <div>
      <h2>Temporary Login</h2>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default TempLoginPage;
