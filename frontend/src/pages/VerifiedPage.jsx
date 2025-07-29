import React, { useEffect } from 'react';
import { useNavigate} from 'react-router-dom';

const VerifiedPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect user to login after a delay
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000); // Redirect after 3 seconds
    return () => clearTimeout(timer); // Clean up the timer
  }, [navigate]);

  return (
    <div>
      <h2>Email Verified Successfully</h2>
      <p>Your email has been successfully verified. You will be redirected to the login page shortly.</p>
      <p>If you are not redirected, pls click below:</p>
      <button onClick={() => navigate('/login')}>Go to Login</button>
    </div>
  );
};

export default VerifiedPage;

