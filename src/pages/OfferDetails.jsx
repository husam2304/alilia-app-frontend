import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, Package, DollarSign, Percent, Gift, Image as ImageIcon } from 'lucide-react';
import { offerService } from '../service';
import { useLanguage } from '../contexts/LanguageContext';
import { DataUtils } from '../utils';
import Card from '../components/cards/Card';
import Button from '../components/Ui/Button';
import Badge from '../components/Ui/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const OfferDetails = () => {
    const { offerId } = useParams();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [selectedImage, setSelectedImage] = useState(null);

    const { data: offer, isLoading, error } = useQuery({
        queryKey: ['offerDetails', offerId],
        queryFn: () => offerService.offerDetials(offerId),
        enabled: !!offerId,
        onError: (error) => {
            toast.error(error?.message || t('error'));
        }
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <LoadingSpinner />
            </div>
        );
    }

    if (error || !offer) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        icon={ArrowLeft}
                        onClick={() => navigate('/dashboard/orders')}
                    >
                        {t('back')}
                    </Button>
                </div>
                <Card className="p-8 text-center">
                    <div className="text-red-500 mb-4">
                        <Package className="h-16 w-16 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">{t('offerNotFound')}</h2>
                        <p className="text-gray-600">{t('offerNotFoundMessage')}</p>
                    </div>
                </Card>
            </div>
        );
    }

    const isValidOffer = offer.statusId !== 1; // Assuming statusId 1 means "No Offers"

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        icon={ArrowLeft}
                        onClick={() => navigate('/dashboard/orders')}
                    >
                        {t('back')}
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {t('offerDetailsTitle')}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {t('offerNumber')}: {offer.offerNumber}
                        </p>
                    </div>
                </div>
                <Badge variant={DataUtils.getStatusVariant(offer.statusId, 'offer')}>
                    {DataUtils.formatDeliveryStatus(offer.statusId)}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Offer Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            {t('productDetails')}
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('productName')}
                                </label>
                                <p className="text-lg font-medium text-gray-900">{offer.productName}</p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('productDescription')}
                                </label>
                                <p className="text-gray-900 leading-relaxed">{offer.description}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Pricing Information */}
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            {t('pricingDetails')}
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('originalPrice')}
                                </label>
                                <p className="text-xl font-semibold text-gray-900">
                                    {DataUtils.formatCurrency(offer.price)}
                                </p>
                            </div>
                            
                            {offer.deliveryPrice > 0 && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('deliveryPrice')}
                                    </label>
                                    <p className="text-xl font-semibold text-gray-900">
                                        {DataUtils.formatCurrency(offer.deliveryPrice)}
                                    </p>
                                </div>
                            )}
                            
                            {offer.discountPercentage > 0 && (
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <label className="block text-sm font-medium text-green-700 mb-1">
                                        {t('discount')}
                                    </label>
                                    <p className="text-xl font-semibold text-green-600 flex items-center gap-1">
                                        <Percent className="h-4 w-4" />
                                        {offer.discountPercentage}%
                                    </p>
                                </div>
                            )}
                            
                            <div className="bg-primary-50 p-4 rounded-lg">
                                <label className="block text-sm font-medium text-primary-700 mb-1">
                                    {t('finalPrice')}
                                </label>
                                <p className="text-2xl font-bold text-primary-600">
                                    {DataUtils.formatCurrency(offer.finalPrice)}
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Special Offer */}
                    {offer.specialOfferDto && (offer.specialOfferDto.payCount > 0 || offer.specialOfferDto.getCount > 0) && (
                        <Card className="p-6 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Gift className="h-5 w-5 text-orange-500" />
                                {t('specialOffer')}
                            </h2>
                            
                            <div className="bg-white p-4 rounded-lg">
                                <div className="flex items-center justify-center text-center">
                                    <div className="flex items-center gap-2 text-lg">
                                        <span className="font-semibold text-orange-600">
                                            {t('buy')} {offer.specialOfferDto.payCount}
                                        </span>
                                        <span className="text-gray-500">+</span>
                                        <span className="font-semibold text-green-600">
                                            {t('get')} {offer.specialOfferDto.getCount}
                                        </span>
                                        {offer.specialOfferDto.productName && (
                                            <>
                                                <span className="text-gray-500">من</span>
                                                <span className="font-medium text-blue-600">
                                                    {offer.specialOfferDto.productName}
                                                </span>
                                            </>
                                        )}
                                        {offer.specialOfferDto.discountPercentage > 0 && (
                                            <>
                                                <span className="text-gray-500">بخصم</span>
                                                <span className="font-semibold text-red-600">
                                                    {offer.specialOfferDto.discountPercentage}%
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Offer Images */}
                    {offer.mediaUrls && offer.mediaUrls.length > 0 && (
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <ImageIcon className="h-5 w-5" />
                                {t('offerImages')}
                            </h2>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {offer.mediaUrls.map((url, index) => (
                                    <div
                                        key={index}
                                        className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                                        onClick={() => setSelectedImage(url)}
                                    >
                                        <img
                                            src={url}
                                            alt={`${t('offerImage')} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = '/placeholder-image.png';
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Validity Information */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            {t('validityInfo')}
                        </h3>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('validUntil')}
                                </label>
                                <p className="text-lg font-medium text-gray-900">
                                    {DataUtils.formatDate(offer.validUntil)}
                                </p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('offerStatus')}
                                </label>
                                <Badge variant={DataUtils.getStatusVariant(offer.statusId, 'offer')}>
                                    {DataUtils.formatDeliveryStatus(offer.statusId)}
                                </Badge>
                            </div>
                        </div>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {t('actions')}
                        </h3>
                        
                        <div className="space-y-3">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => navigate('/dashboard/orders')}
                            >
                                {t('backToOrders')}
                            </Button>
                            
                            {isValidOffer && (
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => {
                                        // Add print functionality or other actions
                                        window.print();
                                    }}
                                >
                                    {t('printOffer')}
                                </Button>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-4xl max-h-full">
                        <img
                            src={selectedImage}
                            alt={t('offerImage')}
                            className="max-w-full max-h-full object-contain rounded-lg"
                        />
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OfferDetails;