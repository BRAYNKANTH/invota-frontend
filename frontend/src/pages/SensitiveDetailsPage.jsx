import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  // Correctly import jwtDecode as a named import

const SensitiveDetailsPage = () => {
  const [allergies, setAllergies] = useState('');
  const [diseases, setDiseases] = useState('');
  const [medicalReports, setMedicalReports] = useState('');
  const [error, setError] = useState('');  // Added state to handle errors
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');  // Retrieve token from localStorage
  const userId = new URLSearchParams(window.location.search).get('userId');  // Get userId from query params for external users

  useEffect(() => {
    const fetchSensitiveDetails = async () => {
      if (token) {
        try {
          const decoded = jwtDecode(token);  // Decode the token to check if it's expired
          const expirationTime = decoded.exp * 1000;  // Expiry time in milliseconds
          const currentTime = Date.now();

          // If the token has expired, remove it and redirect to login
          if (currentTime > expirationTime) {
            console.log('Token has expired.');
            localStorage.removeItem('authToken');
            navigate('/login');
            return;
          }

          // Fetch sensitive details for logged-in users
          const response = await axios.get('https://invota-backend-production.up.railway.app/api/auth/get-sensitive-details', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAllergies(response.data.sensitiveDetails.allergies);
          setDiseases(response.data.sensitiveDetails.diseases);
          setMedicalReports(response.data.sensitiveDetails.medicalReports);
        } catch (error) {
          console.error('Error fetching sensitive details:', error);
          setError('Failed to fetch sensitive details.');
        }
      } else if (userId) {
        // For external users (no token), check emergencyContactApproval
        try {
          const response = await axios.get(`https://invota-backend-production.up.railway.app/api/auth/get-sensitive-details?userId=${userId}`);

          if (response.data.error) {
            setError(response.data.error);
            navigate('/request-emergency-access', { state: { userId } });
          } else {
            const { emergencyContactApproved, sensitiveDetails } = response.data;

            if (emergencyContactApproved) {
              // If emergency contact approved, show sensitive details even without token
              setAllergies(sensitiveDetails.allergies);
              setDiseases(sensitiveDetails.diseases);
              setMedicalReports(sensitiveDetails.medicalReports);
            } else {
              // If not approved, redirect to the request access page
              setError('Access not approved. Please request emergency access.');
              navigate('/request-emergency-access', { state: { userId } });
            }
          }
        } catch (error) {
          console.error('Error checking external user access:', error);
          setError('Error checking access status.');
        }
      } else {
        navigate('/request-emergency-access');  // If neither token nor userId is found, redirect to request access page
      }
    };

    fetchSensitiveDetails();
  }, [token, userId, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!token) {
      console.log('No token found');
      navigate('/request-emergency-access');
      return;
    }

    try {
      const response = await axios.put(
        'https://invota-backend-production.up.railway.app/api/auth/update-sensitive-details',
        {
          allergies,
          diseases,
          medicalReports,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('Update successful:', response.data);
      navigate('/view-basic-details');
    } catch (error) {
      console.error('Error updating sensitive details:', error.response?.data || error);
      alert('Failed to update sensitive details');
    }
  };

  return (
    <div>
      <h2>Update Sensitive Details</h2>
      {error && <p className="text-danger">{error}</p>}  {/* Display error message if any */}
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder="Allergies"
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
        />
        <input
          type="text"
          placeholder="Diseases"
          value={diseases}
          onChange={(e) => setDiseases(e.target.value)}
        />
        <input
          type="text"
          placeholder="Medical Reports"
          value={medicalReports}
          onChange={(e) => setMedicalReports(e.target.value)}
        />
        <button type="submit">Update Sensitive Details</button>
      </form>
    </div>
  );
};

export default SensitiveDetailsPage;
