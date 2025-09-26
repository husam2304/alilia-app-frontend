// src/pages/StoreRegistration.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
    Store,
    MapPin,
    Phone,
    Camera,
    FileText,
    User,
    Mail,
    Lock,
    CreditCard,
    Globe

} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Ui/Button';
import Input from '../components/Ui/Input';
import toast from 'react-hot-toast';
import Logo from '../assets/images/logo.png';
import LoginImage from '../assets/images/login.png';
const Register = () => {
    const [logoPreview, setLogoPreview] = useState(null);
    const [licensePreview, setLicensePreview] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [step, setStep] = useState(1);
    const { register: registerUser, isLoading } = useAuth();

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm();

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('يرجى اختيار ملف صورة صالح');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            if (type === 'logo') {
                setLogoPreview(e.target.result);
                setValue('logo', file);
            } else if (type === 'image') {
                setImagePreview(e.target.result);
                setValue('image', file);
            } else {
                setLicensePreview(e.target.result);
                setValue('license', file);
            }
        };
        reader.readAsDataURL(file);
    };

    const onSubmit = async (data) => {
        if (data.password !== data.confirmPassword) {
            toast.error('كلمتا المرور غير متطابقتين');
            return;
        }
        try {
            await registerUser(data, 'vendor');
            if (registerUser.success) {
                navigate('/auth/login');
            }
        } catch (error) {
            // Error handled by AuthContext
        }
    };

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden" dir="rtl">

            {/* Right Side - Form */}
            <div className="md:w-2/3 p-8 lg:p-12 overflow-scroll">
                <div className="max-w-lg mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="text-center mb-4">
                            <div className="flex justify-center mb-3">
                                <img
                                    src={Logo}
                                    alt="ALIA Logo"
                                    className="w-20 h-20"
                                />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            تسجيل في التطبيق
                        </h1>
                        <p className="text-gray-600">
                            قم بتسجيل البيانات الخاصة بالمؤسسة
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {step === 1 && (
                            <>
                                <Input
                                    label="تسجيل كبائع"
                                    icon={User}
                                    placeholder="اسم البائع"
                                    {...register("vendorName", { required: "مطلوب" })}
                                />


                                <Input
                                    label="رقم الهاتف"
                                    icon={Phone}
                                    type="tel"
                                    placeholder="رقم الهاتف"
                                    {...register("vendorPhone", { required: "مطلوب" })}
                                    className="w-full border rounded-lg p-3"
                                />
                                <Input
                                    label="البريد الإلكتروني"
                                    icon={Mail}
                                    type="email"
                                    placeholder="البريد الإلكتروني"
                                    {...register("vendorEmail", { required: "مطلوب" })}
                                    className="w-full border rounded-lg p-3"
                                />
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'image')}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="image Preview"
                                                className="h-24 w-24 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <Camera className="w-8 h-8 text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-500">اختر صورة شخصية</p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                                <Input
                                    label="كلمة المرور"
                                    icon={Lock}
                                    type="password"
                                    placeholder="كلمة المرور"
                                    {...register("password", { required: "مطلوب" })}
                                    className="w-full border rounded-lg p-3"
                                />
                                <Input
                                    label="تأكيد كلمة المرور"
                                    icon={Lock}
                                    type="password"
                                    placeholder="تأكيد كلمة المرور"
                                    {...register("confirmPassword", { required: "مطلوب" })}
                                    className="w-full border rounded-lg p-3"
                                />

                                <Button
                                    type="button"
                                    variant="primary"
                                    size="lg"
                                    className="w-full"
                                    loading={isLoading}
                                    onClick={() => setStep(2)}
                                >
                                    متابعة
                                </Button>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                {/* Store Name */}
                                <Input
                                    label="اسم المنشأة"
                                    icon={Store}
                                    placeholder="أدخل اسم المنشأة"
                                    {...register('storeName', {
                                        required: 'اسم المنشأة مطلوب',
                                        minLength: {
                                            value: 2,
                                            message: 'اسم المنشأة قصير جداً'
                                        }
                                    })}
                                    error={errors.storeName?.message}
                                />
                                <Input
                                    label="السجل التجاري"
                                    icon={CreditCard}
                                    placeholder="السجل التجاري"
                                    {...register("commercialNumber", { required: "مطلوب" })}
                                    className="w-full border rounded-lg p-3"
                                />
                                <Input
                                    label="الدولة"
                                    icon={Globe}
                                    placeholder="الدولة"
                                    {...register("country", { required: "مطلوب" })}
                                    className="w-full border rounded-lg p-3"
                                />
                                <Input
                                    label="المدينة"
                                    icon={Globe}
                                    placeholder="المدينة"
                                    {...register("city", { required: "مطلوب" })}
                                    className="w-full border rounded-lg p-3"
                                />
                                {/* Address */}
                                <Input
                                    label="العنوان"
                                    icon={MapPin}
                                    placeholder="أدخل العنوان"
                                    {...register('address', {
                                        required: 'العنوان مطلوب',
                                        minLength: {
                                            value: 10,
                                            message: 'العنوان قصير جداً'
                                        }
                                    })}
                                    error={errors.address?.message}
                                />

                                {/* Phone */}
                                <Input
                                    label="البريد الإلكتروني"
                                    icon={Mail}
                                    type="email"
                                    placeholder="البريد الإلكتروني"
                                    {...register("email", { required: "مطلوب" })}
                                    className="w-full border rounded-lg p-3"
                                />
                                <Input
                                    label="رقم الهاتف"
                                    icon={Phone}
                                    type="tel"
                                    placeholder="رقم الهاتف"
                                    {...register("phone", {
                                        required: 'رقم الجوال مطلوب',
                                        pattern: {
                                            message: 'رقم الجوال غير صحيح (9 أرقام)'
                                        }
                                    })}
                                    className="w-full border rounded-lg p-3"
                                />
                                <Input
                                    label="الموقع الالكتروني"
                                    icon={Globe}
                                    type="text"
                                    placeholder="الموقع الالكتروني"
                                    {...register("website", {
                                        required: '  الموقع الالكتروني مطلوب',
                                        pattern: {
                                            value: /^(ftp|http|https):\/\/[^ "]+$/,
                                            message: 'الموقع الالكتروني غير صحيح'
                                        }
                                    })}
                                    className="w-full border rounded-lg p-3"
                                />
                                {/* Logo Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        الشعار
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'logo')}
                                            className="hidden"
                                            id="logo-upload"
                                        />
                                        <label
                                            htmlFor="logo-upload"
                                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                                        >
                                            {logoPreview ? (
                                                <img
                                                    src={logoPreview}
                                                    alt="Logo Preview"
                                                    className="h-24 w-24 object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <Camera className="w-8 h-8 text-gray-400 mb-2" />
                                                    <p className="text-sm text-gray-500">اختر صورة الشعار</p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                {/* License Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        صورة السجل
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'license')}
                                            className="hidden"
                                            id="license-upload"
                                        />
                                        <label
                                            htmlFor="license-upload"
                                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                                        >
                                            {licensePreview ? (
                                                <img
                                                    src={licensePreview}
                                                    alt="License Preview"
                                                    className="h-24 w-24 object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <FileText className="w-8 h-8 text-gray-400 mb-2" />
                                                    <p className="text-sm text-gray-500">اختر صورة السجل</p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                {/* Activity */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        نشاط المؤسسة
                                    </label>
                                    <textarea
                                        rows={4}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical"
                                        placeholder="أدخل نشاطات المؤسسة مفصولة بفواصل"
                                        {...register('activity', { required: 'نشاط المؤسسة مطلوب' })}
                                    />
                                    {errors.activity && (
                                        <p className="mt-2 text-sm text-red-600">{errors.activity.message}</p>
                                    )}
                                </div>

                                {/* Keywords */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        كلمات دلالة
                                    </label>
                                    <textarea
                                        rows={4}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical"
                                        placeholder="أدخل الكلمات المفتاحية مفصولة بفواصل"
                                        {...register('keywords', { required: 'الكلمات الدلالية مطلوبة' })}
                                    />
                                    {errors.keywords && (
                                        <p className="mt-2 text-sm text-red-600">{errors.keywords.message}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-between mt-6">
                                    <Button
                                        type="button"
                                        variant="primary"
                                        size="lg"
                                        className="w-1/3"
                                        loading={isLoading}
                                        onClick={() => setStep(1)}
                                    >
                                        الرجوع
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        className="w-1/2"
                                        loading={isLoading}
                                    >
                                        التسجيل
                                    </Button>
                                </div>
                            </>
                        )}
                    </form>

                    {/* Login Link */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            لديك حساب بالفعل؟{' '}
                            <Link
                                to="/auth/login"
                                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                            >
                                تسجيل الدخول
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Left Side - Image */}
            <div className="hidden md:flex md:w-1/2 relative">
                <img
                    src={LoginImage}
                    alt="CANDID Store"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>

        </div>
    );
};

export default Register;

// src/pages/AdminRegistration.jsx
