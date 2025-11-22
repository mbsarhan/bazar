// admin-panel/src/components/admin/ManageReports.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Flag, Eye, Check, X, AlertTriangle, User, Calendar, FileText } from 'lucide-react';
import '../../styles/ManageReports.css';
import api from '../../api'; // Assuming you have a centralized api.js like in your main app

const ManageReports = () => {
    const [reports, setReports] = useState([]);
    const [pagination, setPagination] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('pending'); // all, pending, reviewed, dismissed
    // Note: your API doesn't filter by type yet, so we remove this state for now
    const [filterType, setFilterType] = useState('all'); // all, user, ad
    const [searchTerm, setSearchTerm] = useState(''); // Search not implemented in backend yet

    
    // --- DATA FETCHING ---
    const fetchReports = useCallback(async () => {
        setIsLoading(true);
        try {
            // Build the API query string based on the current filter state
            const params = new URLSearchParams({
                status: filterStatus,
                // Add page, search, etc. later for full functionality
            });
            const response = await api.get(`/admin/reports?${params.toString()}`);
            setReports(response.data.data);
            setPagination(response.data.meta); // Store pagination info if available
        } catch (error) {
            console.error('Error fetching reports:', error);
            // Optionally set an error state to show in the UI
        } finally {
            setIsLoading(false);
        }
    }, [filterStatus]); // Re-fetch whenever the status filter changes


    useEffect(() => {
        fetchReports();
    }, [fetchReports]);


    // --- ACTIONS ---
    const handleReviewReport = async (reportId, action, reviewNote = null) => {
        const confirmMessage = action === 'approve'
            ? 'هل أنت متأكد من قبول هذا البلاغ؟ سيؤدي هذا إلى تطبيق عقوبة على المستخدم المبلغ عنه.'
            : 'هل أنت متأكد من رفض هذا البلاغ؟';

        if (!window.confirm(confirmMessage)) {
            return;
        }

        try {
            // Send the processing request to the backend
            await api.post(`/admin/reports/${reportId}/process`, { action, review_note: reviewNote });
            
            // On success, simply refetch the list to get the most up-to-date data
            fetchReports();

        } catch (error) {
            console.error('Error processing report:', error);
            alert('حدث خطأ أثناء معالجة البلاغ: ' + (error.response?.data?.message || ''));
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            pending: { label: 'قيد المراجعة', class: 'status-pending' },
            reviewed: { label: 'تمت المراجعة', class: 'status-active' },
            dismissed: { label: 'مرفوض', class: 'status-sold' }
        };
        const statusInfo = statusMap[status] || statusMap.pending;
        return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.label}</span>;
    };

    const getReasonIcon = (reason) => {
        const icons = {
            spam: '📧',
            fraud: '⚠️',
            fake: '🚫',
            harassment: '😡',
            inappropriate: '🔞',
            other: '❓'
        };
        return icons[reason] || '📋';
    };

    const filteredReports = reports.filter(report => {
        const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
        const matchesType = filterType === 'all' || report.type === filterType;
        const matchesSearch = !searchTerm || 
            report.reportedUserName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.reportedAdTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.reporterUserName?.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesStatus && matchesType && matchesSearch;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <div className="admin-page">
                <div className="content-header">
                    <h1>جاري تحميل البلاغات...</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="content-header">
                <h1><Flag size={28} /> إدارة البلاغات</h1>
                <div className="header-stats">
                    <div className="stat-badge pending">
                        <AlertTriangle size={18} />
                        <span>{reports.filter(r => r.status === 'pending').length} قيد المراجعة</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-section">
                <div className="filter-group">
                    <label>الحالة:</label>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="all">الكل</option>
                        <option value="pending">قيد المراجعة</option>
                        <option value="reviewed">تمت المراجعة</option>
                        <option value="dismissed">مرفوض</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>النوع:</label>
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="all">الكل</option>
                        <option value="user">مستخدم</option>
                        <option value="ad">إعلان</option>
                    </select>
                </div>

                <div className="filter-group search-group">
                    <label>بحث:</label>
                    <input
                        type="text"
                        placeholder="ابحث عن مستخدم أو إعلان..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Reports List */}
            <div className="reports-list">
                {filteredReports.length === 0 ? (
                    <div className="empty-state">
                        <Flag size={64} />
                        <h3>لا توجد بلاغات</h3>
                        <p>لا توجد بلاغات تطابق معايير البحث</p>
                    </div>
                ) : (
                    filteredReports.map(report => (
                        <div key={report.id} className="report-card">
                            <div className="report-header">
                                <div className="report-type-badge">
                                    {report.type === 'user' ? (
                                        <><User size={16} /> مستخدم</>
                                    ) : (
                                        <><FileText size={16} /> إعلان</>
                                    )}
                                </div>
                                {getStatusBadge(report.status)}
                                <span className="report-id">#{report.id}</span>
                            </div>

                            <div className="report-body">
                                <div className="report-info">
                                    <div className="info-row">
                                        <span className="info-label">المبلغ عنه:</span>
                                        <span className="info-value">
                                            {report.type === 'user' ? (
                                                <Link to={`/manage-users/${report.reportedUserId}`}>
                                                    {report.reportedUserName}
                                                </Link>
                                            ) : (
                                                <Link to={`/manage-ads/${report.reportedAdId}`}>
                                                    {report.reportedAdTitle}
                                                </Link>
                                            )}
                                        </span>
                                    </div>

                                    <div className="info-row">
                                        <span className="info-label">المُبلِّغ:</span>
                                        <span className="info-value">
                                            <Link to={`/manage-users/${report.reporterUserId}`}>
                                                {report.reporterUserName}
                                            </Link>
                                        </span>
                                    </div>

                                    <div className="info-row">
                                        <span className="info-label">السبب:</span>
                                        <span className="reason-badge">
                                            {getReasonIcon(report.reason)} {report.reasonLabel}
                                        </span>
                                    </div>

                                    <div className="info-row full-width">
                                        <span className="info-label">التفاصيل:</span>
                                        <p className="report-description">{report.description}</p>
                                    </div>

                                    <div className="info-row">
                                        <span className="info-label">
                                            <Calendar size={14} /> التاريخ:
                                        </span>
                                        <span className="info-value">{formatDate(report.createdAt)}</span>
                                    </div>

                                    {report.reviewNote && (
                                        <div className="info-row full-width review-note">
                                            <span className="info-label">ملاحظة المراجعة:</span>
                                            <p>{report.reviewNote}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {report.status === 'pending' && (
                                <div className="report-actions">
                                    <button 
                                        className="action-btn view-btn"
                                        onClick={() => {
                                            const url = report.type === 'user' 
                                                ? `/profile/${report.reportedUserId}`
                                                : `/ad/${report.reportedAdId}`;
                                            window.open(url, '_blank');
                                        }}
                                    >
                                        <Eye size={16} /> عرض
                                    </button>
                                    <button 
                                        className="action-btn approve-btn"
                                        onClick={() => handleReviewReport(report.id, 'approve')}
                                    >
                                        <Check size={16} /> قبول البلاغ
                                    </button>
                                    <button 
                                        className="action-btn reject-btn"
                                        onClick={() => handleReviewReport(report.id, 'dismiss')}
                                    >
                                        <X size={16} /> رفض البلاغ
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManageReports;