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
import { useLanguage } from '../contexts/LanguageContext';

const Register = () => {
    const [logoPreview, setLogoPreview] = useState(null);
    const [licensePreview, setLicensePreview] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [step, setStep] = useState(1);
    const { register: registerUser, isLoading } = useAuth();
    const { t, currentLanguage, changeLanguage, isChangingLanguage } = useLanguage();
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

        if (file.size > 5 * 1024 * 1024) {
            toast.error(t('fileSizeError'));
            return;
        }

        if (!file.type.startsWith('image/')) {
            toast.error(t('fileTypeError'));
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
            toast.error(t('passwordMismatch'));
            return;
        }
        await registerUser(data, 'vendor');
        if (registerUser.success) {
            navigate('/auth/login');
        }
    };

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden" >
            {/* Right Side - Form */}
            <div className="md:w-2/3 p-8 lg:p-12 overflow-scroll">
                <div className="max-w-lg mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="text-center mb-4">
                            <div className="flex justify-center mb-3">
                                <img src={Logo} alt="ALIA Logo" className="w-20 h-20" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {t('registerTitle')}
                        </h1>
                        <p className="text-gray-600">{t('registerSubtitle')}</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {step === 1 && (
                            <>
                                <Input
                                    label={t('vendorName')}
                                    icon={User}
                                    placeholder={t('vendorName')}
                                    {...register('vendorName', { required: t('required') })}
                                />

                                <Input
                                    label={t('vendorPhone')}
                                    icon={Phone}
                                    type="tel"
                                    placeholder={t('vendorPhone')}
                                    {...register('vendorPhone', {
                                        required: t('required'),
                                        pattern: {
                                            value: /^07[789]\d{7}$/,
                                            message: t('invalidPhone')
                                        }
                                    })}
                                    className="w-full border rounded-lg p-3"
                                />

                                <Input
                                    label={t('vendorEmail')}
                                    icon={Mail}
                                    type="email"
                                    placeholder={t('vendorEmail')}
                                    {...register('vendorEmail', { required: t('required') })}
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
                                                alt="Preview"
                                                className="h-24 w-24 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <Camera className="w-8 h-8 text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-500">
                                                    {t('chooseProfileImage')}
                                                </p>
                                            </div>
                                        )}
                                    </label>
                                </div>

                                <Input
                                    label={t('password')}
                                    icon={Lock}
                                    type="password"
                                    placeholder={t('password')}
                                    {...register('password', { required: t('required') })}
                                    className="w-full border rounded-lg p-3"
                                />

                                <Input
                                    label={t('confirmPassword')}
                                    icon={Lock}
                                    type="password"
                                    placeholder={t('confirmPassword')}
                                    {...register('confirmPassword', { required: t('required') })}
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
                                    {t('continue')}
                                </Button>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <Input
                                    label={t('storeName')}
                                    icon={Store}
                                    placeholder={t('storeName')}
                                    {...register('storeName', { required: t('required') })}
                                    error={errors.storeName?.message}
                                />

                                <Input
                                    label={t('commercialRegister')}
                                    icon={CreditCard}
                                    placeholder={t('commercialRegister')}
                                    {...register('commercialNumber', { required: t('required') })}
                                    className="w-full border rounded-lg p-3"
                                />

                                <Input
                                    label={t('country')}
                                    icon={Globe}
                                    placeholder={t('country')}
                                    {...register('country', { required: t('required') })}
                                    className="w-full border rounded-lg p-3"
                                />

                                <Input
                                    label={t('city')}
                                    icon={Globe}
                                    placeholder={t('city')}
                                    {...register('city', { required: t('required') })}
                                    className="w-full border rounded-lg p-3"
                                />

                                <Input
                                    label={t('address')}
                                    icon={MapPin}
                                    placeholder={t('address')}
                                    {...register('address', { required: t('required') })}
                                    error={errors.address?.message}
                                />

                                <Input
                                    label={t('vendorEmail')}
                                    icon={Mail}
                                    type="email"
                                    placeholder={t('vendorEmail')}
                                    {...register('email', { required: t('required') })}
                                    className="w-full border rounded-lg p-3"
                                />

                                <Input
                                    label={t('vendorPhone')}
                                    icon={Phone}
                                    type="tel"
                                    placeholder={t('vendorPhone')}
                                    {...register('phone', {
                                        required: t('required'),
                                        pattern: {
                                            value: /^07[789]\d{7}$/,
                                            message: t('invalidPhone')
                                        }
                                    })}
                                    className="w-full border rounded-lg p-3"
                                />

                                <Input
                                    label={t('website')}
                                    icon={Globe}
                                    type="text"
                                    placeholder={t('website')}
                                    {...register('website', {
                                        required: t('required'),
                                        pattern: {
                                            value: /^(ftp|http|https):\/\/[^ "]+$/,
                                            message: t('invalidWebsite')
                                        }
                                    })}
                                    className="w-full border rounded-lg p-3"
                                />

                                {/* Logo Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('logo')}
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
                                                    <p className="text-sm text-gray-500">
                                                        {t('chooseLogo')}
                                                    </p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                {/* License Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('licenseImage')}
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
                                                    <p className="text-sm text-gray-500">
                                                        {t('chooseLicense')}
                                                    </p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                {/* Activity */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('activity')}
                                    </label>
                                    <textarea
                                        rows={4}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical"
                                        placeholder={t('activity')}
                                        {...register('activity', { required: t('required') })}
                                    />
                                    {errors.activity && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.activity.message}
                                        </p>
                                    )}
                                </div>

                                {/* Keywords */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('keywords')}
                                    </label>
                                    <textarea
                                        rows={4}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical"
                                        placeholder={t('keywords')}
                                        {...register('keywords', { required: t('required') })}
                                    />
                                    {errors.keywords && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.keywords.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-between mt-6">
                                    <Button
                                        type="button"
                                        variant="primary"
                                        size="lg"
                                        className="w-1/3"
                                        disabled={isLoading}
                                        onClick={() => setStep(1)}
                                    >
                                        {t('back')}
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        className="w-1/2"
                                        loading={isLoading}
                                    >
                                        {t('register')}
                                    </Button>
                                </div>
                            </>
                        )}
                    </form>

                    {/* Login Link */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            {t('haveAccount')}{' '}
                            <Link
                                to="/auth/login"
                                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                            >
                                {t('loginLink')}
                            </Link>
                        </p>
                    </div>
                    <div className="flex items-center  justify-end mt-6">
                        <button
                            onClick={() => { currentLanguage == "ar" ? changeLanguage('en') : changeLanguage('ar') }}
                            disabled={isChangingLanguage}
                            className={` bg-primary-50 text-primary-600 flex items-center px-4 py-2 text-sm  text-right disabled:opacity-50`}
                        >
                            {currentLanguage == "ar" ? t('english') : t('arabic')}
                        </button>
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
