
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './ViewSensitiveDetailsPage.css';  // Custom CSS for this page

const ViewSensitiveDetailsPage = () => {
  const [allergies, setAllergies] = useState('');
  const [diseases, setDiseases] = useState('');
  const [medicalReports, setMedicalReports] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');  // Token from localStorage
  const userId = new URLSearchParams(window.location.search).get('userId');  // For external users

  useEffect(() => {
    const fetchSensitiveDetails = async () => {
      console.log('Fetching sensitive details...');

      // If the user is logged in (token exists)
      if (token) {
        console.log('Token found. Validating...');
        try {
          const decoded = jwtDecode(token);  // Decode token to check expiration
          const expirationTime = decoded.exp * 1000;
          const currentTime = Date.now();

          // Token expiration check
          if (currentTime > expirationTime) {
            console.log('Token has expired.');
            localStorage.removeItem('authToken');
            navigate('/login');
            return;
          }

          // Fetch sensitive details for logged-in user
          const response = await axios.get('https://invota-backend-production.up.railway.app/api/auth/get-sensitive-details', {
            headers: { Authorization: `Bearer ${token}` },
          });

          console.log('Fetched sensitive details for logged-in user:', response.data);
          const { sensitiveDetails, emergencyContactApproved } = response.data;

          // Check if emergency contact is approved
          if (emergencyContactApproved) {
            setAllergies(sensitiveDetails.allergies);
            setDiseases(sensitiveDetails.diseases);
            setMedicalReports(sensitiveDetails.medicalReports);
          } else {
            setError('Emergency contact not approved. Please request access.');
            navigate('/request-emergency-access');  // Redirect to the request access page
          }
        } catch (error) {
          console.error('Error fetching sensitive details:', error);
          setError('Failed to fetch sensitive details.');
          navigate('/landing');  // Redirect to the landing page on error
        }
      } 
      // Handle external user (no token, but userId is provided)
      else if (userId) {
        console.log('No token found. Checking for external user with userId:', userId);

        try {
          const response = await axios.get(`https://invota-backend-production.up.railway.app/api/auth/get-sensitive-details?userId=${userId}`);
          console.log('External user response:', response.data);

          if (response.data.error) {
            setError(response.data.error);
            navigate('/request-emergency-access', { state: { userId } });
          } else {
            const { emergencyContactApproved, sensitiveDetails } = response.data;

            // If emergency contact is approved, show sensitive details
            if (emergencyContactApproved) {
              setAllergies(sensitiveDetails.allergies);
              setDiseases(sensitiveDetails.diseases);
              setMedicalReports(sensitiveDetails.medicalReports);
            } else {
              setError('Emergency contact not approved. Please request access.');
              navigate('/request-emergency-access', { state: { userId } });  // Redirect to request access page
            }
          }
        } catch (error) {
          console.error('Error checking external user access:', error);
          setError('Error checking access status.');
          navigate('/request-emergency-access');  // Redirect if any error occurs
        }
      } else {
        // If no token or userId, redirect to request access page
        navigate('/request-emergency-access');
      }
    };

    fetchSensitiveDetails();
  }, [token, userId, navigate]);

  return (
    <div className="view-details-container">
      <div className="glassy-container">
        <h2 className="text-center text-white mb-4">View Sensitive Details</h2>
        {error && <p className="error-message text-center text-danger">{error}</p>}
        <p><strong>Allergies:</strong> {allergies}</p>
        <p><strong>Diseases:</strong> {diseases}</p>
        <p><strong>Medical Reports:</strong> {medicalReports}</p>
      </div>
    </div>
  );
};

export default ViewSensitiveDetailsPage;
