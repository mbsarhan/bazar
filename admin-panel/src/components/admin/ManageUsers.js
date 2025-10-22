// admin-panel/src/components/admin/ManageUsers.js
import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import '../../styles/AdminPages.css'; // Reuse the same table styles

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // --- Mock Data (to be replaced by API call) ---
    const mockUsers = [
        { id: 1, name: 'أحمد', email: 'ahmad@example.com', phone: '0987654321', ads_count: 5 },
        { id: 2, name: 'فاطمة', email: 'fatima@example.com', phone: '0912345678', ads_count: 2 },
        { id: 3, name: 'خالد', email: 'khaled@example.com', phone: '0933445566', ads_count: 8 },
        { id: 4, name: 'سارة', email: 'sara@example.com', phone: '0955667788', ads_count: 0 },
    ];

    // --- Simulate fetching data ---
    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                // In a real app: const response = await api.get('/admin/users');
                // setUsers(response.data);
                await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
                setUsers(mockUsers);
            } catch (err) {
                setError('فشل تحميل قائمة المستخدمين.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleDeleteUser = (userId) => {
        // In a real app, you would show a confirmation modal first
        if (window.confirm(`هل أنت متأكد أنك تريد حذف المستخدم رقم ${userId}؟`)) {
            // API call: await api.delete(`/admin/users/${userId}`);
            console.log(`Deleting user ${userId}`);
            setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
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