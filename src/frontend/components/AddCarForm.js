import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAds } from '../context/AdContext';
import { useLocation } from '../context/LocationContext';
import { locationData } from '../context/locationData';
import { carData } from '../context/carData';
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
    const { adId } = useParams();
    const isEditMode = Boolean(adId);

    const { country } = useLocation();
    const { createCarAd, getAdById, updateCarAd } = useAds();

    const [formData, setFormData] = useState({
        transaction_type: 'بيع',
        manufacturer: '',
        model: '',
        condition: 'مستعملة',
        gear: 'أوتوماتيك',
        fuel_type: 'بنزين',
        geo_location: country.name,
        model_year: '',
        distance_traveled: '',
        price: '',
        negotiable_check: false,
        governorate: locationData[country.code].provinces[0],
        city: '',
        description: '',
    });

    const [availableModels, setAvailableModels] = useState([]);
    const [availableYears, setAvailableYears] = useState([]);
    const [mandatoryImages, setMandatoryImages] = useState({
        front: null, back: null, side1: null, side2: null,
    });
    const [extraImages, setExtraImages] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);


    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(isEditMode);

    const fileInputRef = useRef(null);
    const uploadMode = useRef(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: false }));
        }
    };

    const handleManufacturerChange = (e) => {
        const selectedMakeName = e.target.value;
        setFormData(prev => ({
            ...prev,
            manufacturer: selectedMakeName,
            model: '',
            model_year: ''
        }));

        const selectedMake = carData.find(make => make.make_name === selectedMakeName);
        if (selectedMake) {
            setAvailableModels(Object.keys(selectedMake.models));
        } else {
            setAvailableModels([]);
        }
        setAvailableYears([]);
        if (errors.manufacturer) {
            setErrors(prev => ({ ...prev, manufacturer: false }));
        }
    };

    const handleModelChange = (e) => {
        const selectedModelName = e.target.value;
        setFormData(prev => ({
            ...prev,
            model: selectedModelName,
            model_year: ''
        }));

        const selectedMake = carData.find(make => make.make_name === formData.manufacturer);
        if (selectedMake && selectedMake.models[selectedModelName]) {
            const years = [...selectedMake.models[selectedModelName].years].sort((a, b) => b - a);
            setAvailableYears(years);
        } else {
            setAvailableYears([]);
        }
        if (errors.model) {
            setErrors(prev => ({ ...prev, model: false }));
        }
    };

    const handleUploadClick = (mode, fieldName = null) => {
        uploadMode.current = { mode, fieldName };
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const { mode, fieldName } = uploadMode.current;

        if (mode === 'mandatory') {
            setMandatoryImages(prev => ({ ...prev, [fieldName]: files[0] }));
            if (errors[fieldName]) {
                setErrors(prev => ({ ...prev, [fieldName]: false }));
            }
        } else if (mode === 'extra') {
            setExtraImages(prev => [...prev, ...files]);
        }
        e.target.value = null;
    };

    const removeMandatoryImage = (fieldName) => {
        const imageToRemove = mandatoryImages[fieldName];
        if (typeof imageToRemove === 'string') {
            const filename = imageToRemove.substring(imageToRemove.lastIndexOf('/') + 1);
            setRemovedImages(prev => [...prev, filename]);
        }
        setMandatoryImages(prev => ({ ...prev, [fieldName]: null }));
    };

    const removeExtraImage = (index) => {
        const imageToRemove = extraImages[index];
        if (typeof imageToRemove === 'string') {
            const filename = imageToRemove.substring(imageToRemove.lastIndexOf('/') + 1);
            setRemovedImages(prev => [...prev, filename]);
        }
        setExtraImages(prev => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            governorate: locationData[country.code].provinces[0]
        }));
        if (isEditMode && adId) {
            const fetchAdData = async () => {
                try {
                    const adData = await getAdById(adId);
                    setFormData({
                        transaction_type: adData.transaction_type || 'بيع',
                        manufacturer: adData.manufacturer || '',
                        model: adData.model || '',
                        condition: adData.condition || 'مستعملة',
                        gear: adData.gear || 'أوتوماتيك',
                        fuel_type: adData.fuel_type || 'بنزين',
                        model_year: adData.model_year || '',
                        distance_traveled: adData.distance_traveled ?? '',
                        price: adData.price || '',
                        negotiable_check: adData.negotiable_check === 1,
                        // Note: The key is still 'governorate' in the state
                        governorate: adData.governorate || locationData[country.code].provinces[0],
                        city: adData.city || '',
                        description: adData.description || '',
                    });

                    if (adData?.imageUrls) {
                        setMandatoryImages({
                            front: adData.imageUrls[0] || null,
                            back: adData.imageUrls[1]  || null,
                            side1: adData.imageUrls[2] || null,
                            side2: adData.imageUrls[3] || null,
                        });

                        const extra = adData.imageUrls.slice(4);
                        setExtraImages(extra);
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
    }, [country, adId, getAdById, isEditMode]);

    useEffect(() => {
        if (isEditMode && formData.manufacturer) {
            const selectedMake = carData.find(make => make.make_name === formData.manufacturer);
            if (selectedMake) {
                const models = Object.keys(selectedMake.models);
                setAvailableModels(models);

                if (formData.model && selectedMake.models[formData.model]) {
                    const years = [...selectedMake.models[formData.model].years].sort((a, b) => b - a);
                    setAvailableYears(years);
                }
            }
        }
    }, [isEditMode, formData.manufacturer, formData.model]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setErrors({});
        const newErrors = {};

        if (!formData.manufacturer) newErrors.manufacturer = true;
        if (!formData.model) newErrors.model = true;
        if (!formData.model_year) newErrors.model_year = true;
        if (!formData.distance_traveled) newErrors.distance_traveled = true;
        if (!formData.city) newErrors.city = true;

        if (!mandatoryImages.front) newErrors.front = true;
        if (!mandatoryImages.back) newErrors.back = true;
        if (!mandatoryImages.side1) newErrors.side1 = true;
        if (!mandatoryImages.side2) newErrors.side2 = true;

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

                if (typeof value === 'string') {
                    value = value.trim();
                }

                if (key === 'price' || key === 'distance_traveled' || key === 'model_year') {
                    value = parseInt(value) || 0;
                }

                dataToSubmit.append(key, value);
            }

            Object.keys(mandatoryImages).forEach(key => {
                const image = mandatoryImages[key];
                if (image instanceof File) {
                    dataToSubmit.append(key, image);
                }
            });

            extraImages.forEach(image => {
                if (image instanceof File) {
                    dataToSubmit.append('extra_images[]', image);
                }
            });

            removedImages.forEach(filename => {
                dataToSubmit.append('removed_images[]', filename);
            });
            
            if (isEditMode) {
                dataToSubmit.append('_method', 'PUT');
                const result = await updateCarAd(adId, dataToSubmit);
                
                if (result.no_changes) {
                    setErrorMessage(result.message);
                } else {
                    alert(result.message);
                    navigate(result.redirect_url || '/dashboard/car-ads');
                }
            } else {
                await createCarAd(dataToSubmit);
                alert('تم نشر الإعلان بنجاح!');
                navigate('/dashboard/car-ads');
            }
        } catch (error) {
            setErrorMessage(error.response?.message || error.message || 'فشل إرسال الإعلان.');
            window.scrollTo(0, 0);
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const dealTypes = ['بيع', 'أجار'];
    const conditions = ['جديدة', 'مستعملة', 'متضررة'];
    const transmissions = ['أوتوماتيك', 'عادي', 'الإثنان معا'];
    const fuelTypes = ['بنزين', 'ديزل', 'كهرباء', 'هايبرد'];
    const currencyLabel = locationData[country.code].currency;

    // --- DYNAMIC LOCATION LOGIC ---
    // 1. Determine the correct label and list based on the country.
    const isSaudi = country.code === 'SA';
    const locationLabel = isSaudi ? 'المدينة *' : 'المحافظة *';
    // The data source is now also dynamic, although it points to the same key 'provinces'.
    // Ensure your `locationData.js` has cities listed under `provinces` for the 'SA' key.
    const locationsList = locationData[country.code].provinces;


    const MandatoryImageUploaderSlot = ({ fieldName, label }) => {
        const image = mandatoryImages[fieldName];
        const hasError = errors[fieldName];
        const previewUrl = image
            ? image instanceof File
                ? URL.createObjectURL(image)
                : image
            : null;

        return (
            <div className="image-upload-slot">
                <label>{label} *</label>
                <div
                    className={`upload-box ${hasError ? 'input-error' : ''}`}
                    onClick={() => !image && handleUploadClick('mandatory', fieldName)}
                >
                    {image ? (
                        <div className="image-preview">
                            <img src={previewUrl} alt={label} />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeMandatoryImage(fieldName);
                                }}
                                className="remove-image-btn"
                            >
                                &times;
                            </button>
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
                {/* ... other fieldsets ... */}

                {/* --- Fieldsets for Basic Info, Technical Specs --- */}
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
                            <select id="manufacturer" name="manufacturer" value={formData.manufacturer} onChange={handleManufacturerChange} className={errors.manufacturer ? 'input-error' : ''}>
                                <option value="">-- اختر الشركة --</option>
                                {carData.map(make => <option key={make.make_id} value={make.make_name}>{make.make_name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="model">الموديل *</label>
                            <select id="model" name="model" value={formData.model} onChange={handleModelChange} disabled={!formData.manufacturer} className={errors.model ? 'input-error' : ''}>
                                <option value="">-- اختر الموديل --</option>
                                {availableModels.map(modelName => <option key={modelName} value={modelName}>{modelName}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="model_year">سنة الصنع *</label>
                            <select id="model_year" name="model_year" value={formData.model_year} onChange={handleChange} disabled={!formData.model} className={errors.model_year ? 'input-error' : ''}>
                                <option value="">-- اختر السنة --</option>
                                {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="condition">الحالة</label>
                            <select id="condition" name="condition" value={formData.condition} onChange={handleChange}>{conditions.map(c => <option key={c} value={c}>{c}</option>)}</select>
                        </div>
                    </div>
                </fieldset>

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
                            <label htmlFor="fuel_type">نوع الوقود *</label>
                            <select id="fuel_type" name="fuel_type" value={formData.fuel_type} onChange={handleChange}>
                                {fuelTypes.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="form-group" style={{ marginTop: '20px' }}>
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

                {/* --- Section for Price and Location (NOW DYNAMIC) --- */}
                <fieldset>
                    <legend>السعر والموقع</legend>
                    <div className="form-grid">
                        <div className="form-group price-group">
                            <label htmlFor="price">السعر ({currencyLabel})</label>
                            <input type="text" id="price" name="price" value={formData.price} onChange={handleChange} />
                            <div className="checkbox-group">
                                <input type="checkbox" id="negotiable_check" name="negotiable_check" checked={formData.negotiable_check} onChange={handleChange} />
                                <label htmlFor="negotiable_check">السعر قابل للتفاوض</label>
                            </div>
                        </div>
                        <div className="form-group">
                            {/* 2. Use the dynamic label here */}
                            <label htmlFor="governorate">{locationLabel}</label>
                            <select id="governorate" name="governorate" value={formData.governorate} onChange={handleChange}>
                                {/* 3. Populate options from the dynamic list */}
                                {locationsList.map(location => <option key={location} value={location}>{location}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="city">الحي / المنطقة *</label>
                            <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} className={errors.city ? 'input-error' : ''} />
                        </div>
                    </div>
                </fieldset>

                {/* ... other fieldsets ... */}
                 <fieldset>
                    <legend>التفاصيل</legend>
                    <div className="form-group">
                        <label htmlFor="description">وصف كامل للسيارة</label>
                        <textarea id="description" name="description" rows="5" value={formData.description} onChange={handleChange} placeholder="اكتب هنا أي تفاصيل إضافية عن حالة السيارة، الميزات، إلخ..."></textarea>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>الصور الإلزامية</legend>
                    <div className="image-grid-container">
                        <MandatoryImageUploaderSlot fieldName="front" label="الواجهة الأمامية" />
                        <MandatoryImageUploaderSlot fieldName="back" label="الواجهة الخلفية" />
                        <MandatoryImageUploaderSlot fieldName="side1" label="الجانب الأيمن" />
                        <MandatoryImageUploaderSlot fieldName="side2" label="الجانب الأيسر" />
                    </div>
                </fieldset>

                <fieldset>
                    <legend>صور إضافية (اختياري)</legend>
                    <div className="image-grid-container">
                        {extraImages.map((image, index) => (
                            <div key={index} className="upload-box">
                                <div className="image-preview">
                                    <img
                                        src={
                                            image instanceof File
                                                ? URL.createObjectURL(image)
                                                : image
                                        }
                                        alt={`extra ${index + 1}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeExtraImage(index)}
                                        className="remove-image-btn"
                                    >
                                        &times;
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="upload-box" onClick={() => handleUploadClick('extra')}>
                            <div className="upload-placeholder">
                                <UploadIcon />
                                <span>أضف صور</span>
                            </div>
                        </div>
                    </div>
                </fieldset>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                    multiple
                />

                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'جاري الحفظ...' : (isEditMode ? 'حفظ التعديلات' : 'نشر الإعلان')}
                </button>
            </form>
        </div>
    );
};

export default AddCarForm;