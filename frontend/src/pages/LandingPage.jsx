import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LandingPage.css'; // Import custom CSS
import logo from '../pages/logo.png'; // Import the logo image

const LandingPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    // Redirect to the temp-login page to start the login process
    navigate('/temp-login');
  };

  return (
    <div className="landing-container">
      <div className="glass-effect">
        <div className="logo-container">
          <img src={logo} alt="INVO-TA Logo" className="logo" />
        </div>
        <h2>Welcome to INVO-TA</h2>
        <p>
          INVO-TA is an innovative silicone sticker that integrates a QR code and NFC technology to provide instant access to emergency medical information.
        </p>
        <h4>What is INVO-TA?</h4>
        <p>
          INVO-TA is designed to help bystanders, first responders, and anyone in an emergency situation retrieve critical health data when the user is unable to communicate, such as due to unconsciousness or injury.
        </p>
        <h4>How It Works</h4>
        <p>
          Scan the QR code or tap the NFC chip to access essential medical data. Confidential data requires guardian approval for access.
        </p>
        <h4>Why is INVO-TA Important?</h4>
        <p>
          Emergencies can happen at any time, and INVO-TA ensures that vital medical information is available quickly to those around you. Whether you're at home, work, or traveling, INVO-TA provides peace of mind knowing that your medical details are accessible in an emergency.
        </p>

        <div className="start-button-container">
          <button onClick={handleStart} className="btn-start">Get Started</button>
        </div>
      </div>

      <footer className="footer">
        <p>© 2025 INVO-TA. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
