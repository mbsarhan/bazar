import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAds } from '../context/AdContext'; // Import the context hook
import ProgressBar from './ProgressBar'; // Assuming you have this component
import '../styles/forms.css';
import '../styles/AddAdForm.css';


const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
);

// This is YOUR original component structure.
const AddRealEstateForm = () => {
    const navigate = useNavigate();
    const { createRealEstateAd } = useAds(); // Get the function from context

    // --- All of your state from your original file ---
    const [formData, setFormData] = useState({
        title: '',
        transactionType: 'بيع',
        propertyType: 'شقة',
        province: 'دمشق',
        city: '',
        address: '',
        area: '',
        bedrooms: '',
        bathrooms: '',
        floorNumber: '',
        constructionStatus: 'جاهز',
        finishingStatus: 'جيد',
        price: '',
        isNegotiable: false,
        description: '',
    });
    const [images, setImages] = useState([]);
    const [videoFile, setVideoFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0); // This can be used in the future
    const [isUploading, setIsUploading] = useState(false); // This can be used in the future
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState({});
    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);

    // --- All of your handlers from your original file ---
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: false }));
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setImages(prev => [...prev, ...files]);
            if (errors.images) {
                setErrors(prev => ({ ...prev, images: false }));
            }
        }
        e.target.value = null;
    };

    const handleVideoChange = (e) => {
        setVideoFile(e.target.files[0]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeVideo = () => {
        setVideoFile(null);
    };

    // --- THIS IS THE ONLY PART THAT CHANGES ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setErrors({});

        // Your client-side validation
        const newErrors = {};
        if (!formData.city) newErrors.city = true;
        if (images.length < 2) newErrors.images = true;
// // منع الإرسال أثناء رفع الفيديو
         if (isUploading) {
             setErrorMessage('يرجى الانتظار حتى يكتمل رفع الفيديو.');
             return;
         }


        // التحقق من كل حقل في النموذج
        if (!formData.title) newErrors.title = true;
        if (!formData.city) newErrors.city = true;
        if (!formData.address) newErrors.address = true;
        if (!formData.area) newErrors.area = true;
        if (!formData.price) newErrors.price = true;
        if (!formData.description) newErrors.description = true;

         if (images.length < 2) {
             newErrors.images = true;
         }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setErrorMessage('يرجى ملء جميع الحقول الإلزامية.');
            window.scrollTo(0, 0);
            return;
        }

        // --- Build the FormData for the API call ---
        const submissionData = new FormData();
        
        // Map frontend camelCase names to backend snake_case names
        const nameMap = {
            title:'title',
            transactionType: 'transaction_type',
            propertyType: 'realestate_type',
            province: 'governorate',
            address: 'detailed_address',
            area: 'realestate_size',
            bedrooms: 'bedroom_num',
            bathrooms: 'bathroom_num',
            floorNumber: 'floor_num',
            constructionStatus: 'building_status',
            finishingStatus: 'cladding_condition',
            isNegotiable: 'negotiable_check'
        };

        // Append text fields with correct backend names
        for (const key in formData) {
            const backendKey = nameMap[key] || key;
            let value = formData[key];
            if (key === 'isNegotiable') {
                value = value ? '1' : '0'; // Convert boolean to 1/0
            }
            submissionData.append(backendKey, value);
        }

        // Append image files
        images.forEach(file => {
            submissionData.append('images[]', file);
        });

        // Append video file if it exists
        if (videoFile) {
            submissionData.append('video', videoFile);
        }
        
        // --- Call the API ---
        try {
            const result = await createRealEstateAd(submissionData);
            alert(result.message);
            navigate('/dashboard');
        } catch (error) {
            const message = error.response?.data?.message || 'An error occurred.';
            const validationErrors = error.response?.data?.errors;
            let displayError = message;
            if (validationErrors) {
                displayError = Object.values(validationErrors).flat().join('\n');
            }
            setErrorMessage(displayError);
            window.scrollTo(0, 0);
        }
    };

    // --- All of your JSX is IDENTICAL to your original file ---
    // (I have removed it for brevity, but you should not change anything in your return statement)
    // The `name` attributes like `name="transactionType"` and `name="propertyType"`
    // are now correctly mapped in the handleSubmit function.
    const transactionTypes = ['بيع', 'إيجار', 'استثمار'];
    const propertyTypes = ['شقة', 'فيلا', 'محل تجاري', 'مكتب', 'أرض', 'مزرعة', 'شاليه', 'مستودع', 'سوق تجاري'];
    const constructionStatuses = ['جاهز', 'على الهيكل', 'قيد الإنشاء'];
    const finishingStatuses = ['سوبر ديلوكس', 'جيد جداً', 'جيد', 'عادي', 'بحاجة لتجديد'];
    const provinces = ["دمشق", "ريف دمشق", "حلب", "حمص", "حماة", "اللاذقية", "طرطوس", "دير الزور", "الحسكة", "الرقة", "إدلب", "السويداء", "درعا", "القنيطرة"];
    return (
        <div className="form-container wide-form">
            <h2>أضف إعلان عقار جديد</h2>
            <p className="form-subtitle">املأ التفاصيل التالية لنشر إعلانك</p>

            {errorMessage && <div className="error-message" style={{ whiteSpace: 'pre-line' }}>{errorMessage}</div>}

            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>عنوان الإعلان</legend>
                    <div className="form-group">
                        <label htmlFor="title">عنوان الإعلان *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="مثال: شقة فخمة بإطلالة رائعة في المالكي"
                            className={errors.title ? 'input-error' : ''}
                        />
                    </div>
                </fieldset>
                
                <fieldset>
                    <legend>معلومات أساسية</legend>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="transactionType">نوع الصفقة *</label>
                            <select name="transactionType" value={formData.transactionType} onChange={handleChange}>{transactionTypes.map(t => <option key={t} value={t}>{t}</option>)}</select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="propertyType">نوع العقار *</label>
                            <select name="propertyType" value={formData.propertyType} onChange={handleChange}>{propertyTypes.map(p => <option key={p} value={p}>{p}</option>)}</select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>الموقع</legend>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="province">المحافظة *</label>
                            <select name="province" value={formData.province} onChange={handleChange}>{provinces.map(p => <option key={p} value={p}>{p}</option>)}</select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="city">المدينة / المنطقة *</label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange} className={errors.city ? 'input-error' : ''} />
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="address">العنوان التفصيلي *</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="مثال: المزة - شارع الجلاء - بناء 22" className={errors.address ? 'input-error' : ''} />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>المواصفات</legend>
                    <div className="form-grid four-columns">
                        <div className="form-group">
                            <label htmlFor="area">المساحة (م²) *</label>
                            <input type="number" name="area" value={formData.area} onChange={handleChange} className={errors.area ? 'input-error' : ''} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="bedrooms">غرف النوم</label>
                            <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="bathrooms">الحمامات</label>
                            <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="floorNumber">رقم الطابق</label>
                            <input type="number" name="floorNumber" value={formData.floorNumber} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="constructionStatus">حالة البناء *</label>
                            <select name="constructionStatus" value={formData.constructionStatus} onChange={handleChange}>{constructionStatuses.map(s => <option key={s} value={s}>{s}</option>)}</select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="finishingStatus">حالة الإكساء *</label>
                            <select name="finishingStatus" value={formData.finishingStatus} onChange={handleChange}>{finishingStatuses.map(f => <option key={f} value={f}>{f}</option>)}</select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>السعر</legend>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="price">السعر المطلوب *</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} className={errors.price ? 'input-error' : ''} />
                        </div>
                        <div className="form-group checkbox-group price-checkbox">
                            <input type="checkbox" id="isNegotiable" name="isNegotiable" checked={formData.isNegotiable} onChange={handleChange} />
                            <label htmlFor="isNegotiable">السعر قابل للتفاوض</label>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>التفاصيل والوسائط</legend>
                    <div className="form-group">
                        <label htmlFor="description">وصف تفصيلي للعقار والميزات *</label>
                        <textarea name="description" rows="5" value={formData.description} onChange={handleChange} placeholder="اكتب هنا عن ميزات العقار كالإطلالة، وجود مصعد، كراج، تدفئة..." className={errors.description ? 'input-error' : ''}></textarea>
                    </div>
                    <div className="form-group">
                        <label>الصور (صورتان على الأقل) *</label>
                        <div className={`image-uploader ${errors.images ? 'input-error' : ''}`}>
                            <div className="image-grid-container">
                                {images.map((image, index) => (
                                    <div key={index} className="upload-box"><div className="image-preview"><img src={URL.createObjectURL(image)} alt={`preview ${index}`} /><button type="button" onClick={() => removeImage(index)} className="remove-image-btn">&times;</button></div></div>
                                ))}
                                <div className="upload-box" onClick={() => imageInputRef.current.click()}><div className="upload-placeholder"><UploadIcon /><span>أضف صور</span></div></div>
                            </div>
                        </div>
                        <input type="file" ref={imageInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} multiple />
                    </div>
                    <div className="form-group">
                        <label>فيديو (جولة داخل العقار) - اختياري</label>
                        <div className="video-uploader">
                            {videoFile ? (
                                <div className="video-preview">
                                    {isUploading ? <ProgressBar progress={uploadProgress} /> : <video controls src={URL.createObjectURL(videoFile)} />}
                                    <button type="button" onClick={removeVideo} className="remove-image-btn">&times;</button>
                                </div>
                            ) : (
                                <div className="upload-box video-upload-box" onClick={() => videoInputRef.current.click()}>
                                    <div className="upload-placeholder">
                                        <UploadIcon />
                                        <span>اختر فيديو</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <input type="file" ref={videoInputRef} onChange={handleVideoChange} accept="video/*" style={{ display: 'none' }} />
                    </div>
                </fieldset>

                <button type="submit" className="submit-btn" disabled={isUploading}>
                    {isUploading ? 'جاري رفع الفيديو...' : 'نشر الإعلان'}
                </button>
            </form>
        </div>
    );
};

export default AddRealEstateForm;

