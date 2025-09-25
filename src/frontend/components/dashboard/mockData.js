// src/frontend/components/dashboard/mockData.js

export const carAdsData = [
    {
        id: 1,
        imageUrls: ['https://placehold.co/600x400/90ee90/333?text=Kia+Rio+1', 'https://placehold.co/600x400/90ee90/333?text=Kia+Rio+2', 'https://placehold.co/600x400/90ee90/333?text=Kia+Rio+3'],
        title: 'كيا ريو 2021',
        price: '$6,500',
        location: 'دمشق، المزة', status: 'فعال', year: 2021, mileage: 30000, transmission: 'أوتوماتيك', fuelType: 'بنزين', condition: 'مستعملة'
    },
    {
        id: 2,
        imageUrls: ['https://placehold.co/600x400/f0e68c/333?text=Hyundai+Avante+1'],
        title: 'هيونداي أفانتي 2018',
        price: '$5,800',
        location: 'حلب، الحمدانية', status: 'قيد المراجعة', year: 2018, mileage: 65000, transmission: 'أوتوماتيك', fuelType: 'بنزين', condition: 'مستعملة'
    },
    {
        id: 3,
        imageUrls: ['https://placehold.co/600x400/d3d3d3/555?text=Sham+Pars+1', 'https://placehold.co/600x400/d3d3d3/555?text=Sham+Pars+2'],
        title: 'شام بارس 2011',
        price: '$2,500',
        location: 'حمص، الإنشاءات', status: 'مباع', year: 2011, mileage: 150000, transmission: 'عادي', fuelType: 'بنزين', condition: 'مستعملة'
    },
    {
        id: 4,
        imageUrls: ['https://placehold.co/600x400/87ceeb/333?text=Toyota+Corolla+1', 'https://placehold.co/600x400/87ceeb/333?text=Toyota+Corolla+2'],
        title: 'تويوتا كورولا 2022',
        price: '$10,000',
        location: 'اللاذقية', status: 'فعال', year: 2022, mileage: 15000, transmission: 'أوتوماتيك', fuelType: 'هايبرد', condition: 'مستعملة'
    },
    {
        id: 5,
        imageUrls: ['https://placehold.co/600x400/ff6347/333?text=VW+Golf+1', 'https://placehold.co/600x400/ff6347/333?text=VW+Golf+2', 'https://placehold.co/600x400/ff6347/333?text=VW+Golf+3', 'https://placehold.co/600x400/ff6347/333?text=VW+Golf+4'],
        title: 'فولكسفاغن غولف 2019',
        price: '$7,500',
        location: 'دمشق', status: 'فعال', year: 2019, mileage: 55000, transmission: 'عادي', fuelType: 'بنزين', condition: 'مستعملة'
    },
    {
        id: 6,
        imageUrls: ['https://placehold.co/600x400/4682b4/fff?text=Mercedes+C200+1'],
        title: 'مرسيدس C200 2020',
        price: '$15,000',
        location: 'طرطوس', status: 'فعال', year: 2020, mileage: 25000, transmission: 'أوتوماتيك', fuelType: 'بنزين', condition: 'مستعملة'
    },
    {
        id: 7,
        imageUrls: ['https://placehold.co/600x400/32cd32/333?text=Geely+Coolray+1', 'https://placehold.co/600x400/32cd32/333?text=Geely+Coolray+2'],
        title: 'جيلي كولراي 2023',
        price: '$9,000',
        location: 'حماة', status: 'فعال', year: 2023, mileage: 5000, transmission: 'أوتوماتيك', fuelType: 'بنزين', condition: 'جديدة'
    },
    {
        id: 8,
        imageUrls: ['https://placehold.co/600x400/daa520/333?text=Nissan+Sunny+1'],
        title: 'نيسان صني 2017',
        price: '$5,000',
        location: 'السويداء', status: 'فعال', year: 2017, mileage: 90000, transmission: 'عادي', fuelType: 'بنزين', condition: 'مستعملة'
    }
];

export const realEstateAdsData = [
    {
        id: 101,
        imageUrls: ['https://placehold.co/600x400/add8e6/333?text=Apartment+1', 'https://placehold.co/600x400/add8e6/333?text=Apartment+2', 'https://placehold.co/600x400/add8e6/333?text=Apartment+3'],
        title: 'شقة للبيع في المالكي',
        price: '$85,000',
        location: 'دمشق، المالكي', status: 'فعال', propertyType: 'شقة', area: 180, bedrooms: 3, bathrooms: 2,
    },
    {
        id: 102,
        imageUrls: ['https://placehold.co/600x400/9acd32/333?text=Villa+1', 'https://placehold.co/600x400/9acd32/333?text=Villa+2'],
        title: 'فيلا للإيجار السنوي في يعفور',
        price: '$4,000 / سنوياً',
        location: 'ريف دمشق، يعفور', status: 'فعال', propertyType: 'فيلا', area: 450, bedrooms: 5, bathrooms: 4,
    },
    {
        id: 103,
        imageUrls: ['https://placehold.co/600x400/d3d3d3/555?text=Shop+1'],
        title: 'محل تجاري في الصالحية',
        price: '$30,000',
        location: 'دمشق، الصالحية', status: 'مؤجر', propertyType: 'محل تجاري', area: 50, bedrooms: 0, bathrooms: 1,
    }
];