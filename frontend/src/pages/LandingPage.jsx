import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './LandingPage.css';  // Import the custom CSS file

const LandingPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    // Redirect to the temp-login page to start the login process
    navigate('/temp-login');
  };

  return (
    <div className="container-fluid bg-dark text-white min-vh-100 d-flex flex-column justify-content-center">
      {/* Glass effect container */}
      <div className="container bg-glass p-5 rounded shadow-lg mb-4">
        <h2 className="text-center mb-4">Welcome to INVO-TA</h2>
        <p className="text-center mb-4">
          INVO-TA is an innovative silicone sticker that integrates a QR code and NFC technology to provide instant access to emergency medical information.
        </p>

        {/* Section: What is INVO-TA? */}
        <div className="mb-5">
          <h4>What is INVO-TA?</h4>
          <p>
            INVO-TA is designed to help bystanders, first responders, and anyone in an emergency situation retrieve critical health data when the user is unable to communicate, such as due to unconsciousness or injury.
          </p>
        </div>

        {/* Section: How It Works */}
        <div className="mb-5">
          <h4>How It Works</h4>
          <ul>
            <li>Scan the QR code or tap the NFC chip to access essential medical data.</li>
            <li>Confidential data requires guardian approval for access.</li>
          </ul>
        </div>

        {/* Section: Why is INVO-TA Important? */}
        <div className="mb-5">
          <h4>Why is INVO-TA Important?</h4>
          <p>
            Emergencies can happen at any time, and INVO-TA ensures that vital medical information is available quickly to those around you. Whether you're at home, work, or traveling, INVO-TA provides peace of mind knowing that your medical details are accessible in an emergency.
          </p>
        </div>

        {/* Get Started Button */}
        <div className="text-center">
          <button className="btn btn-primary btn-lg" onClick={handleStart}>Get Started</button>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="text-center mt-4 text-white">
        <p>&copy; 2025 INVO-TA. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
