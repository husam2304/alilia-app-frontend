import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CircleCheck as CheckCircle, Circle as XCircle, Eye, RefreshCw, Package, User, Phone, MapPin, Calendar, DollarSign } from 'lucide-react';
import { adminService } from '../service';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { DataUtils } from '../utils';
import Card from '../components/cards/Card';
import Button from '../components/Ui/Button';
import Badge from '../components/Ui/Badge';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import confirmToast from '../components/toast/ConfirmToast';

const AcceptOffers = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [showCustomerModal, setShowCustomerModal] = useState(false);

    // Redirect non-vendors
    useEffect(() => {
        if (user && user.userRole !== 'Admin') {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    // Fetch offers to manage
    const {
        data: offersData,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['offersToManage', currentPage, rowsPerPage],
        queryFn: () => adminService.getOffersToManage(currentPage, rowsPerPage),
        enabled: user?.userRole === 'Admin',
    });

    // Accept offer mutation
    const closeOrder = useMutation({
        mutationFn: (orderId) => adminService.closeOrder(orderId),
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries(['offersToManage']);
        },
        onError: (error) => {
            toast.error(error?.message || t('offerAcceptError'));
        }
    });

    // Mark as delivered mutation
    const markAsDelivered = useMutation({
        mutationFn: (offerId) => adminService.markOfferAsDelivered(offerId),
        onSuccess: (data) => {
            toast.success(data?.message || t('offerMarkedAsDelivered'));
            queryClient.invalidateQueries(['offersToManage']);
        },
        onError: (error) => {
            toast.error(error?.message || t('markAsDeliveredError'));
        }
    });

    // Mark as completed mutation
    const markAsCompleted = useMutation({
        mutationFn: (offerId) => adminService.markOfferAsCompleted(offerId),
        onSuccess: (data) => {
            toast.success(data?.message || t('offerMarkedAsCompleted'));
            queryClient.invalidateQueries(['offersToManage']);
        },
        onError: (error) => {
            toast.error(error?.message || t('markAsCompletedError'));
        }
    });



    const handleAcceptOffer = async (orderId) => {
        const confirmed = await confirmToast(t('closeAcceptOffer'));

        if (!confirmed) return;
        if (confirmed) {
            await closeOrder.mutateAsync(orderId);
        }
    };

    const handleMarkAsDelivered = async (offerId) => {
        const confirmed = await confirmToast(t('confirmMarkAsDelivered'));
        if (confirmed) {
            await markAsDelivered.mutateAsync(offerId);
        }
    };

    const handleMarkAsCompleted = async (offerId) => {
        const confirmed = await confirmToast(t('confirmMarkAsCompleted'));
        if (confirmed) {
            await markAsCompleted.mutateAsync(offerId);
        }
    };


    const handleViewCustomerDetails = (offer) => {
        setSelectedOffer(offer);
        setShowCustomerModal(true);
    };

    const handleRefresh = () => {
        refetch();
        toast.success(t('dataRefreshed'));
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="space-y-6">
                <Card className="p-8 text-center">
                    <div className="text-red-500 mb-4">
                        <Package className="h-16 w-16 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">{t('errorLoadingOffers')}</h2>
                        <p className="text-gray-600">{error?.message || t('tryAgainLater')}</p>
                    </div>
                    <Button onClick={handleRefresh} variant="primary">
                        {t('retry')}
                    </Button>
                </Card>
            </div>
        );
    }

    const offers = offersData?.offers || [];
    const totalOffers = offersData?.count || 0;
    const totalPages = Math.ceil(totalOffers / rowsPerPage);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{t('acceptOffersTitle')}</h1>
                    <p className="text-gray-600 mt-1">
                        {t('acceptOffersSubtitle')}
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        icon={RefreshCw}
                        onClick={handleRefresh}
                    >
                        {t('refresh')}
                    </Button>
                </div>
            </div>

            {/* Filters and Controls */}
            <Card className="p-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex items-center gap-4">
                        <label className="text-sm text-gray-600">
                            {t('rowsPerPage')}:
                            <select
                                value={rowsPerPage}
                                onChange={(e) => {
                                    setRowsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="mr-2 border border-gray-300 rounded px-2 py-1"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </label>
                    </div>
                </div>
            </Card>

            {/* Offers Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    #
                                </th>

                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('offerNumber')}
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('productName')}
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('customerName')}
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('customerPhone')}
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('offerPrice')}
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('offerStatus')}
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {offers.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center">
                                            <Package className="h-12 w-12 text-gray-400 mb-4" />
                                            <p className="text-gray-500">{t('noOffersToManage')}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                offers.map((offer, index) => (
                                    <tr
                                        key={offer.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium">
                                                {(currentPage - 1) * rowsPerPage + index + 1}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-primary-600">
                                                {offer.offerNumber}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-xs truncate">
                                                {offer.productName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {offer.customerName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {offer.customerPhone}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-green-600">
                                                {DataUtils.formatCurrency(offer.finalPrice)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant={DataUtils.getStatusVariant(offer.statusId, 'offer')}>
                                                {DataUtils.formatDeliveryStatus(offer.statusId)}
                                            </Badge>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center gap-1 flex-wrap">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    icon={Eye}
                                                    onClick={() => handleViewCustomerDetails(offer)}
                                                >
                                                    {t('viewDetails')}
                                                </Button>

                                                {/* Show Mark as Delivered button for accepted offers */}
                                                {offer.statusId === 3 && (
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => handleMarkAsDelivered(offer.offerId)}
                                                        disabled={markAsDelivered.isPending}
                                                    >
                                                        {t('markAsDelivered')}
                                                    </Button>
                                                )}

                                                {/* Show Mark as Completed button for delivered offers */}
                                                {offer.statusId === 6 && (
                                                    <Button
                                                        variant="warning"
                                                        size="sm"
                                                        onClick={() => handleMarkAsCompleted(offer.offerId)}
                                                        disabled={markAsCompleted.isPending}
                                                    >
                                                        {t('markAsCompleted')}
                                                    </Button>
                                                )}

                                                {/* Show Close Order button for completed offers */}
                                                {offer.statusId === 7 && (
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        icon={CheckCircle}
                                                        onClick={() => handleAcceptOffer(offer.orderId)}
                                                        disabled={closeOrder.isPending}
                                                    >
                                                        {t('closeOrder')}
                                                    </Button>
                                                )}

                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalOffers > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            totalItems={totalOffers}
                            itemsPerPage={rowsPerPage}
                        />
                    </div>
                )}
            </Card>

            {/* Customer Details Modal */}
            {showCustomerModal && selectedOffer && (
                <CustomerDetailsModal
                    offer={selectedOffer}
                    isOpen={showCustomerModal}
                    onClose={() => {
                        setShowCustomerModal(false);
                        setSelectedOffer(null);
                    }}
                />
            )}
        </div>
    );
};

