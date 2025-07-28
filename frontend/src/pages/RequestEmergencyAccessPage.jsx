import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';  // To get the userId from location state
import axios from 'axios';

const RequestEmergencyAccessPage = () => {
  const [accessStatus, setAccessStatus] = useState('');
  const [error, setError] = useState('');
  const { userId } = useLocation().state;  // Retrieve userId passed through navigate

  // Handle the request for emergency access
  const handleRequest = async (e) => {
    e.preventDefault();

    // Check if userId is missing
    if (!userId) {
      setError('User ID is missing');
      return;
    }

    // Log the userId to make sure it's correct
    console.log('Sending request with userId:', userId);  // Debug log

    try {
      // Send the POST request with userId
      const response = await axios.post('https://invota-backend-production.up.railway.app/api/auth/request-emergency-access', { userId });

      if (response.status === 200) {
        // On success, show the success message
        setAccessStatus('Access request sent to the emergency contact. They will receive a link to verify access.');
      }
    } catch (error) {
      // Log error and show a message to the user
      console.error('Error while requesting emergency access:', error);
      setError(error.response?.data?.message || 'Failed to request emergency access');
    }
  };

  return (
    <div>
      <h2>Request Emergency Access</h2>

      {/* Display error if any */}
      {error && <p className="text-danger">{error}</p>}

      {/* Display success message if access is requested */}
      {accessStatus && <p className="text-success">{accessStatus}</p>}

      {/* Button to request emergency access */}
      <form onSubmit={handleRequest}>
        <button type="submit" className="btn btn-primary">Request Access</button>
      </form>
    </div>
  );
};

export default RequestEmergencyAccessPage;
