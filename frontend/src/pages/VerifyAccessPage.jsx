import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const VerifyAccessPage = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();  // Get location object

  useEffect(() => {
    // Extract token from URL hash (after the `#` symbol)
    const hash = location.hash;
    const token = new URLSearchParams(hash.replace('#', '')).get('token');  // Extract token from hash

    if (!token) {
      setError('Token is missing in the URL');
      return;
    }

    // Now, send the token to the backend to verify it
    const verifyToken = async () => {
      try {
        const response = await axios.post(`https://invota-backend-production.up.railway.app/api/auth/verify-access/${token}`);
        
        if (response.status === 200) {
          setMessage('Access granted. Redirecting...');
          // You can redirect or show the sensitive details
        }
      } catch (err) {
        setError('Error verifying the token');
        console.error('Error verifying token:', err);
      }
    };

    verifyToken();  // Call the verifyToken function on mount

  }, [location.hash]);  // Re-run if hash changes

  return (
    <div>
      <h2>Verifying Access...</h2>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default VerifyAccessPage;
