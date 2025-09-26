import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Image, Plus, Star } from 'lucide-react';
import Button from '../components/Ui/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { DataUtils } from '../utils';
import toast from 'react-hot-toast';
import { vendorService } from '../service';
import { useLanguage } from '../contexts/LanguageContext';

const PriceQuote = () => {
    const { OrderId } = useParams();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
        defaultValues: {
            offerDate: new Date().toISOString().split('T')[0],
            validityDate: '',
            productDescription: '',
            productName: '',
            productPrice: '',
            discountType: 'none',
            discountValue: '',
            payCount: '',
            getCount: '',
            specialDiscountValue: '',
            extraProduct: '',


        }
    });

    const [productImages, setProductImages] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const [orderInfo, setOrderInfo] = useState({
        date: '  ',
        // time: '11::50',
        orderNumber: '',
        product: '',
        location: ''
    });
    useEffect(() => {
        loadOrderData();
    }, [OrderId]);
    const loadOrderData = async () => {
        try {
            // setLoading(true);
            const response = await vendorService.getOrderDetails(OrderId);

            if (response.createdAt) {
                const formattedOrder = {
                    date: DataUtils.formatDate(response.createdAt),
                    // time: '11:35:50',
                    orderNumber: response.orderNumber,
                    product: response.productName,
                    description: response.description
                };
                console.log('Formatted Order:', formattedOrder);
                setOrderInfo(formattedOrder);
            } else {
                setOrderInfo({});
            }
        } catch (error) {
            // Load fallback data
            // setOrders(getFallbackOrders());
        } finally {
            // setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();

            // Backend expects ExpierdIn = validity date
            formData.append("ExpierdIn", data.validityDate);

            // Product info
            formData.append("ProductName", data.productName || "");
            formData.append("ProductDescription", data.productDescription);
            formData.append("Price", data.productPrice);


            // Discounts (example handling)
            if (data.discountType === "percentage") {
                formData.append("DiscountPercentage", data.discountValue || 0);
            } else if (data.discountType === "buy") {
                formData.append("SpecialOffer.PayCount", data.payCount || 1);
                formData.append("SpecialOffer.GetCount", data.getCount || 1);
                formData.append("SpecialOffer.ProductName", data.extraProduct || "");
                formData.append("SpecialOffer.DiscountPercentage", data.specialDiscountValue);
            }

            // Upload images
            productImages.forEach((img) => {
                formData.append("Media", img.file);
            });

            // Call API
            const response = await vendorService.createOffer(OrderId, formData);
            console.log("Offer created successfully:", response);
            toast.success(t('success') + " ✅");
            navigate('/dashboard/orders');
        } catch (error) {
        }
    };


    const handleImageUpload = (files) => {
        const newImages = Array.from(files).map(file => ({
            id: Date.now() + Math.random(),
            file: file,
            url: URL.createObjectURL(file),
            name: file.name
        }));
        setProductImages(prev => [...prev, ...newImages]);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageUpload(e.dataTransfer.files);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{t('priceQuoteTitle')}</h1>

                </div>
            </div>

            {/* المحتوى الرئيسي */}
            <div className="flex gap-6">
                {/* النموذج - الجانب الأيمن */}
                <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* تاريخ العرض */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                                    {t('offerDate')}
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        {...register('offerDate', { required: t('offerDate') + ' مطلوب' })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#931158] focus:border-[#931158] text-right"
                                        disabled
                                    />
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                </div>
                                {errors.offerDate && (
                                    <p className="mt-1 text-sm text-red-600 text-right">{errors.offerDate.message}</p>
                                )}
                            </div>

                            {/* رقم العرض */}
                            {/* <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                                        رقم العرض
                                    </label>
                                    <input
                                        type="text"
                                        {...register('offerNumber', { required: 'رقم العرض مطلوب' })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#931158] focus:border-[#931158] text-right"
                                        placeholder="30/4/2020"
                                    />
                                    {errors.offerNumber && (
                                        <p className="mt-1 text-sm text-red-600 text-right">{errors.offerNumber.message}</p>
                                    )}
                                </div> */}
                        </div>

                        {/* صالحية العرض */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                                {t('validityDate')}
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    {...register('validityDate', { required: t('validityDate') + ' مطلوب' })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#931158] focus:border-[#931158] text-right"
                                />
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                            {errors.validityDate && (
                                <p className="mt-1 text-sm text-red-600 text-right">{errors.validityDate.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                                {t('productName')}
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="productName"
                                    name="productName"
                                    {...register('productName')}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#931158] focus:border-[#931158] text-right resize-none"
                                />
                            </div>
                        </div>
                        {/* وصف المنتج */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                                {t('productDescription')}
                            </label>
                            <textarea
                                {...register('productDescription', { required: t('productDescription') + ' مطلوب' })}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#931158] focus:border-[#931158] text-right resize-none"
                                placeholder=""
                            />
                            {errors.productDescription && (
                                <p className="mt-1 text-sm text-red-600 text-right">{errors.productDescription.message}</p>
                            )}
                        </div>

                        {/* إضافة صور المنتج */}
                        <div className="mb-6">
                            <div className="flex items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700 text-right">
                                    {t('addProductImages')}
                                </label>
                                <Star className="h-4 w-4 text-[#931158] mr-2" />
                            </div>

                            {/* منطقة رفع الصور */}
                            <div className="grid grid-cols-5 gap-4">
                                {[1, 2, 3, 4, 5].map((index) => (
                                    <div
                                        key={index}
                                        className={`aspect-square border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50 hover:border-[#931158] transition-colors cursor-pointer relative`}
                                        onClick={() => document.getElementById(`file-input-${index}`).click()}
                                    >
                                        <div className="text-center">
                                            <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                            <Plus className="h-4 w-4 text-gray-400 mx-auto" />
                                        </div>
                                        <input
                                            id={`file-input-${index}`}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleImageUpload(e.target.files)}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* عرض الصور المرفوعة */}
                            {productImages.length > 0 && (
                                <div className="mt-4 grid grid-cols-5 gap-4">
                                    {productImages.map((img) => (
                                        <div key={img.id} className="relative">
                                            <img
                                                src={img.url}
                                                alt={img.name}
                                                className="w-full h-24 object-cover rounded-lg border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setProductImages(prev => prev.filter(p => p.id !== img.id))}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>

                        {/* سعر المنتج */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                                {t('productPrice')}
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    {...register('productPrice', { required: t('productPrice') + ' مطلوب' })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#931158] focus:border-[#931158] text-right"
                                    placeholder="200"
                                />
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                                    $
                                </span>
                            </div>
                            {errors.productPrice && (
                                <p className="mt-1 text-sm text-red-600 text-right">{errors.productPrice.message}</p>
                            )}
                        </div>

                        {/* خصومات */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-4 text-right">
                                {t('discounts')}
                            </label>

                            <div className="space-y-4">
                                {/* اشتري واحصل على خصم */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="buyDiscount"
                                            name="discountType"
                                            {...register('discountType')}
                                            value="buy"
                                            className="h-4 w-4 text-[#931158] focus:ring-[#931158] border-gray-300"
                                        />
                                        <label htmlFor="buyDiscount" className="mr-2 text-sm text-gray-700">
                                            {t('buyDiscount')}
                                        </label>
                                        <select {...register('buyCount')} className="mx-2 px-3 py-1 border border-gray-300 rounded text-sm">
                                            <option value={1}>1</option>
                                            <option value={2}>2</option>
                                            <option value={3}>3</option>
                                        </select>
                                        <span className="text-sm text-gray-600 mx-1">{t('getDiscount')}</span>
                                        <input
                                            type="text"
                                            id="extraProduct"
                                            name="extraProduct"
                                            {...register('extraProduct')}
                                            className="mx-2 w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                                        />
                                        <span className="text-sm text-gray-600 mx-1">عدد</span>

                                        <select {...register('getCount')} className="mx-2 px-3 py-1 border border-gray-300 rounded text-sm">
                                            <option value={1}>1</option>
                                            <option value={2}>2</option>
                                            <option value={3}>3</option>
                                        </select>
                                        <span className="text-sm text-gray-600">خصم بنسبة</span>
                                        <input
                                            type="number"
                                            placeholder="50"
                                            min={0}
                                            max={100}
                                            {...register('specialDiscountValue')}
                                            className="mx-2 w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                                        />
                                    </div>
                                </div>

                                {/* خصم بنسبة */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="percentageDiscount"
                                            name="discountType"
                                            value="percentage"
                                            {...register('discountType')}
                                            className="h-4 w-4 text-[#931158] focus:ring-[#931158] border-gray-300"
                                        />
                                        <label htmlFor="percentageDiscount" className="mr-2 text-sm text-gray-700">
                                            {t('percentageDiscount')}
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="50"
                                            {...register('discountValue')}
                                            className="mx-2 w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                                        />
                                        <span className="text-sm text-gray-600">%</span>
                                    </div>
                                </div>

                                {/* لا يوجد */}
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="noDiscount"
                                        name="discountType"
                                        value="none"
                                        {...register('discountType')}
                                        defaultChecked
                                        className="h-4 w-4 text-[#931158] focus:ring-[#931158] border-gray-300"
                                    />
                                    <label htmlFor="noDiscount" className="mr-2 text-sm text-gray-700">
                                        {t('noDiscount')}
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* زر إنشاء العرض */}
                        <div className="pt-6">
                            <Button
                                type="submit"
                                className="w-full bg-[#931158] hover:bg-[#7a0e47] text-white py-3 px-6 rounded-md font-medium transition-colors"
                            >
                                {t('createOfferButton')}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* معلومات الطلب - الجانب الأيسر */}
                <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('orderInfo')}</h2>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">{t('date')}:</span>
                            <span className="font-medium">{orderInfo.date}</span>
                        </div>
                        {/* <div className="flex justify-between">
                                <span className="text-gray-600">{t('time')}:</span>
                                <span className="font-medium">{orderInfo.time}</span>
                            </div> */}
                        <div className="flex justify-between">
                            <span className="text-gray-600">{t('orderNumber')}:</span>
                            <span className="font-medium">{orderInfo.orderNumber}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">{t('product')}:</span>
                            <span className="font-medium">{orderInfo.product}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">{t('details')}:</span>
                            <span className="font-medium">{orderInfo.description}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriceQuote;