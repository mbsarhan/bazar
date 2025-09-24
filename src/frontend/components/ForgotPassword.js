// src/components/ForgotPassword.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/forms.css'; // إعادة استخدام نفس الأنماط

const ForgotPassword = () => {
  const [credential, setCredential] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!credential) {
      setError('يرجى إدخال بريدك الإلكتروني أو رقم هاتفك.');
      return;
    }

    // --- منطق وهمي (سيتم استبداله بمنطق حقيقي لاحقاً) ---
    // في التطبيق الحقيقي، هنا يتم إرسال طلب إلى الخادم
    console.log('طلب إعادة تعيين كلمة المرور لـ:', credential);

    // عرض رسالة نجاح للمستخدم
    setMessage('تم إرسال تعليمات إعادة تعيين كلمة المرور. يرجى التحقق من بريدك الإلكتروني أو رسائلك.');

    // يمكننا توجيه المستخدم إلى صفحة إدخال الرمز بعد ثوانٍ قليلة
    setTimeout(() => {
      navigate('/reset-password');
    }, 3000); // 3 ثوانٍ
  };

  return (
    <div className="centered-page-container">
      <div className="form-container">
        <h2>استعادة كلمة المرور</h2>
        <p className="form-subtitle" style={{marginBottom: '25px'}}>أدخل بريدك الإلكتروني أو رقم هاتفك لإرسال رمز التأكيد.</p>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="credential">البريد الإلكتروني أو رقم الهاتف</label>
            <input
              type="text"
              id="credential"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              placeholder="example@mail.com or 09********"
            />
          </div>
          
          <button type="submit" className="submit-btn">
            إرسال
          </button>
        </form>

        <div className="form-link">
          <Link to="/login">العودة إلى تسجيل الدخول</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;