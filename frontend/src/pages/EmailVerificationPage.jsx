import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EmailVerificationPage = () => {
  const { token } = useParams();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/verify-email/${token}`);
        setMessage(response.data.message); // Message from backend (successful verification)
      } catch (error) {
        setMessage('Verification failed or token expired');
      }
    };

    verifyEmail();
  }, [token]);

  const handleLoginRedirect = () => {
    navigate('/login'); // Redirect to login page after verification
  };

  return (
    <div>
      <h2>Email Verification</h2>
      <p>{message}</p>
      <button onClick={handleLoginRedirect}>Go to Login</button>
    </div>
  );
};

export default EmailVerificationPage;
