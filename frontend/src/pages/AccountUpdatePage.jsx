import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const AccountUpdatePage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put('https://invota-backend-production.up.railway.app/api/auth/update-account', { email, username, password }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/basic-details');
    } catch (error) {
      console.error('Error updating account:', error);
      alert('Failed to update account');
    }
  };

  return (
    <div>
      <h2>Update Account</h2>
      <form onSubmit={handleUpdate}>
        <input type="email" placeholder="New Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder="New Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Update Account</button>
      </form>
    </div>
  );
};

export default AccountUpdatePage;
