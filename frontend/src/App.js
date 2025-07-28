import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import TempLoginPage from './pages/TempLoginPage';
import RealLoginPage from './pages/RealLoginPage';
import AccountUpdatePage from './pages/AccountUpdatePage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import VerifiedPage from './pages/VerifiedPage';
import BasicDetailsPage from './pages/BasicDetailsPage';
import SensitiveDetailsPage from './pages/SensitiveDetailsPage';
import RequestEmergencyAccessPage from './pages/RequestEmergencyAccessPage';
import ViewBasicDetailsPage from './pages/ViewBasicDetailsPage';
import ViewSensitiveDetailsPage from './pages/ViewSensitiveDetailsPage';
import VerifyAccessPage from './pages/VerifyAccessPage';
import CheckEmail from './pages/CheckEmail';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/temp-login" element={<TempLoginPage />} />
        <Route path="/login" element={<RealLoginPage />} />
        <Route path="/account-update" element={<AccountUpdatePage />} />
        <Route path="/request-access/:userId" element={<RequestEmergencyAccessPage />} />

        <Route path="/verify-email/:token" element={<EmailVerificationPage />} />
        <Route path="/verified" element={<VerifiedPage />} />
        <Route path="/check-email" element={<CheckEmail />} />

        {/* Authenticated User Routes */}
        <Route path="/update-basic-details" element={<BasicDetailsPage />} />
        <Route path="/update-sensitive-details" element={<SensitiveDetailsPage />} />

        {/* Emergency Access Request Routes */}
        <Route path="/request-emergency-access" element={<RequestEmergencyAccessPage />} />

        {/* Public Details Routes */}
        <Route path="/view-basic-details/:userId" element={<ViewBasicDetailsPage />} />
        <Route path="/view-basic-details" element={<ViewBasicDetailsPage />} />
        <Route path="/verify-access/:token" element={<VerifyAccessPage />} />

        {/* Sensitive Details Routes */}
        <Route path="/view-sensitive-details/:userId" element={<ViewSensitiveDetailsPage />} />
        <Route path="/view-sensitive-details" element={<ViewSensitiveDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
