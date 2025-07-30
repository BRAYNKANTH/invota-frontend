import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './ViewBasicDetailsPage.css';  // Custom CSS for this page

const ViewBasicDetailsPage = () => {
  const [publicDetails, setPublicDetails] = useState(null);
  const { userId } = useParams();  // Get userId from the URL params (for external users)
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');  // Get token from localStorage

  const fetchPublicDetails = useCallback(async (userId) => {
    try {
      const response = await axios.get(`https://invota-backend-production.up.railway.app/api/auth/get-public-details/${userId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      // Check if the user is verified
      if (response.data.publicDetails.isVerified === false) {
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
      if (userId) {
        fetchPublicDetails(userId);  // For external users, use userId from URL
      } else {
        navigate('/landing');  // Redirect to landing page if no userId is present
      }
      return;
    }

    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      localStorage.removeItem('authToken');
      navigate('/login');
      return;
    }

    if (!userId) {
      fetchPublicDetails(decoded.id);  // Fetch details for logged-in user
    } else {
      fetchPublicDetails(userId);  // External user case, use userId in URL
    }
  }, [token, userId, navigate, fetchPublicDetails]);

  const handleViewSensitiveDetails = () => {
    if (!token) {
      navigate('/request-emergency-access', { state: { userId } });
    } else {
      navigate('/view-sensitive-details');
    }
  };

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
              <td><strong>Age:</strong></td>
              <td>{publicDetails.age}</td>
            </tr>
            <tr>
              <td><strong>Gender:</strong></td>
              <td>{publicDetails.gender}</td>
            </tr>
            <tr>
              <td><strong>Blood Group:</strong></td>
              <td>{publicDetails.bloodGroup}</td>
            </tr>
            {/* Emergency Contact */}
            <tr>
              <td><strong>Emergency Contact Email:</strong></td>
              <td>{publicDetails.emergencyContactEmail}</td>
            </tr>
            <tr>
              <td><strong>Emergency Contact Number:</strong></td>
              <td>{publicDetails.emergencyContactNumber}</td>
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
