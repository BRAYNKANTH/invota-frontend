import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './SensitiveDetailsPage.css';  // Custom CSS for this page

const SensitiveDetailsPage = () => {
  const [allergies, setAllergies] = useState('');
  const [diseases, setDiseases] = useState('');
  const [medicalReports, setMedicalReports] = useState([]); // Array to hold the selected files
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
          setMedicalReports(response.data.sensitiveDetails.medicalReports); // Set the medical reports URLs
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
          setMedicalReports(sensitiveDetails.medicalReports);  // Set the medical reports URLs
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
  const handleMedicalReportsUpload = (e) => {
    const files = e.target.files;
    const fileArray = Array.from(files);
    setMedicalReports(fileArray);  // Store the selected files
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!token) {
      navigate('/request-emergency-access');
      return;
    }

    // Prepare FormData for sending medical reports and form fields together
    const formData = new FormData();
    formData.append('allergies', allergies);
    formData.append('diseases', diseases);

    // Append each selected medical report file to FormData
    medicalReports.forEach(file => {
      formData.append('medicalReports', file);
    });

    try {
      const response = await axios.put(
        'https://invota-backend-production.up.railway.app/api/auth/update-sensitive-details',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log('Update response:', response);  // Log the response to debug

      // Assuming the response contains the URLs of the uploaded medical reports
      setMedicalReports(response.data.medicalReports);  // Update the medicalReports with URLs

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
            <textarea
              id="allergies"
              name="allergies"
              className="form-control"
              rows="4"  // Define the number of rows for the textarea
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="diseases" className="text-white">Diseases:</label>
            <textarea
              id="diseases"
              name="diseases"
              className="form-control"
              rows="4"  // Define the number of rows for the textarea
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
                  {medicalReports.map((file, index) => (
                    <li key={index}>
                      {/* Render the clickable link for each medical report */}
                      <a 
                        href={`https://invota-backend-production.up.railway.app${file}`}  // Assuming `file` contains the relative path to the file
                        target="_blank" 
                        rel="noopener noreferrer">
                        Report {index + 1}
                      </a>
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
