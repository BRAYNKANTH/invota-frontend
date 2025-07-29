import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SensitiveDetailsPage.css';  // Custom CSS for this page

const SensitiveDetailsPage = () => {
  const [allergies, setAllergies] = useState('');
  const [diseases, setDiseases] = useState('');
  const [medicalReports, setMedicalReports] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!token) {
      console.log('No token found. Redirecting to request access...');
      navigate('/request-emergency-access');
      return;
    }

    try {
      console.log('Sending request to update sensitive details...');
      
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
    <div className="update-details-container">
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
            <label htmlFor="medicalReports" className="text-white">Medical Reports:</label>
            <input
              type="text"
              id="medicalReports"
              name="medicalReports"
              className="form-control"
              value={medicalReports}
              onChange={(e) => setMedicalReports(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Update Sensitive Details</button>
        </form>
      </div>
    </div>
  );
};

export default SensitiveDetailsPage;
