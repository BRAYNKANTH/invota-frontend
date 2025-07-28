import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const ViewBasicDetailsPage = () => {
  const [publicDetails, setPublicDetails] = useState(null);
  const { userId } = useParams();  // Get userId from the URL params (for external users)
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');  // Get token from localStorage

  // Debug log to see if token is available
  console.log('Token retrieved from localStorage:', token);

  const fetchPublicDetails = useCallback(async (userId) => {
    console.log('Fetching public details for userId:', userId); // Debug log for API request
    try {
      const response = await axios.get(`http://localhost:5000/api/get-public-details/${userId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},  // Send token if available
      });
      setPublicDetails(response.data.publicDetails);
    } catch (error) {
      console.error('Error fetching public details:', error.response?.data || error);
      navigate('/landing');  // Redirect to landing if error occurs
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!token) {
      // If no token, external user, fetch public details based on userId in URL
      if (userId) {
        console.log('No token, fetching details for external user');  // Debug log
        fetchPublicDetails(userId);  // For external users, use userId from URL
      } else {
        console.log('No token and no userId, redirecting to landing');  // Debug log
        navigate('/landing');  // Redirect to landing page if no userId is present
      }
      return;
    }

    // For logged-in users, decode token and fetch their details
    const decoded = jwtDecode(token);
    console.log('Decoded token:', decoded);  // Debug log for token decoding

    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      // If token expired, log out and redirect to login
      console.log('Token expired, removing token and redirecting to login');  // Debug log
      localStorage.removeItem('authToken');
      navigate('/login');
      return;
    }

    // If no userId in URL, fetch the details for the logged-in user
    if (!userId) {
      console.log('No userId in URL, fetching details for logged-in user');  // Debug log
      fetchPublicDetails(decoded.id);  // Fetch details for logged-in user
    } else {
      console.log('Fetching details for external user with userId:', userId);  // Debug log
      fetchPublicDetails(userId);  // External user case, use userId in URL
    }
  }, [token, userId, navigate, fetchPublicDetails]);

  const handleViewSensitiveDetails = () => {
  if (!token) {
    console.log('No token found, redirecting to request access page');  // Debug log
    navigate('/request-emergency-access', { state: { userId } });
    console.log(userId);
  } else {
    // For logged-in users, navigate to sensitive details page
    console.log('User is logged in, redirecting to sensitive details page');  // Debug log
    navigate('/view-sensitive-details');
  }
};

  if (!publicDetails) return <div>Loading...</div>;  // Show loading while data is fetched

  return (
    <div>
      <h2>Public Details</h2>
      <p><strong>Full Name:</strong> {publicDetails.fullName}</p>
      <p><strong>Address:</strong> {publicDetails.address}</p>
      <p><strong>Phone Number:</strong> {publicDetails.phoneNumber}</p>
      <p><strong>Blood Group:</strong> {publicDetails.bloodGroup}</p>
      <img src={publicDetails.photo} alt="Profile" />
      <div className="text-center mt-4">
        <button onClick={handleViewSensitiveDetails} className="btn btn-primary btn-lg">
          View Sensitive Details
        </button>
      </div>
    </div>
  );
};

export default ViewBasicDetailsPage;
