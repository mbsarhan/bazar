import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/forms.css';

const SignUp = () => {
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!credential || !password || !confirmPassword) {
      setError('يرجى ملء جميع الحقول.');
      return;
    }

    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }

    console.log('تم إرسال بيانات التسجيل:', { credential, password });

    alert('تم إنشاء الحساب بنجاح! سيتم إرسال رمز تأكيد.');
    navigate('/login');
  };

  return (
    <div className="centered-page-container">
      <div className="form-container">
        <h2>إنشاء حساب جديد</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="credential">البريد الإلكتروني أو رقم هاتف سوري</label>
            <input
              type="text"
              id="credential"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              placeholder="example@mail.com or 09********"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">كلمة المرور</label>
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
            إنشاء حساب
          </button>
        </form>
        <div className="form-link">
          لديك حساب بالفعل؟ <Link to="/login">سجل الدخول</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;