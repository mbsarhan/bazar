// admin-panel/src/components/admin/ManageUsers.js
import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import '../../styles/AdminPages.css'; // Reuse the same table styles
import { useAdmin } from '../../context/AdminContext'; // 1. IMPORT

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const { getAllUsers, deleteUser } = useAdmin(); // 1. GET THE deleteUser FUNCTION

    // --- 3. FETCH REAL DATA ---
    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            setError('');
            try {
                const data = await getAllUsers();
                setUsers(data);
            } catch (err) {
                setError('فشل تحميل قائمة المستخدمين.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, [getAllUsers]);

    // --- 2. UPDATE THE handleDeleteUser FUNCTION ---
    const handleDeleteUser = async (userId) => {
        if (window.confirm(`هل أنت متأكد أنك تريد حذف المستخدم رقم ${userId}؟ سيتم حذف جميع إعلاناته وبياناته بشكل دائم.`)) {
            try {
                await deleteUser(userId);
                // On success, filter the user from the local state for an instant UI update
                setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
            } catch (err) {
                // Display the error message from the server (e.g., "Admins cannot delete their own account.")
                alert(err.response?.data?.message || 'Failed to delete the user.');
            }
        }
    };

    if (isLoading) return <p>جاري تحميل المستخدمين...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div>
            <div className="content-header">
                <h1>إدارة المستخدمين</h1>
            </div>

            <div className="admin-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>المعرف</th>
                            <th>الاسم</th>
                            <th>البريد الإلكتروني</th>
                            <th>رقم الهاتف</th>
                            <th>عدد الإعلانات</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.ads_count}</td>
                                <td className="actions-cell">
                                    {/* Simplified to just a delete button for now */}
                                    <button 
                                        className="action-btn reject" 
                                        onClick={() => handleDeleteUser(user.id)}
                                        title="حذف المستخدم"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;