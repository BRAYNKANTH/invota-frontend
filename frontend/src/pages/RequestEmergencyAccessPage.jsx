import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RequestEmergencyAccessPage = () => {
  const [accessStatus, setAccessStatus] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {};

  // Log the userId received from the location
  useEffect(() => {
    console.log("Component mounted, userId from location:", userId);
  }, [userId]);

  // Function to handle emergency access request
  const handleRequest = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError('User ID is missing');
      console.log('Error: User ID is missing');
      return;
    }

    console.log('Sending request with userId:', userId); // Debug log

    try {
      const response = await axios.post('https://invota-backend-production.up.railway.app/api/auth/request-emergency-access', { userId });
      console.log('Response from request-emergency-access:', response); // Debug log

      if (response.status === 200) {
        setAccessStatus('Access request sent to the emergency contact. They will receive a link to verify access.');
        console.log('Access request sent successfully');
        setChecking(true); // Start checking for access approval
      }
    } catch (error) {
      console.error('Error while requesting emergency access:', error); // Log the error details
      setError(error.response?.data?.message || 'Failed to request emergency access');
    }
  };

  // Effect to periodically check if access is approved
  useEffect(() => {
    if (!checking || !userId) return;

    const interval = setInterval(async () => {
      try {
        console.log('Checking for access approval...'); // Debug log
        const response = await axios.post('https://invota-backend-production.up.railway.app/api/auth/check-access', { userId });
        console.log('Response from check-access:', response); // Debug log

        if (response.status === 200 && response.data.accessGranted) {
          clearInterval(interval);  // Stop checking once access is granted
          setAccessStatus('Access granted! Redirecting...');
          console.log('Access granted, redirecting to sensitive details...');
          setTimeout(() => navigate(`/view-sensitive-details/${userId}`), 2000);
        }
      } catch (err) {
        console.log("Access not granted yet or expired", err);  // Log error if access isn't granted yet
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
