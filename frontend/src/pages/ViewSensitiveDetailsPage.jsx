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
        const response = await axios.get('http://localhost:5000/api/get-sensitive-details', {
          headers: { Authorization: `Bearer ${token}` },  // Send token for authorized requests
        });
        setSensitiveDetails(response.data);
      } catch (error) {
        console.error('Error fetching sensitive details:', error);
        setError('Failed to fetch sensitive details.');
      }
    };

    fetchSensitiveDetails();
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
