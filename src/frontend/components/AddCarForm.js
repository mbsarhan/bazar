import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/forms.css';
import '../styles/AddAdForm.css';

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" /></svg>
);

const AddCarForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        dealType: 'بيع',
        manufacturer: '',
        model: '',
        condition: 'مستعملة',
        transmission: 'أوتوماتيك',
        fuelType: 'بنزين',
        year: '',
        mileage: '',
        price: '',
        isNegotiable: false,
        province: 'دمشق',
        city: '',
        description: '',
    });

    const [mandatoryImages, setMandatoryImages] = useState({
        front: null, back: null, side1: null, side2: null,
    });
    const [extraImages, setExtraImages] = useState([]); // مصفوفة للصور الإضافية

    const [errorMessage, setErrorMessage] = useState(''); // لرسالة الخطأ العامة في الأعلى
    const [errors, setErrors] = useState({});
    
    const fileInputRef = useRef(null);
    const uploadMode = useRef(null); // لتحديد ما إذا كنا نرفع صورة إلزامية أم إضافية

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        // إزالة الخطأ من الحقل عند بدء الكتابة فيه
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: false }));
        }
    };
    
    const handleUploadClick = (mode, fieldName = null) => {
        uploadMode.current = { mode, fieldName }; // mode: 'mandatory' or 'extra'
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const { mode, fieldName } = uploadMode.current;

        if (mode === 'mandatory') {
            setMandatoryImages(prev => ({ ...prev, [fieldName]: files[0] }));
            // إزالة الخطأ من حقل الصورة عند رفعها
             if (errors[fieldName]) {
                setErrors(prev => ({ ...prev, [fieldName]: false }));
            }
        } else if (mode === 'extra') {
            setExtraImages(prev => [...prev, ...files]);
        }
        e.target.value = null;
    };
    
    const removeMandatoryImage = (fieldName) => {
        setMandatoryImages(prev => ({ ...prev, [fieldName]: null }));
    };

    const removeExtraImage = (index) => {
        setExtraImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage('');
        setErrors({});

        const newErrors = {};
        
        // التحقق من الحقول النصية الإلزامية
        if (!formData.manufacturer) newErrors.manufacturer = true;
        if (!formData.model) newErrors.model = true;
        if (!formData.year) newErrors.year = true;
        if (!formData.mileage) newErrors.mileage = true;
        if (!formData.price) newErrors.price = true;
        if (!formData.city) newErrors.city = true;

        // التحقق من الصور الإلزامية
        if (!mandatoryImages.front) newErrors.front = true;
        if (!mandatoryImages.back) newErrors.back = true;
        if (!mandatoryImages.side1) newErrors.side1 = true;
        if (!mandatoryImages.side2) newErrors.side2 = true;

        // إذا كان هناك أخطاء، قم بتحديث الحالة وإيقاف الإرسال
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setErrorMessage('يرجى ملء جميع الحقول الإلزامية.');
            window.scrollTo(0, 0);
            return;
        }

        console.log('بيانات الإعلان:', { ...formData, mandatoryImages, extraImages });
        alert('تم إرسال الإعلان للمراجعة بنجاح!');
        navigate('/dashboard');
    };
    
    const dealTypes = ['بيع', 'إيجار'];
    const conditions = ['جديدة', 'مستعملة', 'متضررة'];
    const transmissions = ['أوتوماتيك', 'عادي', 'الاثنان معاً'];
    const fuelTypes = ['بنزين', 'ديزل', 'كهرباء', 'هايبرد'];
    const provinces = ["دمشق", "ريف دمشق", "حلب", "حمص", "حماة", "اللاذقية", "طرطوس", "دير الزور", "الحسكة", "الرقة", "إدلب", "السويداء", "درعا", "القنيطرة"];

    const MandatoryImageUploaderSlot = ({ fieldName, label }) => {
        const image = mandatoryImages[fieldName];
        const hasError = errors[fieldName]; // التحقق من وجود خطأ لهذا الحقل

        return (
            <div className="image-upload-slot">
                <label>{label} *</label>
                {/* إضافة كلاس 'input-error' ديناميكياً */}
                <div className={`upload-box ${hasError ? 'input-error' : ''}`} onClick={() => !image && handleUploadClick('mandatory', fieldName)}>
                    {image ? (
                        <div className="image-preview">
                            <img src={URL.createObjectURL(image)} alt={label} />
                            <button type="button" onClick={(e) => { e.stopPropagation(); removeMandatoryImage(fieldName); }} className="remove-image-btn">&times;</button>
                        </div>
                    ) : (
                        <div className="upload-placeholder">
                            <UploadIcon />
                            <span>اختر صورة</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="form-container wide-form">
            <h2>أضف إعلان سيارة جديد</h2>
            <p className="form-subtitle">املأ التفاصيل التالية لنشر إعلانك</p>

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>المعلومات الأساسية</legend>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="dealType">نوع الصفقة *</label>
                            <select id="dealType" name="dealType" value={formData.dealType} onChange={handleChange}>
                                {dealTypes.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="manufacturer">الشركة المصنّعة *</label>
                            <input type="text" id="manufacturer" name="manufacturer" value={formData.manufacturer} onChange={handleChange} className={errors.manufacturer ? 'input-error' : ''} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="model">الموديل *</label>
                            <input type="text" id="model" name="model" value={formData.model} onChange={handleChange} className={errors.model ? 'input-error' : ''} />
                        </div>
                         <div className="form-group">
                            <label htmlFor="year">سنة الصنع *</label>
                            <input type="number" id="year" name="year" value={formData.year} onChange={handleChange} placeholder="مثال: 2022" className={errors.year ? 'input-error' : ''} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="condition">الحالة</label>
                            <select id="condition" name="condition" value={formData.condition} onChange={handleChange}>{conditions.map(c => <option key={c} value={c}>{c}</option>)}</select>
                        </div>
                    </div>
                </fieldset>

                {/* --- القسم الثاني: المواصفات الفنية (موجود الآن) --- */}
                <fieldset>
                    <legend>المواصفات الفنية</legend>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="transmission">ناقل الحركة *</label>
                            <select id="transmission" name="transmission" value={formData.transmission} onChange={handleChange}
                            className={errors.transmission ? 'input-error' : ''}>
                                 {transmissions.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="fuelType">نوع الوقود *</label>
                            <select id="fuelType" name="fuelType" value={formData.fuelType} onChange={handleChange}
                            className={errors.fuelType ? 'input-error' : ''}>
                                {fuelTypes.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>
                         <div className="form-group">
                            <label htmlFor="mileage">المسافة المقطوعة (كم) *</label>
                            <input type="number" id="mileage" name="mileage" value={formData.mileage} onChange={handleChange}
                            placeholder="مثال: 50000" className={errors.mileage ? 'input-error' : ''}/>
                        </div>
                    </div>
                </fieldset>

                {/* --- القسم الثالث: السعر والموقع (موجود الآن) --- */}
                 <fieldset>
                    <legend>السعر والموقع</legend>
                    <div className="form-grid">
                        <div className="form-group price-group">
                            <label htmlFor="price">السعر ($) *</label>
                            <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} 
                            className={errors.price ? 'input-error' : ''}/>
                            <div className="checkbox-group">
                                <input type="checkbox" id="isNegotiable" name="isNegotiable" checked={formData.isNegotiable} onChange={handleChange} />
                                <label htmlFor="isNegotiable">قابل للتفاوض</label>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="province">المحافظة</label>
                             <select id="province" name="province" value={formData.province} onChange={handleChange}>
                                {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="city">المدينة / المنطقة *</label>
                            <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} 
                            className={errors.city ? 'input-error' : ''}/>
                        </div>
                    </div>
                </fieldset>

                {/* --- القسم الرابع: التفاصيل --- */}
                <fieldset>
                    <legend>التفاصيل</legend>
                    <div className="form-group">
                        <label htmlFor="description">وصف كامل للسيارة</label>
                        <textarea id="description" name="description" rows="5" value={formData.description} onChange={handleChange} placeholder="اكتب هنا أي تفاصيل إضافية عن حالة السيارة، الميزات، إلخ..."></textarea>
                    </div>
                </fieldset>
                
                {/* --- القسم الخامس: الصور الإلزامية (القسم الجديد) --- */}
                <fieldset>
                    <legend>الصور الإلزامية</legend>
                    <div className="image-grid-container">
                        <MandatoryImageUploaderSlot fieldName="front" label="الواجهة الأمامية" />
                        <MandatoryImageUploaderSlot fieldName="back" label="الواجهة الخلفية" />
                        <MandatoryImageUploaderSlot fieldName="side1" label="الجانب الأيمن" />
                        <MandatoryImageUploaderSlot fieldName="side2" label="الجانب الأيسر" />
                    </div>
                </fieldset>

                {/* --- 5. إضافة قسم الصور الإضافية الجديد --- */}
                <fieldset>
                    <legend>صور إضافية (اختياري)</legend>
                    <div className="image-grid-container">
                        {/* عرض الصور الإضافية التي تم رفعها */}
                        {extraImages.map((image, index) => (
                            <div key={index} className="upload-box">
                                <div className="image-preview">
                                    <img src={URL.createObjectURL(image)} alt={`extra ${index + 1}`} />
                                    <button type="button" onClick={() => removeExtraImage(index)} className="remove-image-btn">&times;</button>
                                </div>
                            </div>
                        ))}
                        
                        {/* زر "أضف صورة" الدائم */}
                        <div className="upload-box" onClick={() => handleUploadClick('extra')}>
                            <div className="upload-placeholder">
                                <UploadIcon />
                                <span>أضف صور</span>
                            </div>
                        </div>
                    </div>
                </fieldset>
                
                {/* حقل إدخال الملفات المخفي والمحدث */}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    style={{ display: 'none' }}
                    multiple // السماح بتحديد عدة ملفات مرة واحدة للصور الإضافية
                />
                
                <button type="submit" className="submit-btn">نشر الإعلان</button>
            </form>
        </div>
    );
};

export default AddCarForm;