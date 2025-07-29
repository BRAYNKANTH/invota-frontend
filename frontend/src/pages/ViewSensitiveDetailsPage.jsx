import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewSensitiveDetailsPage = () => {
  const [sensitiveDetails, setSensitiveDetails] = useState(null);
  const [error, setError] = useState(null);  // For handling errors
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');  // Retrieve token from localStorage
  const userId = new URLSearchParams(window.location.search).get('userId');  // Get userId from URL query params (for external users)

  console.log('Token retrieved from localStorage in ViewSensitiveDetailsPage:', token);  // Debug log

  useEffect(() => {
    const fetchSensitiveDetails = async () => {
      if (!token && !userId) {
        setError('You are not authorized to view this page without login.');
        navigate('/login');
        return;
      }

      if (!token) {
        // If no token, external user, navigate to request access page
        setError('You need to request access to view sensitive details.');
        navigate('/request-emergency-access', { state: { userId } });
        return;
      }

      console.log('Fetching sensitive details for logged-in user');  // Debug log

      try {
        // For logged-in users, fetch sensitive details
        const response = await axios.get('https://invota-backend-production.up.railway.app/api/auth/get-sensitive-details', {
          headers: { Authorization: `Bearer ${token}` },  // Send token for authorized requests
        });
        setSensitiveDetails(response.data.sensitiveDetails);
      } catch (error) {
        console.error('Error fetching sensitive details:', error);
        setError('Failed to fetch sensitive details.');
      }
    };

    const checkExternalUserAccess = async () => {
      // If the user is external (no token), check their access approval status
      if (userId) {
        try {
          // Check if the external user exists and has access approved
          const response = await axios.get(`https://invota-backend-production.up.railway.app/api/auth/get-sensitive-details?userId=${userId}`);
          
          if (response.data.error) {
            // If the user doesn't exist or is not approved, navigate to the request page
            setError(response.data.error);
            navigate('/request-emergency-access', { state: { userId } });
          } else {
            // If the user is approved, display sensitive details
            const { emergencyContactApproved, sensitiveDetails } = response.data;

            if (emergencyContactApproved) {
              setSensitiveDetails(sensitiveDetails);
            } else {
              setError('Access not approved. Please request emergency access.');
              navigate('/request-emergency-access', { state: { userId } });
            }
          }
        } catch (error) {
          console.error('Error checking external user access:', error);
          setError('Error checking access status.');
        }
      }
    };

    if (userId) {
      checkExternalUserAccess();  // For external users, check if they're approved
    } else {
      fetchSensitiveDetails();  // For logged-in users, fetch sensitive details
    }
  }, [token, userId, navigate]);

  return (
    <div>
      <h2>Sensitive Details</h2>
      {error && <p className="text-danger">{error}</p>}
      {sensitiveDetails ? (
        <div>
          <p><strong>Allergies:</strong> {sensitiveDetails.allergies}</p>
          <p><strong>Diseases:</strong> {sensitiveDetails.diseases}</p>
          <p><strong>Medical Reports:</strong> {sensitiveDetails.medicalReports}</p>
        </div>
      ) : (
        <p>Loading sensitive details...</p>
      )}
    </div>
  );
};

export default ViewSensitiveDetailsPage;
