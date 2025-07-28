import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import VerifyAccessPage from './pages/VerifyAccessPage'; //
import CheckEmail from './pages/CheckEmail';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />  {/* Landing page */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/temp-login" element={<TempLoginPage />} />  {/* Temporary login */}
        <Route path="/login" element={<RealLoginPage />} />  {/* Real login page after email verification */}
        <Route path="/account-update" element={<AccountUpdatePage />} />  {/* Account update */}
        <Route path="/verify-email/:token" element={<EmailVerificationPage />} />  {/* Email verification */}
        <Route path="/verified" element={<VerifiedPage />} />  {/* Verified page after email verification */}
        <Route path="/check-email" element={<CheckEmail />} />  {/* Check email instructions */}

        {/* Authenticated User Routes */}
        <Route path="/update-basic-details" element={<BasicDetailsPage />} />  {/* Update basic details */}
        <Route path="/update-sensitive-details" element={<SensitiveDetailsPage />} />  {/* Update sensitive details */}

        {/* Emergency Access Request Routes */}
        <Route path="/request-emergency-access" element={<RequestEmergencyAccessPage />} />  {/* Request emergency access */}

        {/* Public Details Routes */}
        <Route path="/view-basic-details/:userId" element={<ViewBasicDetailsPage />} />  {/* View basic details with userId (public) */}
        <Route path="/view-basic-details" element={<ViewBasicDetailsPage />} /> {/* View authenticated user's public details */}

 <Route path="/verify-access/:token" element={<VerifyAccessPage />} />
    
        {/* Sensitive Details Routes */}
        <Route path="/view-sensitive-details/:userId" element={<ViewSensitiveDetailsPage />} />  {/* View sensitive details with userId */}
        <Route path="/view-sensitive-details" element={<ViewSensitiveDetailsPage />} />  {/* View authenticated user's sensitive details */}
      </Routes>
    </Router>
  );
}

export default App;
