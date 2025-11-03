// src/components/ForgotPassword.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePasswordReset } from '../context/PasswordResetContext'; // 1. IMPORT
import '../styles/forms.css'; // إعادة استخدام نفس الأنماط

const ForgotPassword = () => {
  const [credential, setCredential] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { sendResetCode } = usePasswordReset(); // 2. GET THE FUNCTION

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!credential) {
      setError('يرجى إدخال بريدك الإلكتروني أو رقم هاتفك.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await sendResetCode(credential);
      setMessage(result.message);
      // --- THIS IS THE KEY CHANGE ---
      // Navigate to the general verification page, but with a specific type.
      navigate('/verification', {
        state: {
          credential: credential,
          type: 'passwordReset' // Identify the purpose of the verification
        }
      });
    } catch (err) {
      const errorMessage = err.response?.data?.errors?.email?.[0] || err.response?.data?.message || 'فشل إرسال الرمز.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="centered-page-container">
      <div className="form-container">
        <h2>استعادة كلمة المرور</h2>
        <p className="form-subtitle" style={{ marginBottom: '25px' }}>أدخل بريدك الإلكتروني أو رقم هاتفك لإرسال رمز التأكيد.</p>

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

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'جاري الإرسال...' : 'إرسال'}
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