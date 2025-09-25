import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';

// 1. استيراد المكونات الأساسية
import SignUp from './components/SignUp';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Header from './components/Header';
import HomePage from './components/HomePage';

import 'rc-slider/assets/index.css';

import AddAdChoice from './components/AddAdChoice';
import AddCarForm from './components/AddCarForm';
import AddRealEstateForm from './components/AddRealEstateForm';

import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardOverview from './components/dashboard/DashboardOverview';
import MyProfile from './components/dashboard/MyProfile';
import MyCarAds from './components/dashboard/MyCarAds';
import MyRealEstateAds from './components/dashboard/MyRealEstateAds';
import Reviews from './components/dashboard/Reviews';

import AdDetailPage from './components/AdDetailPage';

// مكونات وهمية لتمثيل الصفحات الأخرى
const Dashboard = () => (
  <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '24px' }}>
    <h2>أهلاً بك في لوحة التحكم الخاصة بك</h2>
    <Link to="/add-ad" style={{
      display: 'inline-block',
      marginTop: '30px',
      padding: '12px 25px',
      backgroundColor: '#90EE90',
      color: '#33363b',
      textDecoration: 'none',
      borderRadius: '10px',
      fontWeight: '600'
    }}>
      + أضف إعلاناً جديداً
    </Link>
  </div>
);


function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />

        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/ad/:adId" element={<AdDetailPage />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />


          <Route path="/add-ad" element={<AddAdChoice />} />

          <Route path="/add-car" element={<AddCarForm />} />

          <Route path="/add-real-estate" element={<AddRealEstateForm />} />

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="my-profile" element={<MyProfile />} />
            <Route path="car-ads" element={<MyCarAds />} />
            <Route path="real-estate-ads" element={<MyRealEstateAds />} />
            <Route path="reviews" element={<Reviews />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;