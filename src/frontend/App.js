// src/frontend/App.js
import React, { useState } from 'react'; // 1. Import useState
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import 'rc-slider/assets/index.css';

import { LocationProvider } from './context/LocationContext';
import { AuthProvider } from './context/AuthContext';
import { AdProvider } from './context/AdContext'; // <-- IMPORT
import { DashboardProvider } from './context/DashboardContext'; // <-- IMPORT
import { UserProvider } from './context/UserContext'; // <-- IMPORT
import { PasswordResetProvider } from './context/PasswordResetContext'; // <-- IMPORT
import ScrollToTop from './components/ScrollToTop';

// --- Import pages and layouts ---
import Header from './components/Header';
import HomePage from './components/HomePage';
import AdDetailPage from './components/AdDetailPage';
import Login from './components/Login';
import SignUp from './components/SignUp';
import VerificationPage from './components/VerificationPage';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import AddAdChoice from './components/AddAdChoice';
import AddCarForm from './components/AddCarForm';
import AddRealEstateForm from './components/AddRealEstateForm';
import AddReview from './components/AddReview';
import PublicProfile from './components/PublicProfile';

// --- Import Dashboard Layout and its pages ---
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardOverview from './components/dashboard/DashboardOverview';
import MyProfile from './components/dashboard/MyProfile';
import SecuritySettings from './components/dashboard/SecuritySettings'; // Make sure this is imported
import MyCarAds from './components/dashboard/MyCarAds';
import MyRealEstateAds from './components/dashboard/MyRealEstateAds';
import Reviews from './components/dashboard/Reviews';


function App() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest-first');

  return (
    <LocationProvider>
      <AuthProvider>
        <AdProvider>
          <DashboardProvider>
            <UserProvider>
              <PasswordResetProvider>
                <Router>
                  <ScrollToTop />
                  <Header />

                  <Routes>
                    {/* Public Routes */}
                    <Route
                      path="/"
                      element={
                        <HomePage
                          activeFilter={activeFilter}
                          setActiveFilter={setActiveFilter}
                          sortOrder={sortOrder}
                          setSortOrder={setSortOrder}
                        />
                      }
                    />
                    <Route path="/ad/:adId" element={<AdDetailPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    {/*          <Route path="/verify-account" element={<VerificationPage />} />*/}
                    <Route path="/verification" element={<VerificationPage />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/add-ad" element={<AddAdChoice />} />
                    <Route path="/add-car" element={<AddCarForm />} />
                    <Route path="edit-car/:adId" element={<AddCarForm />} />
                    <Route path="/add-real-estate" element={<AddRealEstateForm />} />
                    <Route path="edit-real-estate/:adId" element={<AddRealEstateForm />} />
                    <Route path="/profile/:userId" element={<PublicProfile />} />
                    <Route path="add-review/:userIdToReview" element={<AddReview />} />

                    {/* Dashboard Routes */}
                    <Route path="/dashboard" element={<DashboardLayout />}>
                      <Route index element={<DashboardOverview />} />
                      <Route path="my-profile" element={<MyProfile />} />
                      <Route path="my-profile/security-settings" element={<SecuritySettings />} />
                      <Route path="car-ads" element={<MyCarAds />} />
                      <Route path="real-estate-ads" element={<MyRealEstateAds />} />
                      <Route path="reviews" element={<Reviews />} />
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