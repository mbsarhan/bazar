// src/frontend/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import 'rc-slider/assets/index.css';

import { LocationProvider } from './context/LocationContext';
import { AuthProvider } from './context/AuthContext';
import { AdProvider } from './context/AdContext'; // <-- IMPORT
import { DashboardProvider } from './context/DashboardContext'; // <-- IMPORT
import { UserProvider } from './context/UserContext'; // <-- IMPORT
import { PasswordResetProvider } from './context/PasswordResetContext'; // <-- IMPORT

// --- Import pages and layouts ---
import ScrollToTop from './components/ScrollToTop';
import HomePage from './components/HomePage';
import AdDetailPage from './components/AdDetailPage';
import Login from './components/Login';
import SignUp from './components/SignUp';
import VerificationPage from './components/VerificationPage';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import LandingPage from './components/LandingPage';
import AddCarForm from './components/AddCarForm';
import AddRealEstateForm from './components/AddRealEstateForm';
import AddReview from './components/AddReview';
import PublicProfile from './components/PublicProfile';
import PublicLayout from './components/PublicLayout';
import AdChoicePage from './components/AdChoicePage';
import ReportUser from './components/ReportUser';

// --- Import Dashboard Layout and its pages ---
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardOverview from './components/dashboard/DashboardOverview';
import MyProfile from './components/dashboard/MyProfile';
import SecuritySettings from './components/dashboard/SecuritySettings';
import MyCarAds from './components/dashboard/MyCarAds';
import MyRealEstateAds from './components/dashboard/MyRealEstateAds';
import Reviews from './components/dashboard/Reviews';

import Conversations from './components/Conversations';
import Chat from './components/Chat';


function App() {

  return (
    <LocationProvider>
      <AuthProvider>
        <AdProvider>
          <DashboardProvider>
            <UserProvider>
              <PasswordResetProvider>
                <Router>
                  <ScrollToTop />

                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />

                    <Route element={<PublicLayout />}>
                      <Route path="/ads" element={<HomePage />} />
                      <Route path="/ad/:adId" element={<AdDetailPage />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<SignUp />} />
                      <Route path="/verification" element={<VerificationPage />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      <Route path="/add-car" element={<AddCarForm />} />
                      <Route path="edit-car/:adId" element={<AddCarForm />} />
                      <Route path="/add-real-estate" element={<AddRealEstateForm />} />
                      <Route path="edit-real-estate/:adId" element={<AddRealEstateForm />} />
                      <Route path="/profile/:userId" element={<PublicProfile />} />
                      <Route path="add-review/:userIdToReview" element={<AddReview />} />
                      <Route path="/add-ad-choice" element={<AdChoicePage />} />
                      <Route path="/report-user/:userId" element={<ReportUser />} />
                      {/* Chat Routes */}
                      <Route path="/conversations" element={<Conversations />} />
                      <Route path="/chat/:userId" element={<Chat />} />

                      {/* Dashboard Routes */}
                      <Route path="/dashboard" element={<DashboardLayout />}>
                        <Route index element={<DashboardOverview />} />
                        <Route path="my-profile" element={<MyProfile />} />
                        <Route path="my-profile/security-settings" element={<SecuritySettings />} />
                        <Route path="car-ads" element={<MyCarAds />} />
                        <Route path="real-estate-ads" element={<MyRealEstateAds />} />
                        <Route path="reviews" element={<Reviews />} />
                      </Route>
                    </Route>

                  </Routes>
                </Router>
              </PasswordResetProvider>
            </UserProvider>
          </DashboardProvider>
        </AdProvider>
      </AuthProvider>
    </LocationProvider>
  );
}

export default App;