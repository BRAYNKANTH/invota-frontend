import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  // Correctly import jwtDecode as a named import

const SensitiveDetailsPage = () => {
  const [allergies, setAllergies] = useState('');
  const [diseases, setDiseases] = useState('');
  const [medicalReports, setMedicalReports] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');  // Retrieve token from localStorage

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);  // Decode the token to check if it's expired
        console.log('Decoded Token:', decoded);
        const expirationTime = decoded.exp * 1000;  // Expiry time in milliseconds
        const currentTime = Date.now();

        if (currentTime > expirationTime) {
          console.log('Token has expired.');
          localStorage.removeItem('authToken');  // Remove expired token
          navigate('/login');  // Redirect user to login
        }
      } catch (error) {
        console.log('Error decoding token:', error);
        localStorage.removeItem('authToken');  // Remove invalid token
        navigate('/login');  // Redirect user to login
      }
    } else {
      navigate('/request-emergency-access');  // Redirect to request access if no token is found
    }
  }, [token, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!token) {
      console.log('No token found');
      navigate('/request-emergency-access');  // Redirect to request access if no token is available
      return;
    }

    try {
      const response = await axios.put(
        'http://localhost:5000/api/update-sensitive-details', 
        {
          allergies,
          diseases,
          medicalReports,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Pass the token in the Authorization header
          }
        }
      );

      console.log('Update successful:', response.data);
      navigate('/view-basic-details');  // Navigate to the profile or another page
    } catch (error) {
      console.error('Error updating sensitive details:', error.response?.data || error);
      alert('Failed to update sensitive details');
    }
  };

  return (
    <div>
      <h2>Update Sensitive Details</h2>
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