// Customer Details Modal Component
const CustomerDetailsModal = ({ offer, isOpen, onClose }) => {
    const { t } = useLanguage();
    const queryClient = useQueryClient();
    const closeOrder = useMutation({
        mutationFn: () => adminService.closeOrder(offer.orderId),
        onSuccess: (data) => {
            toast.success(data?.message);
            queryClient.invalidateQueries(['offersToManage']);
        },
        onError: (error) => {
            toast.error(error?.message || t('offerAcceptError'));
        }
    });
    const handleAcceptOffer = async (orderId) => {
        const confirmed = await confirmToast(t('closeAcceptOffer'));

        if (!confirmed) return;
        if (confirmed) {
            await closeOrder.mutateAsync(orderId);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t('customerDetailsTitle')}
            size="lg"
        >
            <div className="space-y-6">
                {/* Customer Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className='grid-rows-1 md:grid-rows-2 gap-6'>
                        <Card className="p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <User className="h-5 w-5" />
                                {t('customerInfo')}
                            </h3>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {t('customerName')}
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">{offer.customerName}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {t('customerPhone')}
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        {offer.customerPhone}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {t('customerCity')}
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        {offer.customerCity}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {t('customerAddress')}
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        {offer.customerAddress}
                                    </p>
                                </div>

                            </div>
                        </Card>
                        <Card className="p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <User className="h-5 w-5" />
                                {t('vendorInfo')}
                            </h3>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {t('vednorName')}
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">{offer.vendorName}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {t('vendorPhone')}
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        {offer.vendorPhone}
                                    </p>
                                </div>

                                {offer.vendorAddress && offer.vendorAddress !== '' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            {t('vendorAddress')}
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            {offer.vendorAddress}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                    {/* Offer Summary */}
                    <Card className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            {t('offerSummary')}
                        </h3>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    {t('offerNumber')}
                                </label>
                                <p className="mt-1 text-sm text-gray-900">{offer.offerNumber}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    {t('productName')}
                                </label>
                                <p className="mt-1 text-sm text-gray-900">{offer.productName}</p>
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    {t('OfferQuantity')}
                                </label>
                                <p className="mt-1 text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    {/* <DollarSign className="h-4 w-4" /> */}
                                    {offer.quantity}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    {t('offerPrice')}
                                </label>
                                <p className="mt-1 text-sm font-semibold text-green-600 flex items-center gap-2">
                                    <DollarSign className="h-4 w-4" />
                                    {DataUtils.formatCurrency(offer.finalPrice)}
                                </p>
                            </div>


                        </div>
                    </Card>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('productDescription')}
                    </label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-900">{offer.description}</p>
                    </div>
                </div>


                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 space-x-reverse pt-4 border-t">
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        {t('back')}
                    </Button>

                    <Button
                        variant="primary"
                        onClick={handleAcceptOffer}
                    >
                        {t('closeOrder')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default AcceptOffers;