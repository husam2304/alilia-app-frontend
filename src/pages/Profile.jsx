import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
    User,
    Mail,
    Phone,
    Store,
    MapPin,
    Globe,
    Camera,
    FileText,
    Save,
    CreditCard
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { profileService } from '../service';
import { FormUtils } from '../utils';
import Button from '../components/Ui/Button';
import Input from '../components/Ui/Input';
import TagInput from '../components/Ui/TagInput';
import Card from '../components/cards/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [logoPreview, setLogoPreview] = useState(null);
    const [licensePreview, setLicensePreview] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        setValue,
        reset
    } = useForm({
        defaultValues: {
            activity: [],
            keywords: []
        }
    });

    // Fetch profile data based on user role
    const { data: profileData, isLoading: isLoadingProfile } = useQuery({
        queryKey: ['profile', user?.userRole],
        queryFn: () => {
            if (user?.userRole === 'Vendor') {
                return profileService.getVendorProfile();
            } else if (user?.userRole === 'Admin') {
                return profileService.getAdminProfile();
            }
            return null;
        },
        enabled: !!user?.userRole,

    });

    // Update profile mutation
    const updateProfileMutation = useMutation({
        mutationFn: (formData) => {
            if (user?.userRole === 'Vendor') {
                const vendorFormData = FormUtils.createVendorProfileFormData(formData);
                return profileService.updateVendorProfile(vendorFormData);
            } else if (user?.userRole === 'Admin') {
                const adminData = FormUtils.createAdminProfileData(formData);
                return profileService.updateAdminProfile(adminData);
            }
            throw new Error('Invalid user role');
        },
        onSuccess: () => {
            toast.success(t('profileUpdateSuccess'));
        },
        onError: (error) => {
            toast.error(error?.message || t('profileUpdateError'));
        }
    });

    // Populate form with fetched data

    useEffect(() => {

        const populateForm = (data) => {
            if (user?.userRole === 'Vendor' && data.vendor && data.facility) {
                setValue('vendorName', data.vendor.username || '');
                setValue('vendorEmail', data.vendor.email || '');
                setValue('vendorPhone', data.vendor.phoneNumber || '');
                setValue('storeName', data.facility.name || '');
                setValue('commercialNumber', data.facility.commercialRegister || '');
                setValue('city', data.facility.city || '');
                setValue('address', data.facility.address || '');
                setValue('email', data.facility.email || '');
                setValue('phone', data.facility.phone || '');
                setValue('website', data.facility.website || '');
                setValue('activity', data.facility.activities || []);
                setValue('keywords', data.facility.keywords || []);

                // Set image previews
                if (data.vendor.imageUrl) {
                    setImagePreview(data.vendor.imageUrl);
                }
                if (data.facility.logoUrl) {
                    setLogoPreview(data.facility.logoUrl);
                }
                if (data.facility.commercialRegisterImageUrl) {
                    setLicensePreview(data.facility.commercialRegisterImageUrl);
                }
            } else if (user?.userRole === 'Admin' && data) {
                setValue('adminName', data.username || '');
                setValue('email', data.email || '');
                setValue('phone', data.phoneNumber || '');
            }
        };
        if (profileData) {
            populateForm(profileData);
        }
    }, [profileData, setValue, user?.userRole]);
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
        try {
            await updateProfileMutation.mutateAsync(data);
        } catch (error) {
            console.error('Profile update error:', error);
        }
    };

    if (isLoadingProfile) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{t('profileTitle')}</h1>
                    <p className="text-gray-600 mt-1">
                        {t('profileSubtitle')}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {user?.userRole === 'Vendor' ? (
                    <>
                        {/* Personal Information */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <User className="h-5 w-5" />
                                {t('personalInfo')}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label={t('vendorName')}
                                    icon={User}
                                    placeholder={t('vendorName')}
                                    {...register('vendorName', { required: t('required') })}
                                    error={errors.vendorName?.message}
                                    disabled
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
                                    error={errors.vendorPhone?.message}
                                    disabled
                                />

                                <Input
                                    label={t('vendorEmail')}
                                    icon={Mail}
                                    type="email"
                                    placeholder={t('vendorEmail')}
                                    {...register('vendorEmail', { required: t('required') })}
                                    error={errors.vendorEmail?.message}
                                    disabled
                                />

                                {/* Profile Image */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('profileImage')}
                                    </label>
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
                                </div>
                            </div>
                        </Card>

                        {/* Store Information */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <Store className="h-5 w-5" />
                                {t('storeInfo')}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    error={errors.commercialNumber?.message}
                                />

                                <Input
                                    label={t('city')}
                                    icon={Globe}
                                    placeholder={t('city')}
                                    {...register('city', { required: t('required') })}
                                    error={errors.city?.message}
                                />

                                <Input
                                    label={t('address')}
                                    icon={MapPin}
                                    placeholder={t('address')}
                                    {...register('address', { required: t('required') })}
                                    error={errors.address?.message}
                                />

                                <Input
                                    label={t('email')}
                                    icon={Mail}
                                    type="email"
                                    placeholder={t('email')}
                                    {...register('email', { required: t('required') })}
                                    error={errors.email?.message}
                                />

                                <Input
                                    label={t('phone')}
                                    icon={Phone}
                                    type="tel"
                                    placeholder={t('phone')}
                                    {...register('phone', {
                                        required: t('required'),
                                        pattern: {
                                            value: /^07[789]\d{7}$/,
                                            message: t('invalidPhone')
                                        }
                                    })}
                                    error={errors.phone?.message}
                                />

                                <Input
                                    label={t('website')}
                                    icon={Globe}
                                    type="text"
                                    placeholder={t('website')}
                                    {...register('website', {
                                        pattern: {
                                            value: /^(ftp|http|https):\/\/[^ "]+$/,
                                            message: t('invalidWebsite')
                                        }
                                    })}
                                    error={errors.website?.message}
                                />
                            </div>

                            {/* Logo Upload */}
                            <div className="mt-6">
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
                            <div className="mt-6">
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
                            <div className="mt-6">
                                <Controller
                                    name="activity"
                                    control={control}
                                    render={({ field }) => (
                                        <TagInput
                                            label={t("activity")}
                                            placeholder={t("activity")}
                                            value={field.value || []}
                                            onChange={field.onChange}
                                            error={errors.activity?.message}
                                            allowExcelUpload={true}
                                        />
                                    )}
                                />
                            </div>

                            {/* Keywords */}
                            <div className="mt-6">
                                <Controller
                                    name="keywords"
                                    control={control}
                                    render={({ field }) => (
                                        <TagInput
                                            label={t("keywords")}
                                            placeholder={t("keywords")}
                                            value={field.value || []}
                                            onChange={field.onChange}
                                            error={errors.keywords?.message}
                                            allowExcelUpload={true}
                                        />
                                    )}
                                />
                            </div>
                        </Card>
                    </>
                ) : (
                    /* Admin Profile */
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <User className="h-5 w-5" />
                            {t('personalInfo')}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label={t('adminName')}
                                icon={User}
                                placeholder={t('adminName')}
                                {...register('adminName', { required: t('required') })}
                                error={errors.adminName?.message}
                                disabled
                            />

                            <Input
                                label={t('email')}
                                icon={Mail}
                                type="email"
                                placeholder={t('email')}
                                {...register('email', { required: t('required') })}
                                error={errors.email?.message}
                                disabled
                            />

                            <Input
                                label={t('phone')}
                                icon={Phone}
                                type="tel"
                                placeholder={t('phone')}
                                {...register('phone', {
                                    required: t('required'),
                                    pattern: {
                                        value: /^07[789]\d{7}$/,
                                        message: t('invalidPhone')
                                    }
                                })}
                                error={errors.phone?.message}
                                disabled
                            />
                        </div>
                    </Card>
                )}

                {/* Save Button */}
                {user?.userRole === 'Vendor' && (
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            icon={Save}
                            loading={updateProfileMutation.isPending}
                            className="min-w-[200px]"
                        >
                            {t('saveChanges')}
                        </Button>
                    </div>)}
            </form>
        </div>
    );
};

export default Profile;