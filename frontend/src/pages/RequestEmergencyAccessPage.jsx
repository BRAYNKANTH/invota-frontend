import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RequestEmergencyAccessPage = () => {
  const [accessStatus, setAccessStatus] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();

  // Get userId from location.state
  const location = useLocation();
  const { userId } = location.state || {};

  // Function to handle emergency access request
  const handleRequest = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError('User ID is missing');
      return;
    }

    console.log('Sending request with userId:', userId); // Debug log

    try {
      const response = await axios.post('https://invota-backend-production.up.railway.app/api/auth/request-emergency-access', {
        userId,
      });

      if (response.status === 200) {
        setAccessStatus('Access request sent to the emergency contact. They will receive a link to verify access.');
        setChecking(true); // Start checking for access approval
      }
    } catch (error) {
      console.error('Error while requesting emergency access:', error);
      setError(error.response?.data?.message || 'Failed to request emergency access');
    }
  };

  // Effect to periodically check if access is approved
  useEffect(() => {
    if (!checking || !userId) return;

    const interval = setInterval(async () => {
      try {
        const response = await axios.post('https://invota-backend-production.up.railway.app/api/auth/check-access', {
          userId,
        });

        if (response.status === 200 && response.data.accessGranted) {
          clearInterval(interval);
          setAccessStatus('Access granted! Redirecting...');
          setTimeout(() => navigate(`/view-sensitive-details/${userId}`), 2000);
        }
      } catch (err) {
        console.log("Access not granted yet or expired");
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [checking, userId, navigate]);

  return (
    <div>
      <h2>Request Emergency Access</h2>

      {error && <p className="text-danger">{error}</p>}
      {accessStatus && <p className="text-success">{accessStatus}</p>}

      <form onSubmit={handleRequest}>
        <button type="submit" className="btn btn-primary">Request Access</button>
      </form>
    </div>
  );
};

export default RequestEmergencyAccessPage;
