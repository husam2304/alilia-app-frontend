// src/pages/StoreRegistration.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
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
import { useLanguage } from '../contexts/LanguageContext';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../service';
import TagInput from '../components/Ui/TagInput';

const Register = () => {
    const [logoPreview, setLogoPreview] = useState(null);
    const [licensePreview, setLicensePreview] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [step, setStep] = useState(1);
    const { register: registerUser, isLoading } = useAuth();
    const { t, currentLanguage, changeLanguage, isChangingLanguage } = useLanguage();
    const [usernameExist, setUsernameExist] = useState(false);
    const [emailExist, setEmailExist] = useState(false);
    const [phoneExist, setPhoneExist] = useState(false);
    const navigate = useNavigate();
    const existUsername = useMutation({
        mutationFn: (userName) => authService.validatUsername(userName),
        onError: () => setUsernameExist(false),
        onSuccess: (data) => setUsernameExist(!data.isAvailable)
    })
    const existEmail = useMutation({
        mutationFn: async (email) => await authService.validatEmail(email),
        onError: () => setEmailExist(false),
        onSuccess: (data) => setEmailExist(!data.isAvailable)
    })
    const existPhone = useMutation({
        mutationFn: async (phone) => await authService.validatPhone(phone),
        onError: () => setPhoneExist(false),
        onSuccess: (data) => setPhoneExist(!data.isAvailable)
    })


    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        setValue
    } = useForm({
        defaultValues: {
            activity: [],
            keywords: []
        }
    });

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
        const registerUserres = await registerUser(data, 'vendor');
        if (registerUserres.success) {
            navigate(`/auth/verfyOtp?userId=${registerUserres.userID}`);
        }
    };

    return (

        <div className="w-full max-w-md">
            <div className="flex items-center justify-end mb-4">
                <button
                    onClick={() => { currentLanguage == "ar" ? changeLanguage('en') : changeLanguage('ar') }}
                    disabled={isChangingLanguage}
                    className={` bg-primary-50 text-primary-600 flex items-center px-4 py-2 text-sm rounded-lg hover:bg-primary-100 transition-colors disabled:opacity-50`}
                >
                    {currentLanguage == "ar" ? t('english') : t('arabic')}
                </button>
            </div>
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
                            onBlur={(e) => {
                                if (e.target.value.trim()) existUsername.mutate(e.target.value);
                            }}
                            error={usernameExist ? t("usernameExist") : null}

                        />

                        <Input
                            label={t('vendorPhone')}
                            icon={Phone}
                            language={currentLanguage}
                            error={phoneExist ? t("phoneExist") : null}

                            type="tel"
                            placeholder={t('vendorPhone')}
                            {...register('vendorPhone', {
                                required: t('required'),
                                pattern: {
                                    value: /^07[789]\d{7}$/,
                                    message: t('invalidPhone')
                                },
                                onBlur: (e) => {
                                    if (e.target.value.trim()) existPhone.mutate(e.target.value);
                                }
                            })}


                            className="w-full border rounded-lg p-3"
                        />

                        <Input
                            error={emailExist ? t("emailExist") : null}
                            label={t('vendorEmail')}
                            icon={Mail}
                            type="email"
                            placeholder={t('vendorEmail')}

                            {...register('vendorEmail', {
                                required: t('required'),
                                onBlur: (e) => {
                                    if (e.target.value.trim()) existEmail.mutate(e.target.value);
                                }
                            })}
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
                            disabled={usernameExist || emailExist}
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

                        {/* <Input
                            label={t('country')}
                            icon={Globe}
                            placeholder={t('country')}
                            {...register('country', { required: t('required') })}
                            className="w-full border rounded-lg p-3"
                        /> */}

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
                            language={currentLanguage}
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

                            <Controller
                                name="activity"
                                control={control}
                                rules={{ required: t("required") }}
                                render={({ field }) => (
                                    <TagInput
                                        label={t("activity")}
                                        placeholder={t("activity")}
                                        value={field.value || []}
                                        onChange={field.onChange}
                                        error={errors.activity?.message}
                                    />
                                )}
                            />


                        </div>

                        {/* Keywords */}
                        <div>
                            <Controller
                                name="keywords"
                                control={control}
                                rules={{ required: t("required") }}
                                render={({ field }) => (
                                    <TagInput
                                        label={t("keywords")}
                                        placeholder={t("keywords")}
                                        value={field.value || []}
                                        onChange={field.onChange}
                                        error={errors.keywords?.message}
                                    />
                                )}
                            />
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

        </div>

    );
};

export default Register;
