import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './RequestEmergencyAccessPage.css';  // Custom CSS for this page

const RequestEmergencyAccessPage = () => {
  const [accessStatus, setAccessStatus] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Ensure the userId is correctly passed from the previous page
  const userId = location.state?.userId;
  console.log('Received userId:', userId);  // Debug log for userId

  useEffect(() => {
    if (!userId) {
      setError('User ID is missing');
      console.log('Error: User ID is missing');
      navigate('/landing');  // Redirect to landing page if no userId
    } else {
      console.log('Component mounted, userId from location:', userId);  // Debug log for userId
    }
  }, [userId, navigate]);

  const handleRequest = async (e) => {
    e.preventDefault();

    // Ensure userId is available before sending the request
    if (!userId) {
      setError('User ID is missing');
      console.log('Error: User ID is missing');
      return;
    }

    console.log('Sending request with userId:', userId);  // Debug log for sending request with userId

    try {
      const response = await axios.post('https://invota-backend-production.up.railway.app/api/auth/request-emergency-access', { userId });
      console.log('Response from request-emergency-access:', response);  // Log the response

      if (response.status === 200) {
        setAccessStatus('Access request sent to the emergency contact. They will receive a link to verify access.');
        console.log('Access request sent successfully');
        setChecking(true);
      }
    } catch (error) {
      console.error('Error while requesting emergency access:', error);  // Log error if request fails
      setError(error.response?.data?.message || 'Failed to request emergency access');
    }
  };

  useEffect(() => {
    if (!checking || !userId) return;

    const interval = setInterval(async () => {
      try {
        console.log('Checking for access approval...');
        const response = await axios.post('https://invota-backend-production.up.railway.app/api/auth/check-access', { userId });
        console.log('Response from check-access:', response);  // Log the response

        if (response.status === 200 && response.data.accessGranted) {
          clearInterval(interval);
          setAccessStatus('Access granted! Redirecting...');
          console.log('Access granted, redirecting to sensitive details...');
          // Pass userId in state to ensure it's available in the next page
          setTimeout(() => navigate(`/view-sensitive-details`, { state: { userId } }), 2000);  // Redirect to sensitive details page with userId in state
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
