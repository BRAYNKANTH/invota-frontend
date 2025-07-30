import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './SensitiveDetailsPage.css';  // Custom CSS for this page

const SensitiveDetailsPage = () => {
  const [allergies, setAllergies] = useState('');
  const [diseases, setDiseases] = useState('');
  const [medicalReports, setMedicalReports] = useState([]);
  const [error, setError] = useState('');  // For handling errors
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');  // Retrieve token from localStorage
  const userId = new URLSearchParams(window.location.search).get('userId');  // Get userId from query params for external users

  useEffect(() => {
    const fetchSensitiveDetails = async () => {
      console.log('Fetching sensitive details...');

      // If token exists (for logged-in users)
      if (token) {
        console.log('Token found. Validating...');

        try {
          // If token exists, validate it
          const decoded = jwtDecode(token);  // Decode the token to check if it's expired
          const expirationTime = decoded.exp * 1000;  // Expiry time in milliseconds
          const currentTime = Date.now();

          // If the token has expired, remove it and redirect to login
          if (currentTime > expirationTime) {
            localStorage.removeItem('authToken');
            navigate('/login');
            return;
          }

          console.log('Token is valid. Fetching sensitive details for logged-in user...');

          // Fetch sensitive details for logged-in users
          const response = await axios.get('https://invota-backend-production.up.railway.app/api/auth/get-sensitive-details', {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('Sensitive details response:', response);  // Log the response to debug
          setAllergies(response.data.sensitiveDetails.allergies);
          setDiseases(response.data.sensitiveDetails.diseases);
          setMedicalReports(response.data.sensitiveDetails.medicalReports);
        } catch (error) {
          setError('Failed to fetch sensitive details.');
          console.error('Error fetching sensitive details:', error);  // Log the error
        }
      } else if (userId) {
        // Handle external user (no token)
        const response = await axios.get(`https://invota-backend-production.up.railway.app/api/auth/get-sensitive-details?userId=${userId}`);
        console.log('Sensitive details response for external user:', response);  // Log the response to debug
        const { emergencyContactApproved, sensitiveDetails } = response.data;

        if (emergencyContactApproved) {
          setAllergies(sensitiveDetails.allergies);
          setDiseases(sensitiveDetails.diseases);
          setMedicalReports(sensitiveDetails.medicalReports);
        } else {
          setError('Access not approved. Please request emergency access.');
          navigate('/request-emergency-access', { state: { userId } });
        }
      } else {
        navigate('/request-emergency-access');
      }
    };

    fetchSensitiveDetails();
  }, [token, userId, navigate]);

  // Handle file upload for medical reports
  const handleMedicalReportsUpload = async (e) => {
    const files = e.target.files;
    const formData = new FormData();

    // Append each file to the form data
    Array.from(files).forEach(file => {
      formData.append('medicalReports', file);
    });

    try {
      const response = await axios.post(
        'https://invota-backend-production.up.railway.app/api/auth/upload-medical-reports',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Medical reports upload response:', response);  // Log the response to debug
      setMedicalReports(response.data.fileUrls); // Set returned file URLs
    } catch (error) {
      setError('Failed to upload medical reports.');
      console.error('Error uploading medical reports:', error);  // Log the error
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!token) {
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
      console.log('Update response:', response);  // Log the response to debug
      navigate('/view-basic-details');
    } catch (error) {
      setError('Failed to update sensitive details');
      console.error('Error updating sensitive details:', error);  // Log the error
    }
  };

  return (
    <div className="view-details-container">
      <div className="glassy-container">
        <h2 className="text-center text-white mb-4">Update Sensitive Details</h2>
        {error && <p className="error-message text-center text-danger">{error}</p>}
        <form onSubmit={handleUpdate}>
          <div className="form-group mb-3">
            <label htmlFor="allergies" className="text-white">Allergies:</label>
            <input
              type="text"
              id="allergies"
              name="allergies"
              className="form-control"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="diseases" className="text-white">Diseases:</label>
            <input
              type="text"
              id="diseases"
              name="diseases"
              className="form-control"
              value={diseases}
              onChange={(e) => setDiseases(e.target.value)}
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="medicalReports" className="text-white">Upload Medical Reports:</label>
            <input
              type="file"
              id="medicalReports"
              name="medicalReports"
              className="form-control"
              multiple
              onChange={handleMedicalReportsUpload}
            />
            {medicalReports.length > 0 && (
              <div className="mt-2">
                <h6>Uploaded Reports:</h6>
                <ul>
                  {medicalReports.map((url, index) => (
                    <li key={index}>
                      <a href={url} target="_blank" rel="noopener noreferrer">Report {index + 1}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100">Update Sensitive Details</button>
        </form>
      </div>
    </div>
  );
};

export default SensitiveDetailsPage;
