import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const VerifyAccessPage = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();  // Get location object

  useEffect(() => {
    // Extract token from the URL query parameters
    const queryParams = new URLSearchParams(location.search);  // Get query parameters
    const token = queryParams.get('token');  // Get token from the query string

    if (!token) {
      setError('Token is missing in the URL');
      return;
    }

    console.log('Token extracted:', token);  // For debugging

    // Now, send the token to the backend to verify it
    const verifyToken = async () => {
      try {
        const response = await axios.post(
          `https://invota-backend-production.up.railway.app/api/auth/verify-access/${token}`
        );

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
  }, [location.search]);  // Re-run if location.search changes

  return (
    <div>
      <h2>Verifying Access...</h2>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default VerifyAccessPage;
