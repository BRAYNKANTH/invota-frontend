import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyAccessPage = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();  // Get location object from React Router
  const navigate = useNavigate();  // For redirecting after success

  useEffect(() => {
    console.log('VerifyAccessPage: useEffect triggered');  // Debug log for useEffect

    // Check the current URL and log it
    console.log('VerifyAccessPage: Current URL:', window.location.href);  // Full URL with hash

    // Extract token from the URL hash fragment (after the `#`)
    const hashToken = location.hash.split('/')[2];  // Extract the token from the hash fragment
    console.log('VerifyAccessPage: location.hash:', location.hash);  // Log the entire location.hash
    console.log('VerifyAccessPage: Extracted token from URL hash:', hashToken);  // Log token

    if (!hashToken) {
      setError('Token is missing in the URL');
      console.log('VerifyAccessPage: No token found in hash');  // Log the error
      return;
    }

    // Proceed to verify token if it's available
    const verifyToken = async () => {
      console.log('VerifyAccessPage: Sending token to the backend for verification...');

      try {
        const response = await axios.post(
          `https://invota-backend-production.up.railway.app/api/auth/verify-access/${hashToken}`
        );

        console.log('VerifyAccessPage: Axios request sent');  // Log that the request was sent

        // Log the response data
        console.log('VerifyAccessPage: Response from backend:', response);  // Log the complete response

        if (response.status === 200) {
          setMessage('Access granted. Redirecting...');
          setTimeout(() => {
            console.log('VerifyAccessPage: Redirecting to /view-sensitive-details');
            navigate('/view-sensitive-details');
          }, 2000);
        } else {
          console.log('VerifyAccessPage: Unexpected response status:', response.status);
          setError('Unexpected response status: ' + response.status);
        }
      } catch (err) {
        setError('Error verifying the token');
        console.error('VerifyAccessPage: Error while verifying token:', err);  // Log the error object
        console.log('VerifyAccessPage: Error message:', err.message);  // Log the error message
        console.log('VerifyAccessPage: Error stack:', err.stack);  // Log the error stack trace
      }
    };

    console.log('VerifyAccessPage: Token received, calling verifyToken...');
    verifyToken();
  }, [location.hash, navigate]);

  return (
    <div>
      <h2>Verifying Access...</h2>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default VerifyAccessPage;
