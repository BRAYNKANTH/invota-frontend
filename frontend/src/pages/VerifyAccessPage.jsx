// VerifyAccessPage.jsx (Frontend)
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const VerifyAccessPage = () => {
  const { token } = useParams();  // Get the token from the URL params
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/verify-access', { token }); // Make sure the URL is correct
        if (response.status === 200) {
          setMessage('Access granted. Redirecting...');
          setTimeout(() => navigate('/view-sensitive-details'), 2000);
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        setError(error.response?.data?.error || 'Verification failed.');
      }
    };

    verifyToken();
  }, [token, navigate]);

  return (
    <div>
      <h2>Verifying Access...</h2>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default VerifyAccessPage;
