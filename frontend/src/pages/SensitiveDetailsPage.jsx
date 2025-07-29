import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwtDecode from 'jwt-decode';  // Correct import for jwt-decode

const SensitiveDetailsPage = () => {
  const [allergies, setAllergies] = useState('');
  const [diseases, setDiseases] = useState('');
  const [medicalReports, setMedicalReports] = useState('');
  const [error, setError] = useState('');  // For handling errors
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');  // Retrieve token from localStorage
  const userId = new URLSearchParams(window.location.search).get('userId');  // Get userId from URL query params (for external users)

  useEffect(() => {
    const fetchSensitiveDetails = async () => {
      // If token exists (user is logged in)
      if (token) {
        try {
          const decoded = jwtDecode(token);  // Decode the token to check if it's expired
          const expirationTime = decoded.exp * 1000;  // Expiry time in milliseconds
          const currentTime = Date.now();

          if (currentTime > expirationTime) {
            console.log('Token has expired.');
            localStorage.removeItem('authToken');  // Remove expired token
            navigate('/login');  // Redirect user to login
            return;
          }

          // If token is valid, fetch sensitive details
          const response = await axios.get('https://invota-backend-production.up.railway.app/api/auth/get-sensitive-details', {
            headers: { Authorization: `Bearer ${token}` },  // Send token for authorized requests
          });

          setAllergies(response.data.sensitiveDetails.allergies);
          setDiseases(response.data.sensitiveDetails.diseases);
          setMedicalReports(response.data.sensitiveDetails.medicalReports);
        } catch (error) {
          console.error('Error fetching sensitive details:', error);
          setError('Failed to fetch sensitive details.');
        }
      } 
      // If there's no token (external user with userId)
      else if (userId) {
        try {
          // Fetch the external user's sensitive details and check if emergencyContactApproved is true
          const response = await axios.get(`https://invota-backend-production.up.railway.app/api/auth/get-sensitive-details?userId=${userId}`);

          if (response.data.error) {
            setError(response.data.error);
            navigate('/request-emergency-access', { state: { userId } });  // Redirect to request access page
          } else {
            const { emergencyContactApproved, sensitiveDetails } = response.data;

            if (emergencyContactApproved) {
              // Allow access even if no token is present, as the emergency contact is approved
              setAllergies(sensitiveDetails.allergies);
              setDiseases(sensitiveDetails.diseases);
              setMedicalReports(sensitiveDetails.medicalReports);
            } else {
              // Redirect to request access if not approved
              setError('Access not approved. Please request emergency access.');
              navigate('/request-emergency-access', { state: { userId } });
            }
          }
        } catch (error) {
          console.error('Error checking external user access:', error);
          setError('Error checking access status.');
        }
      } else {
        // If no token or userId, redirect to request access page
        navigate('/request-emergency-access');
      }
    };

    fetchSensitiveDetails();
  }, [token, userId, navigate]);

  return (
    <div>
      <h2>Sensitive Details</h2>
      {error && <p className="text-danger">{error}</p>}
      {allergies && diseases && medicalReports ? (
        <div>
          <p><strong>Allergies:</strong> {allergies}</p>
          <p><strong>Diseases:</strong> {diseases}</p>
          <p><strong>Medical Reports:</strong> {medicalReports}</p>
        </div>
      ) : (
        <p>Loading sensitive details...</p>
      )}
    </div>
  );
};

export default SensitiveDetailsPage;
