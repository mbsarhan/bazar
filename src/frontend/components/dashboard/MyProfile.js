// src/frontend/components/dashboard/MyProfile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Modal from './Modal';
import '../../styles/forms.css';
import '../../styles/MyProfile.css';

const MyProfile = () => {
    const { user, verifyPassword } = useAuth();
    const navigate = useNavigate();

    // --- State for editable info (Name) ---
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');


    // --- State for the Password Verification Modal ---
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');

    
    // --- State for Feedback ---
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Populate state from user context
    useEffect(() => {
        if (user) {
            setFirstName(user.fname || '');
            setLastName(user.lname || '');
        }
    }, [user]);

    const handleInfoSubmit = (e) => {
        e.preventDefault();
        // API call to update name
        console.log("Updating name:", { firstName, lastName });
        setSuccessMessage('تم تحديث الاسم بنجاح!');
    };

    // This is the "Gateway" function
    const handlePasswordVerification = async () => {
        setError('');
        if (!currentPassword) {
            setError('يرجى إدخال كلمة المرور.');
            return;
        }
        
        try {
            // Call the context function
            await verifyPassword(currentPassword);
            
            // If the above line does not throw an error, verification was successful.
            setIsPasswordModalOpen(false);
            setCurrentPassword('');
            
            // Navigate to the security settings page
            navigate('/dashboard/my-profile/security-settings');

        } catch (err) {
            // Axios places validation errors inside error.response.data
            const errorMessage = err.response?.data?.errors?.password?.[0] || 'كلمة المرور غير صحيحة.';
            setError(errorMessage);
        }
    };

    return (
        <div className="profile-page-wrapper">
            <div className="content-header">
                <h1>ملفي الشخصي</h1>
            </div>

            {successMessage && <div className="success-message" style={{marginBottom: '20px'}}>{successMessage}</div>}

            {/* --- Profile Information Form --- */}
            <div className="profile-form-container">
                <form onSubmit={handleInfoSubmit}>
                    <fieldset>
                        <legend>المعلومات الشخصية</legend>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="firstName">الاسم الأول</label>
                                <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                             <div className="form-group">
                                <label htmlFor="lastName">اسم العائلة</label>
                                <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>
                        </div>
                        <button type="submit" className="submit-btn">حفظ الاسم</button>
                    </fieldset>
                </form>
            </div>

            {/* --- Security Section with ONE Button --- */}
            <div className="profile-form-container">
                <fieldset>
                    <legend>معلومات الأمان</legend>
                    <div className="form-group">
                        <label>البريد الإلكتروني، رقم الهاتف، وكلمة المرور</label>
                        <p className="security-note">لتغيير معلوماتك الحساسة، ستحتاج إلى تأكيد كلمة المرور الخاصة بك أولاً.</p>
                        <button type="button" className="change-btn" onClick={() => setIsPasswordModalOpen(true)}>
                            تعديل معلومات الأمان
                        </button>
                    </div>
                </fieldset>
            </div>

            {/* --- Password Verification Modal (The Gateway) --- */}
            <Modal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onConfirm={handlePasswordVerification}
                title="تأكيد الهوية"
            >
                {error && <div className="error-message">{error}</div>}
                <p>للمتابعة، يرجى إدخال كلمة المرور الحالية.</p>
                <div className="form-group">
                    <label htmlFor="modalCurrentPassword">كلمة المرور</label>
                    <input type="password" id="modalCurrentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </div>
            </Modal>
        </div>
    );
};

export default MyProfile;