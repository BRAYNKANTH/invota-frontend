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
  const [emergencyContactEmail, setEmergencyContactEmail] = useState('');
  const [emergencyContactNumber, setEmergencyContactNumber] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);  // Loading state
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');  // Retrieve token from localStorage

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);  // Decode the token

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
    if (!fullName || !address || !phoneNumber || !bloodGroup || !emergencyContactEmail || !emergencyContactNumber || !age || !gender) {
      setError('All fields are required.');
      return;
    }

    // Basic validation for emergency contact email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emergencyContactEmail)) {
      setError('Please enter a valid emergency contact email.');
      return;
    }

    setIsLoading(true);  // Start loading state

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('address', address);
    formData.append('phoneNumber', phoneNumber);
    formData.append('bloodGroup', bloodGroup);
    formData.append('emergencyContactEmail', emergencyContactEmail);
    formData.append('emergencyContactNumber', emergencyContactNumber); // Added emergency contact number
    formData.append('age', age); // Added age
    formData.append('gender', gender); // Added gender

    try {
      // Sending the updated details, including new fields, to the backend
      const response = await axios.put(
        'https://invota-backend-production.up.railway.app/api/auth/update-basic-details',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',  // Important for file uploads
            Authorization: `Bearer ${token}`,  // Send token for authentication
          },
        }
      );

      setIsLoading(false);  // End loading state

      console.log('Update successful:', response.data);
      navigate('/update-sensitive-details');  // Redirect after successful update
    } catch (error) {
      setIsLoading(false);  // End loading state
      console.error('Error updating public details:', error.response?.data || error);
      setError(error.response?.data?.error || 'Failed to update details');
    }
  };

  return (
    <div className="login-container">
      <div className="glassy-container">
        <h2 className="text-center text-white mb-4">Update Basic Details</h2>
        {error && <p className="error-message text-center text-danger">{error}</p>}

        {/* Show loading spinner if in loading state */}
        {isLoading && <div className="text-center">Loading...</div>}

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

          <div className="form-group mb-3">
            <label htmlFor="emergencyContactNumber" className="text-white">Emergency Contact Number:</label>
            <input
              type="text"
              id="emergencyContactNumber"
              name="emergencyContactNumber"
              className="form-control"
              value={emergencyContactNumber}
              onChange={(e) => setEmergencyContactNumber(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="age" className="text-white">Age:</label>
            <input
              type="number"
              id="age"
              name="age"
              className="form-control"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="gender" className="text-white">Gender:</label>
            <select
              id="gender"
              name="gender"
              className="form-control"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Basic Details'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BasicDetailsPage;
