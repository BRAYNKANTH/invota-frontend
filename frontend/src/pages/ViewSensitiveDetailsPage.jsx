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
  const token = localStorage.getItem('authToken');
  const userId = new URLSearchParams(window.location.search).get('userId');  // For external users

  useEffect(() => {
    const fetchSensitiveDetails = async () => {
      console.log('Fetching sensitive details...');

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

          const response = await axios.get('https://invota-backend-production.up.railway.app/api/auth/get-sensitive-details', {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('Fetched sensitive details for logged-in user:', response.data);
          setAllergies(response.data.sensitiveDetails.allergies);
          setDiseases(response.data.sensitiveDetails.diseases);
          setMedicalReports(response.data.sensitiveDetails.medicalReports);
        } catch (error) {
          console.error('Error fetching sensitive details:', error);
          setError('Failed to fetch sensitive details.');
        }
      } else if (userId) {
        // Handle external user
        try {
          const response = await axios.get(`https://invota-backend-production.up.railway.app/api/auth/get-sensitive-details?userId=${userId}`);
          if (response.data.error) {
            setError(response.data.error);
            navigate('/request-emergency-access', { state: { userId } });
          } else {
            const { emergencyContactApproved, sensitiveDetails } = response.data;
            if (emergencyContactApproved) {
              setAllergies(sensitiveDetails.allergies);
              setDiseases(sensitiveDetails.diseases);
              setMedicalReports(sensitiveDetails.medicalReports);
            } else {
              setError('Access not approved. Please request emergency access.');
              navigate('/request-emergency-access', { state: { userId } });
            }
          }
        } catch (error) {
          console.error('Error checking external user access:', error);
          setError('Error checking access status.');
        }
      } else {
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
