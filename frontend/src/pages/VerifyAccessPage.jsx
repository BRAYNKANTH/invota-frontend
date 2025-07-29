// VerifyAccessPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VerifyAccessPage = () => {
  const { token } = useParams();  // Get the token from the URL parameter
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.post(`https://invota-backend-production.up.railway.app/api/auth/verify-access/${token}`);
        
        if (response.status === 200) {
          setMessage('Access granted. Redirecting...');
          // Redirect to the next page after some time
        }
      } catch (error) {
        setError('Failed to verify the token.');
        console.error('Error verifying token:', error);
      }
    };

    if (token) {
      verifyToken();  // Trigger token verification when component mounts
    }
  }, [token]);

  return (
    <div>
      <h2>Verifying Access...</h2>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default VerifyAccessPage;
