import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/forms.css'; // سنستخدم نفس ملف الأنماط الأساسي
import '../styles/AddAdChoice.css'; // وسنضيف ملفاً جديداً للأنماط الخاصة بهذه الصفحة

// أيقونات SVG بسيطة ومباشرة داخل الكود
const CarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    class="lucide lucide-car-icon lucide-car">
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
    <circle cx="7" cy="17" r="2"/>
    <path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>
   </svg>
);

const RealEstateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);


const AddAdChoice = () => {
    return (
        // نستخدم نفس حاوية النموذج ولكن مع تعديل بسيط في الكلاس
        <div className="centered-page-container">
            <div className="form-container choice-container">
                <h2>ماذا تريد أن تعلن عنه؟</h2>
                <p className="choice-subtitle">اختر الفئة للبدء في إضافة إعلانك</p>

                <div className="choices-wrapper">
                    {/* بطاقة اختيار السيارة */}
                    <Link to="/add-car" className="choice-card car-choice">
                        <CarIcon />
                        <h3>سيارة</h3>
                    </Link>

                    {/* بطاقة اختيار العقار */}
                    <Link to="/add-real-estate" className="choice-card">
                        <RealEstateIcon />
                        <h3>عقار</h3>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AddAdChoice;