import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAds } from '../context/AdContext'; // <-- 1. IMPORT THE NEW HOOK
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
    const { adId } = useParams(); // 2. Get the adId from the URL
    const isEditMode = Boolean(adId); // 3. Determine if we are in Edit Mode


    const { createCarAd, getAdById, updateCarAd } = useAds(); // Get functions from context

    // This state object is now perfect. Do not change it.
    const [formData, setFormData] = useState({
        transaction_type: 'بيع',
        manufacturer: '',
        model: '',
        condition: 'مستعملة',
        gear: 'أوتوماتيك',
        fule_type: 'بانزين',
        model_year: '',
        distance_traveled: '',
        price: '',
        negotiable_check: false,
        governorate: 'دمشق',
        city: '',
        description: '',
    });

    const [mandatoryImages, setMandatoryImages] = useState({
        front: null, back: null, side1: null, side2: null,
    });
    const [extraImages, setExtraImages] = useState([]); // مصفوفة للصور الإضافية
    const [errorMessage, setErrorMessage] = useState(''); // لرسالة الخطأ العامة في الأعلى
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(isEditMode); // Start loading if in edit mode

    const fileInputRef = useRef(null);
    const uploadMode = useRef(null); // لتحديد ما إذا كنا نرفع صورة إلزامية أم إضافية

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        // Map frontend names to backend names
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


    // --- 4. NEW useEffect to fetch data in Edit Mode ---
    useEffect(() => {
        if (isEditMode) {
            const fetchAdData = async () => {
                try {
                    const adData = await getAdById(adId);
                    
                    // Pre-populate the form with the fetched data
                    setFormData({
                        transaction_type: adData.transaction_type || 'بيع',
                        manufacturer: adData.manufacturer || '',
                        model: adData.model || '',
                        condition: adData.condition || 'مستعملة',
                        gear: adData.gear || 'أوتوماتيك',
                        fule_type: adData.fule_type || 'بانزين',
                        model_year: adData.model_year || '',
                        distance_traveled: adData.distance_traveled ?? '',
                        price: adData.price || '',
                        negotiable_check: adData.negotiable_check === 1, // Convert 1/0 to true/false
                        governorate: adData.governorate || 'دمشق',
                        city: adData.city || '',
                        description: adData.description || '',
                    });
                    // You would also handle pre-populating images here
                    
                } catch (err) {
                    console.error("Failed to fetch ad data for editing:", err);
                    setErrorMessage("فشل تحميل بيانات الإعلان.");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchAdData();
        }
    }, [adId, getAdById, isEditMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setErrors({});
        const newErrors = {};

        // التحقق من الحقول النصية الإلزامية
        if (!formData.manufacturer) newErrors.manufacturer = true;
        if (!formData.model) newErrors.model = true;
        if (!formData.model_year) newErrors.model_year = true;
        if (!formData.distance_traveled) newErrors.distance_traveled = true;
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
        

        setIsSubmitting(true);
        // --- Call the API ---
        try {
            const dataToSubmit = new FormData();
            
            // Append all form fields
            for (const key in formData) {
                let value = formData[key];
                if (key === 'negotiable_check') {
                    value = value ? '1' : '0';
                }

                if (key === 'price' || key === 'distance_traveled' || key === 'model_year') {
                    value = parseInt(value) || 0; // Use parseFloat and fallback to 0 if invalid
                }

                dataToSubmit.append(key, formData[key]);
            }
            
            // Append images
            for (const key in mandatoryImages) {
                if(mandatoryImages[key]) dataToSubmit.append(`mandatory_images[${key}]`, mandatoryImages[key]);
            }
            extraImages.forEach((file, index) => {
                dataToSubmit.append(`extra_images[${index}]`, file);
            });


            if (isEditMode) {
                // For updates with FormData, you must use POST and add a _method field
                dataToSubmit.append('_method', 'PUT'); 
                await updateCarAd(adId, dataToSubmit);
                alert('تم تحديث الإعلان بنجاح!');
                navigate('/dashboard/car-ads');
            } else {
                await createCarAd(dataToSubmit);
                alert('تم نشر الإعلان بنجاح!');
                navigate('/dashboard/car-ads');
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'فشل إرسال الإعلان.');
            window.scrollTo(0, 0); // Scroll to top to show the error
        }
        finally{
            setIsSubmitting(false);
        }
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

    if (isLoading) {
        return <div className="form-container wide-form"><p>جاري تحميل بيانات الإعلان...</p></div>;
    }

    return (
        <div className="form-container wide-form">
            <h2>{isEditMode ? 'تعديل إعلان سيارة' : 'أضف إعلان سيارة جديد'}</h2>
            <p className="form-subtitle">{isEditMode ? 'قم بتحديث بيانات إعلانك أدناه.' : 'املأ التفاصيل التالية لنشر إعلانك'}</p>

            {errorMessage && (
                <div className="error-message" style={{ whiteSpace: 'pre-line' }}>
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>المعلومات الأساسية</legend>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="transaction_type">نوع الصفقة *</label>
                            <select id="transaction_type" name="transaction_type" value={formData.transaction_type} onChange={handleChange}>
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
                            <label htmlFor="model_year">سنة الصنع *</label>
                            <input type="text" id="model_year" name="model_year" value={formData.model_year} onChange={handleChange} placeholder="مثال: 2022" className={errors.model_year ? 'input-error' : ''} />
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
                            <label htmlFor="gear">ناقل الحركة *</label>
                            <select id="gear" name="gear" value={formData.gear} onChange={handleChange}>
                                 {transmissions.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="fule_type">نوع الوقود *</label>
                            <select id="fule_type" name="fule_type" value={formData.fule_type} onChange={handleChange}>
                                {fuelTypes.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>
                    </div>
                    {/* The distance_traveled input is now in its own full-width group */}
                    <div className="form-group" style={{marginTop: '20px'}}>
                       <label htmlFor="distance_traveled">المسافة المقطوعة (كم) *</label>
                       <input 
                            type="text" 
                            inputMode="numeric" 
                            pattern="[0-9]*"
                            id="distance_traveled" 
                            name="distance_traveled" 
                            value={formData.distance_traveled} 
                            onChange={handleChange} 
                            placeholder="مثال: 50000"
                       />
                   </div>
                </fieldset>

                {/* --- القسم الثالث: السعر والموقع (موجود الآن) --- */}
                <fieldset>
                    <legend>السعر والموقع</legend>
                    <div className="form-grid">
                        <div className="form-group price-group">
                            <label htmlFor="price">السعر (دولار أمريكي) *</label>
                            <input type="text" id="price" name="price" value={formData.price} onChange={handleChange} className={errors.price ? 'input-error' : ''} />
                            <div className="checkbox-group">
                                <input type="checkbox" id="negotiable_check" name="negotiable_check" checked={formData.negotiable_check} onChange={handleChange} />
                                <label htmlFor="negotiable_check">السعر قابل للتفاوض</label>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="governorate">المحافظة *</label>
                            <select id="governorate" name="governorate" value={formData.governorate} onChange={handleChange}>{provinces.map(p => <option key={p} value={p}>{p}</option>)}</select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="city">المدينة / المنطقة *</label>
                            <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} className={errors.city ? 'input-error' : ''} />
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

                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'جاري الحفظ...' : (isEditMode ? 'حفظ التعديلات' : 'نشر الإعلان')}
                </button>
            </form>
        </div>
    );
};

export default AddCarForm;