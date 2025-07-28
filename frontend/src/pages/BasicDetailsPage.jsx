import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  // Correct named import
import './BasicDetailsPage.css';  // Custom CSS for this page

const BasicDetailsPage = () => {
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [photo, setPhoto] = useState('');
  const [emergencyContactEmail, setEmergencyContactEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');  // Retrieve token from localStorage

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);  // Decode the token
      console.log('Decoded token:', decoded); // Log the decoded token (optional for debugging)

      // Ensure the user is logged in and the token is not expired
      const currentTime = Date.now() / 1000; // Current time in seconds
      if (decoded.exp < currentTime) {
        localStorage.removeItem('authToken');
        navigate('/login');  // Redirect to login if token is expired
      }
    } else {
      navigate('/login');  // Redirect to login if no token is found
    }
  }, [token, navigate]);

 const handleUpdate = async (e) => {
  e.preventDefault();

  // Ensure that all fields are filled before proceeding
  if (!fullName || !address || !phoneNumber || !bloodGroup || !photo || !emergencyContactEmail) {
    setError('All fields are required.');
    return;
  }

  try {
    // Sending the updated details, including emergencyContactEmail, to the backend
    const response = await axios.put(
      'https://invota-backend-production.up.railway.app/api/auth/update-basic-details',
      {
        fullName,
        address,
        phoneNumber,
        bloodGroup,
        photo,
        emergencyContactEmail,  // Send emergency contact email
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,  // Send token for authentication
        },
      }
    );

    console.log('Update successful:', response.data);
    navigate('/update-sensitive-details');  // Redirect after successful update
  } catch (error) {
    console.error('Error updating public details:', error.response?.data || error);
    alert('Failed to update details');
  }
};


  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-glass">
      <div className="card shadow-lg p-4 rounded">
        <h2 className="text-center text-white mb-4">Update Basic Details</h2>
        {error && <p className="error-message text-center text-danger">{error}</p>}
        <form onSubmit={handleUpdate}>
          <div className="form-group mb-3">
            <label htmlFor="fullName" className="text-white">Full Name:</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="form-control"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="address" className="text-white">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="phoneNumber" className="text-white">Phone Number:</label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              className="form-control"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="bloodGroup" className="text-white">Blood Group:</label>
            <input
              type="text"
              id="bloodGroup"
              name="bloodGroup"
              className="form-control"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="photo" className="text-white">Photo URL:</label>
            <input
              type="text"
              id="photo"
              name="photo"
              className="form-control"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="emergencyContactEmail" className="text-white">Emergency Contact Email:</label>
            <input
              type="email"
              id="emergencyContactEmail"
              name="emergencyContactEmail"
              className="form-control"
              value={emergencyContactEmail}
              onChange={(e) => setEmergencyContactEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Update Basic Details</button>
        </form>
      </div>
    </div>
  );
};

export default BasicDetailsPage;
