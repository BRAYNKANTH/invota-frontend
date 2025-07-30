import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './ViewBasicDetailsPage.css'; // Custom CSS for this page

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
      const response = await axios.get(`https://invota-backend-production.up.railway.app/api/auth/get-public-details/${userId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},  // Send token if available
      });

      // Check if the user is verified
      if (response.data.publicDetails.isVerified === false) {
        console.log('User not verified, redirecting to landing page');
        navigate('/landing');  // Redirect to landing if user is not verified
        return;
      }

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
    } else {
      // For logged-in users, navigate to sensitive details page
      console.log('User is logged in, redirecting to sensitive details page');  // Debug log
      navigate('/view-sensitive-details');
    }
  };

  // Button to go to login page
  const handleLoginRedirect = () => {
    navigate('/login');  // Redirect to login page
  };

  if (!publicDetails) return <div>Loading...</div>;  // Show loading while data is fetched

  return (
    <div className="view-details-container">
      <div className="glassy-container">
        {/* Login button in the top-right corner */}
        <button 
          className="btn btn-secondary position-absolute top-0 end-0 m-3" 
          onClick={handleLoginRedirect}>
          Login
        </button>

        <h2 className="text-center text-white mb-4">Public Details</h2>
        {/* Table for displaying public details */}
        <table className="table table-bordered table-striped">
          <tbody>
            <tr>
              <td><strong>Full Name:</strong></td>
              <td>{publicDetails.fullName}</td>
            </tr>
            <tr>
              <td><strong>Address:</strong></td>
              <td>{publicDetails.address}</td>
            </tr>
            <tr>
              <td><strong>Phone Number:</strong></td>
              <td>{publicDetails.phoneNumber}</td>
            </tr>
            <tr>
              <td><strong>Blood Group:</strong></td>
              <td>{publicDetails.bloodGroup}</td>
            </tr>
          </tbody>
        </table>
  
        <div className="text-center mt-4">
          <button onClick={handleViewSensitiveDetails} className="btn btn-primary btn-lg">
            View Sensitive Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewBasicDetailsPage;
