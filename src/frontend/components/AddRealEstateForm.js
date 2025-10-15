import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAds } from '../context/AdContext'; // Import the context hook
import ProgressBar from './ProgressBar'; // Assuming you have this component
import '../styles/forms.css';
import '../styles/AddAdForm.css';
import { vi } from 'date-fns/locale';


const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
);

// This is YOUR original component structure.
const AddRealEstateForm = () => {
    const navigate = useNavigate();
    const { adId } = useParams();
    const isEditMode = Boolean(adId);

    const { createRealEstateAd, getAdById, updateRealEstateAd } = useAds();

    // --- All of your state from your original file ---
    const [formData, setFormData] = useState({
        title: '',
        transaction_type: 'بيع',
        realestate_type: 'شقة',
        governorate: 'دمشق',
        city: '',
        detailed_address: '',
        area: '',
        bedroom_num: '',
        bathroom_num: '',
        floor_num: '',
        building_status: 'جاهز',
        cladding_condition: 'جيد',
        price: '',
        negotiable_check: false,
        description: '',
    });
    const [images, setImages] = useState([]);
    const [videoFile, setVideoFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0); // This can be used in the future
    const [isUploading, setIsUploading] = useState(false); // This can be used in the future
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    const [isLoading, setIsLoading] = useState(isEditMode);

    // --- Data Fetching for Edit Mode ---
    useEffect(() => {
        if (isEditMode) {
            const fetchAdData = async () => {
                try {
                    const adData = await getAdById(adId, 'real-estate');

                    setFormData({
                        title: adData.title ?? '',
                        transaction_type: adData.transaction_type ?? 'بيع',
                        realestate_type: adData.realestate_type ?? 'شقة',
                        governorate: adData.governorate ?? 'دمشق',
                        city: adData.city ?? '',
                        detailed_address: adData.detailed_address ?? '',
                        area: adData.area ?? '',
                        realestate_size: adData.realestate_size ?? '',
                        bedroom_num: adData.bedroom_num ?? '',
                        bathroom_num: adData.bathroom_num ?? '',
                        floor_num: adData.floor_num ?? '',
                        building_status: adData.building_status ?? 'جاهز',
                        cladding_condition: adData.cladding_condition ?? 'جيد',
                        price: adData.price ?? '',
                        negotiable_check: adData.negotiable_check === 1,
                        description: adData.description ?? '',
                    });

                    if (adData?.imageUrls) {
                        setImages(adData.imageUrls);
                    }

                    if(adData?.videoUrl){
                        setVideoFile(adData.videoUrl);
                    }

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
        if (!formData.detailed_address) newErrors.detailed_address = true;
        if (!formData.area) newErrors.area = true;
        if (!formData.description) newErrors.description = true;

        if (images.length < 1) {
            newErrors.images = true;
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setErrorMessage('يرجى ملء جميع الحقول الإلزامية.');
            window.scrollTo(0, 0);
            return;
        }

        setIsSubmitting(true);
        try {
            const dataToSubmit = new FormData();

            for (const key in formData) {
                let value = formData[key];
                if (key === 'negotiable_check') {
                    value = value ? 1 : 0;
                }
                dataToSubmit.append(key, value);
            }
            images.forEach(file => dataToSubmit.append('images[]', file));
            if (videoFile) dataToSubmit.append('video', videoFile);

            if (isEditMode) {
                dataToSubmit.append('_method', 'PUT');
                await updateRealEstateAd(adId, dataToSubmit);
                alert('تم تحديث الإعلان بنجاح!');
                navigate('/dashboard/real-estate-ads');
            } else {
                await createRealEstateAd(dataToSubmit);
                alert('تم نشر الإعلان بنجاح!');
                navigate('/dashboard/real-estate-ads');
            }
        } catch (err) {
            console.error("Failed to submit ad:", err);
            setErrorMessage(err.response?.data?.message || err.message || 'فشل إرسال الإعلان.');
            window.scrollTo(0, 0); // Scroll to top to show the error
        } finally {
            setIsSubmitting(false);
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
            <h2>{isEditMode ? 'تعديل إعلان عقار' : 'أضف إعلان عقار جديد'}</h2>
            <p className="form-subtitle">{isEditMode ? 'قم بتحديث بيانات إعلانك أدناه.' : 'املأ التفاصيل التالية لنشر إعلانك'}</p>

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
                            <label htmlFor="transaction_type">نوع الصفقة *</label>
                            <select name="transaction_type" value={formData.transaction_type} onChange={handleChange}>{transactionTypes.map(t => <option key={t} value={t}>{t}</option>)}</select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="realestate_type">نوع العقار *</label>
                            <select name="realestate_type" value={formData.realestate_type} onChange={handleChange}>{propertyTypes.map(p => <option key={p} value={p}>{p}</option>)}</select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>الموقع</legend>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="governorate">المحافظة *</label>
                            <select name="governorate" value={formData.governorate} onChange={handleChange}>{provinces.map(p => <option key={p} value={p}>{p}</option>)}</select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="city">المدينة / المنطقة *</label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange} className={errors.city ? 'input-error' : ''} />
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="detailed_address">العنوان التفصيلي *</label>
                            <input type="text" name="detailed_address" value={formData.detailed_address} onChange={handleChange} placeholder="مثال: المزة - شارع الجلاء - بناء 22" className={errors.address ? 'input-error' : ''} />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>المواصفات</legend>
                    <div className="form-grid four-columns">
                        <div className="form-group">
                            <label htmlFor="area">المساحة (م²) *</label>
                            <input type="text" name="area" value={formData.area} onChange={handleChange} placeholder='يقبل مساحة تقريبية' className={errors.area ? 'input-error' : ''} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="bedroom_num">غرف النوم</label>
                            <input type="number" name="bedroom_num" value={formData.bedroom_num} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="bathroom_num">الحمامات</label>
                            <input type="number" name="bathroom_num" value={formData.bathroom_num} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="floor_num">رقم الطابق</label>
                            <input type="number" name="floor_num" value={formData.floor_num} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="building_status">حالة البناء *</label>
                            <select name="building_status" value={formData.building_status} onChange={handleChange}>{constructionStatuses.map(s => <option key={s} value={s}>{s}</option>)}</select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="cladding_condition">حالة الإكساء *</label>
                            <select name="cladding_condition" value={formData.cladding_condition} onChange={handleChange}>{finishingStatuses.map(f => <option key={f} value={f}>{f}</option>)}</select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>السعر</legend>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="price">السعر المطلوب</label>
                            <input type="text" name="price" value={formData.price} onChange={handleChange}/>
                        </div>
                        <div className="form-group checkbox-group price-checkbox">
                            <input type="checkbox" id="negotiable_check" name="negotiable_check" checked={formData.negotiable_check} onChange={handleChange} />
                            <label htmlFor="negotiable_check">السعر قابل للتفاوض</label>
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
                        <label>الصور (صورة على الأقل) *</label>
                        <div className={`image-uploader ${errors.images ? 'input-error' : ''}`}>
                            <div className="image-grid-container">
                                {images.map((image, index) => (
                                    <div key={index} className="upload-box">
                                        <div className="image-preview">
                                            <img
                                                src={
                                                    image instanceof File
                                                        ? URL.createObjectURL(image) // for new uploads
                                                        : image                      // for URLs from backend
                                                }
                                                alt={`extra ${index + 1}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="remove-image-btn"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    </div>
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
                                    {isUploading ? <ProgressBar progress={uploadProgress} /> : <video controls src={
                                                    videoFile instanceof File
                                                        ? URL.createObjectURL(videoFile) // for new uploads
                                                        : videoFile                      // for URLs from backend
                                                } />}
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

                <button type="submit" className="submit-btn" disabled={isUploading || isSubmitting}>
                    {isSubmitting ? 'جاري الحفظ...' : (isEditMode ? 'حفظ التعديلات' : 'نشر إعلان العقار')}
                </button>
            </form>
        </div>
    );
};

export default AddRealEstateForm;

