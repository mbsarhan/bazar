// src/frontend/components/dashboard/MyProfile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Modal from './Modal';
import '../../styles/forms.css';
import '../../styles/MyProfile.css';

const MyProfile = () => {
    const { user, verifyPassword , updateProfile} = useAuth();
    const navigate = useNavigate();

    // --- State for editable info (Name) ---
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');


    // --- State for the Password Verification Modal ---
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');

    
    // --- State for Feedback ---
    const [formError, setFormError] = useState(''); // For the main name form
    const [modalError, setModalError] = useState(''); // For the password modal
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Populate state from user context
    useEffect(() => {
        if (user) {
            setFirstName(user.fname || '');
            setLastName(user.lname || '');
        }
    }, [user]);

    const handleInfoSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setSuccessMessage(''); // Clear old success messages
        setIsSubmitting(true);


        // --- THIS IS THE NEW CHECK ---
        // Compare the form state with the original user data from the context.
        if (firstName.trim() === user.fname && lastName.trim() === user.lname) {
            setFormError('لم تقم بإجراء أي تغيير على اسمك.');
            setIsSubmitting(false);
            return; // Stop the function here, do not call the API.
        }



        if (!firstName || !lastName) {
            setFormError('الاسم الأول واسم العائلة حقول إلزامية.');
            setIsSubmitting(false);
            return;
        }

        try {
            // Call the context function with the current state values
            await updateProfile({
                fname: firstName,
                lname: lastName,
            });

            // On success
            setSuccessMessage('تم تحديث الاسم بنجاح!');

        } catch (err) {
            // This will now also catch the rate-limiting error from the backend
            const errorMessage = err.response?.data?.errors?.fname?.[0] || err.response?.data?.message || 'فشل تحديث الاسم.';
            setFormError(errorMessage);
        }
        finally{
            setIsSubmitting(false);
        }
    };

    // This is the "Gateway" function
    const handlePasswordVerification = async () => {
        setModalError('');
        if (!currentPassword) {
            setModalError('يرجى إدخال كلمة المرور.');
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
            setModalError(errorMessage);
        }
    };

    return (
        <div className="profile-page-wrapper">
            <div className="content-header">
                <h1>ملفي الشخصي</h1>
            </div>


            {/* Display both success and error messages */}
            {successMessage && <div className="success-message" style={{marginBottom: '20px'}}>{successMessage}</div>}
            {formError && !isPasswordModalOpen && <div className="error-message" style={{marginBottom: '20px'}}>{formError}</div>}

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
                        <button type="submit" className="submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'جاري الحفظ...' : 'حفظ الاسم'}
                        </button>
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
                {modalError && <div className="error-message">{modalError}</div>}
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