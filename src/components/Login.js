import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/forms.css';

const Login = () => {
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!credential || !password) {
      setError('يرجى إدخال البريد/رقم الهاتف وكلمة المرور.');
      return;
    }

    console.log('بيانات تسجيل الدخول:', { credential, password });

    alert('تم تسجيل الدخول بنجاح!');
    navigate('/dashboard');
  };

  return (
    <div className="centered-page-container">
      <div className="form-container">
        <h2>تسجيل الدخول</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="credential">البريد الإلكتروني أو رقم الهاتف</label>
            <input
              type="text"
              id="credential"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
            />
          </div>

          {/* --- تعديل: تم تحديث بنية حقل كلمة المرور بالكامل --- */}
          <div className="form-group">
            <label htmlFor="password">كلمة المرور</label>
            {/* 1. الحاوية الجديدة التي تضمن التمركز الصحيح */}
            <div className="input-with-icon">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* 2. الأيقونة الآن داخل الحاوية الجديدة */}
              <span
                className={`password-toggle-icon ${showPassword ? 'visible' : 'hidden'}`}
                onClick={() => setShowPassword(!showPassword)}
              ></span>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            تسجيل الدخول
          </button>
        </form>
        <div className="form-link">
          <Link to="/forgot-password">نسيت كلمة المرور؟</Link>
        </div>
        <div className="form-link">
          ليس لديك حساب؟ <Link to="/signup">أنشئ حساباً جديداً</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;