import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AccountUpdatePage.css'; // Import custom CSS

const AccountUpdatePage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');  // Retrieve token from localStorage

  // If no token, redirect to login page
  useEffect(() => {
    if (!token) {
      alert('You are not logged in. Please log in again.');
      navigate('/login');
    }
  }, [token, navigate]);

  // Handle form submission for account update
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!email && !username && !password) {
      setError('At least one field is required to update');
      return;
    }

    try {
      const response = await axios.put(
        'https://invota-backend-production.up.railway.app/api/auth/update-account', 
        { email, username, password },
        {
          headers: { Authorization: `Bearer ${token}` }  // Send token in headers for authentication
        }
      );

      if (response.status === 200) {
        alert('Account updated successfully');
        navigate('/login');  // Redirect to basic details page after success
      }
    } catch (error) {
      console.error('Error updating account:', error);
      setError(error.response?.data?.error || 'Failed to update account');
    }
  };

  return (
    <div className="login-container">
      <div className="glassy-container">
        <h2>Update Account</h2>
        <form onSubmit={handleUpdate}>
          <input 
            type="email" 
            placeholder="New Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="input-field"
          />
          <input 
            type="text" 
            placeholder="New Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className="input-field"
          />
          <input 
            type="password" 
            placeholder="New Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="input-field"
          />
          <button type="submit" className="btn-login">Update Account</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default AccountUpdatePage;
