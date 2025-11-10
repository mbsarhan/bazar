// src/frontend/components/ReportUser.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Flag, AlertCircle, CheckCircle } from 'lucide-react';
import '../styles/ReportUser.css';

const ReportUser = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { getPublicProfile, reportUser } = useUser();

    const [reportedUser, setReportedUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        reason: '',
        description: ''
    });

    const reportReasons = [
        { value: 'spam', label: 'محتوى غير مرغوب فيه أو إعلانات متكررة' },
        { value: 'fraud', label: 'احتيال أو نصب' },
        { value: 'fake', label: 'حساب مزيف أو معلومات كاذبة' },
        { value: 'harassment', label: 'مضايقة أو تحرش' },
        { value: 'inappropriate', label: 'محتوى غير لائق' },
        { value: 'other', label: 'أخرى' }
    ];

    useEffect(() => {
        const fetchUserInfo = async () => {
            setIsLoading(true);
            try {
                const data = await getPublicProfile(userId);
                setReportedUser(data.user);
            } catch (err) {
                setError('فشل في تحميل معلومات المستخدم');
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserInfo();
    }, [userId, getPublicProfile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.reason) {
            setError('الرجاء اختيار سبب البلاغ');
            return;
        }

        if (!formData.description.trim()) {
            setError('الرجاء كتابة تفاصيل البلاغ');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await reportUser(userId, formData);
            setSuccess(true);
            setTimeout(() => {
                navigate(`/profile/${userId}`);
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'فشل في إرسال البلاغ. حاول مرة أخرى.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="report-user-container">
                <div className="report-card">
                    <p>جاري التحميل...</p>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="report-user-container">
                <div className="report-card success-card">
                    <CheckCircle size={64} className="success-icon" />
                    <h2>تم إرسال البلاغ بنجاح</h2>
                    <p>شكراً لك. سيتم مراجعة البلاغ في أقرب وقت ممكن.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="report-user-container">
            <div className="report-card">
                <div className="report-header">
                    <Flag size={32} className="report-icon" />
                    <h1>الإبلاغ عن مستخدم</h1>
                </div>

                {reportedUser && (
                    <div className="reported-user-info">
                        <div className="user-avatar-small">
                            {reportedUser.name.charAt(0)}
                        </div>
                        <div>
                            <p className="user-name">{reportedUser.name}</p>
                            <p className="user-member">عضو منذ {reportedUser.memberSince}</p>
                        </div>
                    </div>
                )}

                <div className="warning-box">
                    <AlertCircle size={20} />
                    <p>يُرجى تقديم معلومات دقيقة. البلاغات الكاذبة قد تؤدي إلى تعليق حسابك.</p>
                </div>

                <form onSubmit={handleSubmit} className="report-form">
                    <div className="form-group">
                        <label htmlFor="reason">سبب البلاغ *</label>
                        <select
                            id="reason"
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            required
                        >
                            <option value="">اختر السبب</option>
                            {reportReasons.map(reason => (
                                <option key={reason.value} value={reason.value}>
                                    {reason.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">تفاصيل البلاغ *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="اشرح سبب الإبلاغ بالتفصيل..."
                            rows="6"
                            required
                        />
                        <span className="char-count">{formData.description.length} / 500</span>
                    </div>

                    {error && (
                        <div className="error-message">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="cancel-btn"
                            disabled={isSubmitting}
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className="report-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'جاري الإرسال...' : 'إرسال البلاغ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportUser;