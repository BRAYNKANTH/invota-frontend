import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RequestEmergencyAccessPage.css';  // Custom CSS for this page

const RequestEmergencyAccessPage = () => {
  const [accessStatus, setAccessStatus] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {};

  useEffect(() => {
    console.log("Component mounted, userId from location:", userId);
  }, [userId]);

  const handleRequest = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError('User ID is missing');
      console.log('Error: User ID is missing');
      return;
    }

    console.log('Sending request with userId:', userId); 

    try {
      const response = await axios.post('https://invota-backend-production.up.railway.app/api/auth/request-emergency-access', { userId });
      console.log('Response from request-emergency-access:', response); 

      if (response.status === 200) {
        setAccessStatus('Access request sent to the emergency contact. They will receive a link to verify access.');
        console.log('Access request sent successfully');
        setChecking(true); 
      }
    } catch (error) {
      console.error('Error while requesting emergency access:', error);
      setError(error.response?.data?.message || 'Failed to request emergency access');
    }
  };

  useEffect(() => {
    if (!checking || !userId) return;

    const interval = setInterval(async () => {
      try {
        console.log('Checking for access approval...');
        const response = await axios.post('https://invota-backend-production.up.railway.app/api/auth/check-access', { userId });
        console.log('Response from check-access:', response);

        if (response.status === 200 && response.data.accessGranted) {
          clearInterval(interval); 
          setAccessStatus('Access granted! Redirecting...');
          console.log('Access granted, redirecting to sensitive details...');
          setTimeout(() => navigate(`/view-sensitive-details/${userId}`), 2000);
        }
      } catch (err) {
        console.log("Access not granted yet or expired", err);
      }
    }, 5000); 

    return () => clearInterval(interval);
  }, [checking, userId, navigate]);

  return (
    <div className="access-container">
      <div className="glassy-container">
        <h2 className="text-center text-white mb-4">Request Emergency Access</h2>

        {error && <p className="text-danger">{error}</p>}
        {accessStatus && <p className="text-success">{accessStatus}</p>}

        <form onSubmit={handleRequest}>
          <button type="submit" className="btn btn-primary w-100">Request Access</button>
        </form>
      </div>
    </div>
  );
};

export default RequestEmergencyAccessPage;
