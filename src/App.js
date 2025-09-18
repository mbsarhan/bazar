import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

// 1. استيراد المكونات الأساسية
import SignUp from './components/SignUp';
import Login from './components/Login';
import AddAdChoice from './components/AddAdChoice';

// 2. استيراد مكون نموذج السيارة الذي أضفناه
import AddCarForm from './components/AddCarForm'; 
import AddRealEstateForm from './components/AddRealEstateForm';

// مكونات وهمية لتمثيل الصفحات الأخرى
const Dashboard = () => (
  <div style={{textAlign: 'center', marginTop: '50px', fontSize: '24px'}}>
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
const ForgotPassword = () => <div style={{textAlign: 'center', marginTop: '50px', fontSize: '24px'}}><h2>صفحة استعادة كلمة المرور</h2><p>سيتم إرسال التعليمات إلى بريدك الإلكتروني.</p></div>;


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/add-ad" element={<AddAdChoice />} />

        <Route path="/add-car" element={<AddCarForm />} />
        
        <Route path="/add-real-estate" element={<AddRealEstateForm />} />
      </Routes>
    </Router>
  );
}

export default App;