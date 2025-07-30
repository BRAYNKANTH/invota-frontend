import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './SensitiveDetailsPage.css';  // Custom CSS for this page

const SensitiveDetailsPage = () => {
  const [allergies, setAllergies] = useState('');
  const [diseases, setDiseases] = useState('');
  const [medicalReports, setMedicalReports] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();  // Access location state
  const token = localStorage.getItem('authToken');  // Retrieve token from localStorage
  const userId = location.state?.userId;  // Get userId passed from previous page via location.state

  useEffect(() => {
    const fetchSensitiveDetails = async () => {
      console.log('Fetching sensitive details...');

      if (token) {
        // Token exists, logged-in user
        console.log('Token found. Validating...');
        try {
          const decoded = jwtDecode(token);
          console.log('Decoded token:', decoded);  // Log the decoded token
          
          const expirationTime = decoded.exp * 1000;  // Expiry time in milliseconds
          const currentTime = Date.now();
          console.log('Current time:', currentTime, 'Expiration time:', expirationTime);  // Log both current time and token expiration time

          if (currentTime > expirationTime) {
            // If the token is expired, log out and redirect to login
            console.log('Token has expired');
            localStorage.removeItem('authToken');
            navigate('/login');
            return;
          }

          console.log('Token is valid. Fetching sensitive details for logged-in user...');

          // Fetch details for logged-in user
          const response = await axios.get('https://invota-backend-production.up.railway.app/api/auth/get-sensitive-details', {
            headers: { Authorization: `Bearer ${token}` },
          });

          console.log('Fetched sensitive details for logged-in user:', response.data);  // Log the response

          const { sensitiveDetails, emergencyContactApproved } = response.data;
          console.log('Emergency contact approved:', emergencyContactApproved);  // Log if emergency contact is approved

          // If emergency contact is approved, show the details
          if (emergencyContactApproved) {
            setAllergies(sensitiveDetails.allergies);
            setDiseases(sensitiveDetails.diseases);
            setMedicalReports(sensitiveDetails.medicalReports);
          } else {
            setError('Emergency contact not approved. Please request access.');
            navigate('/request-emergency-access'); // Redirect to request access page
            console.log('Emergency contact not approved, redirecting to request access');
          }
        } catch (error) {
          console.error('Error fetching sensitive details:', error);
          setError('Failed to fetch sensitive details.');
        }
      } else if (userId) {
        // External user (no token, but userId passed via location.state)
        console.log('Fetching sensitive details for external user with userId:', userId);

        try {
          const response = await axios.get(`https://invota-backend-production.up.railway.app/api/auth/get-sensitive-details?userId=${userId}`);

          console.log('Fetched sensitive details for external user:', response.data);  // Log the response

          if (response.data.error) {
            setError(response.data.error);
            navigate('/request-emergency-access', { state: { userId } }); // Redirect to request access
            console.log('Error fetching external user details:', response.data.error);
          } else {
            const { sensitiveDetails, emergencyContactApproved } = response.data;
            console.log('Emergency contact approved:', emergencyContactApproved);  // Log if emergency contact is approved

            // If emergency contact is approved, show the sensitive details
            if (emergencyContactApproved) {
              setAllergies(sensitiveDetails.allergies);
              setDiseases(sensitiveDetails.diseases);
              setMedicalReports(sensitiveDetails.medicalReports);
            } else {
              setError('Emergency contact not approved. Please request access.');
              navigate('/request-emergency-access', { state: { userId } }); // Redirect to request access
              console.log('Emergency contact not approved for external user, redirecting to request access');
            }
          }
        } catch (error) {
          console.error('Error fetching sensitive details for external user:', error);
          setError('Error fetching sensitive details.');
          navigate('/request-emergency-access'); // Redirect if error occurs
          console.log('Error occurred while fetching external user sensitive details, redirecting to request access');
        }
      } else {
        // If no token or userId found, redirect to request access page
        console.log('No token or userId found, redirecting to request access');
        navigate('/request-emergency-access');
      }
    };

    fetchSensitiveDetails();
  }, [token, userId, navigate]);

  return (
    <div className="view-details-container">
      <div className="glassy-container">
        <h2 className="text-center text-white mb-4">Sensitive Details</h2>
        {error && <p className="text-danger">{error}</p>}
        <p><strong>Allergies:</strong> {allergies}</p>
        <p><strong>Diseases:</strong> {diseases}</p>
        <p><strong>Medical Reports:</strong> {medicalReports}</p>
      </div>
    </div>
  );
};

export default SensitiveDetailsPage;
