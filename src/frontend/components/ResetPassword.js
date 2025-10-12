// src/components/ResetPassword.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/forms.css';

const ResetPassword = () => {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!code || !password || !confirmPassword) {
      setError('يرجى ملء جميع الحقول.');
      return;
    }

    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }

    // --- منطق وهمي ---
    console.log('رمز التأكيد:', code);
    console.log('كلمة المرور الجديدة:', password);

    alert('تم تغيير كلمة المرور بنجاح!');
    navigate('/login');
  };

  return (
    <div className="centered-page-container">
      <div className="form-container">
        <h2>إدخال كلمة المرور الجديدة</h2>
        <p className="form-subtitle" style={{marginBottom: '25px'}}>أدخل رمز التأكيد الذي وصلك وكلمة المرور الجديدة.</p>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">كلمة المرور الجديدة</label>
            <div className="input-with-icon">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className={`password-toggle-icon ${showPassword ? 'visible' : 'hidden'}`}
                onClick={() => setShowPassword(!showPassword)}
              ></span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">تأكيد كلمة المرور</label>
            <div className="input-with-icon">
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                className={`password-toggle-icon ${showPassword ? 'visible' : 'hidden'}`}
                onClick={() => setShowPassword(!showPassword)}
              ></span>
            </div>
          </div>
          
          <button type="submit" className="submit-btn">
            تغيير كلمة المرور
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;