import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './ViewSensitiveDetailsPage.css';  // Custom CSS for this page

const ViewSensitiveDetailsPage = () => {
  const [allergies, setAllergies] = useState('');
  const [diseases, setDiseases] = useState('');
  const [medicalReports, setMedicalReports] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('authToken');  // Retrieve token from localStorage
  const userId = location.state?.userId;  // Access userId from previous page via location.state

  useEffect(() => {
    const fetchSensitiveDetails = async () => {
      console.log('Fetching sensitive details...');

      if (token) {
        // Token exists, logged-in user
        console.log('Token found. Validating...');
        try {
          const decoded = jwtDecode(token);  // Decode the token
          console.log('Decoded token:', decoded);

          const expirationTime = decoded.exp * 1000;
          const currentTime = Date.now();
          console.log('Current time:', currentTime, 'Expiration time:', expirationTime);

          if (currentTime > expirationTime) {
            console.log('Token has expired');
            localStorage.removeItem('authToken');
            navigate('/login');
            return;
          }

          console.log('Token is valid. Fetching sensitive details for logged-in user...');
          const response = await axios.get('https://invota-backend-production.up.railway.app/api/auth/get-sensitive-details', {
            headers: { Authorization: `Bearer ${token}` },
          });

          const { sensitiveDetails } = response.data;
          console.log('Fetched sensitive details for logged-in user:', sensitiveDetails);

          // Set the sensitive details values
          setAllergies(sensitiveDetails.allergies);
          setDiseases(sensitiveDetails.diseases);
          setMedicalReports(sensitiveDetails.medicalReports);
        } catch (error) {
          console.error('Error fetching sensitive details:', error);
          setError('Failed to fetch sensitive details.');
        }
      } else if (userId) {
        // External user (no token, but userId passed via location.state)
        console.log('Fetching sensitive details for external user with userId:', userId);

        try {
          const response = await axios.get(`https://invota-backend-production.up.railway.app/api/auth/get-sensitive-details?userId=${userId}`);
          console.log('Fetched sensitive details for external user:', response.data);

          if (response.data.error) {
            setError(response.data.error);
            navigate('/request-emergency-access', { state: { userId } });
          } else {
            const { sensitiveDetails } = response.data;
            console.log('Fetched sensitive details for external user:', sensitiveDetails);

            setAllergies(sensitiveDetails.allergies);
            setDiseases(sensitiveDetails.diseases);
            setMedicalReports(sensitiveDetails.medicalReports);
          }
        } catch (error) {
          console.error('Error fetching sensitive details for external user:', error);
          setError('Error fetching sensitive details.');
          navigate('/request-emergency-access');
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
        <h2 className="text-center text-white mb-4">Sensitive Details</h2>
        {error && <p className="text-danger">{error}</p>}
        <p><strong>Allergies:</strong> {allergies}</p>
        <p><strong>Diseases:</strong> {diseases}</p>
        <p><strong>Medical Reports:</strong> {medicalReports}</p>
      </div>
    </div>
  );
};

export default ViewSensitiveDetailsPage;
