import { useState, useEffect } from 'react';
import { Search, Download, RefreshCw, Plus, Eye, ListFilter as Filter, Calendar, Package } from 'lucide-react';
import { DataUtils } from '../utils';
import Card from '../components/cards/Card';
import Button from '../components/Ui/Button';
import Modal from '../components/Modal';
import Badge from '../components/Ui/Badge';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminService, vendorService } from '../service';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const { user } = useAuth();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalOrders, setTotalOrders] = useState(0);
    const { data: vendorOrder, isloading: vendorOrderLoading } = useQuery({
        queryKey: ['vendorOrder', rowsPerPage, currentPage],
        queryFn: () => vendorService.getOrders(currentPage, rowsPerPage),
        enabled: user?.userRole == 'Vendor',
    });
    const { data: adminOrder, isloading: adminOrderLoading } = useQuery({
        queryKey: ['adminOrder', rowsPerPage, currentPage],
        queryFn: () => adminService.getOrders(currentPage, rowsPerPage),
        enabled: user?.userRole == 'Admin',
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (adminOrderLoading || vendorOrderLoading) {
            setLoading(true);
            return;
        }
        if (user?.userRole == 'Admin' && adminOrder) {
            loadOrders(adminOrder);
        }
        if (user?.userRole == 'Vendor' && vendorOrder) {
            loadOrders(vendorOrder);

        }
    }, [adminOrder, vendorOrder]);

    const loadOrders = async (data) => {
        try {
            setLoading(true);

            if (data && Array.isArray(data.orders)) {
                const formattedOrders = data.orders.map(order => ({
                    id: order.id,
                    orderNumber: order.orderNumber,
                    date: DataUtils.formatDate(order.createdAt || order.orderDate),
                    content: formatOrderItems(order.items) || order.productName || 'منتجات متعددة',
                    Description: order.description || 'لا يوجد وصف',
                    status: DataUtils.formatOrderStatus(order.orderStatusId || 'pending'),
                    statusId: order.orderStatusId,
                    offer: DataUtils.formatDeliveryStatus(order.offerStatusId || 'pending'),
                    offerId: order.offerStatusId,
                    payment: DataUtils.formatPaymentStatus(order.paymentStatus || 'pending'),
                    receive: order.receiveStatus ? DataUtils.formatOrderStatus(order.receiveStatus) : 'بانتظار',
                    rawData: order,
                    offerDetailsId: order.offerId
                }));
                setOrders(formattedOrders);
                setTotalOrders(data.count || 0);
            } else {
                setOrders([]);
                setTotalOrders(0);
            }
        } catch (error) {
            setOrders([]);
            setTotalOrders(0);
        } finally {
            setLoading(false);
        }
    };

    // Pagination calculation from backend


    const formatOrderItems = (items) => {
        if (!Array.isArray(items)) return null;

        if (items.length === 1) {
            return items[0].productName || items[0].name || 'منتج';
        } else if (items.length <= 3) {
            return items.map(item => item.productName || item.name).join(', ');
        } else {
            const firstTwo = items.slice(0, 2).map(item => item.productName || item.name).join(', ');
            return `${firstTwo} و ${items.length - 2} منتجات أخرى`;
        }
    };


    const getFallbackOrders = () => [
    ];

    const handleOrderClick = async (orderId) => {
        try {
            const order = orders.find(o => o.id === orderId);
            if (!order) return;

            // Try to get detailed data
            let detailedOrder = order;
            if (order.rawData) {
                try {
                    const response = await vendorService.getOrderDetails(orderId);
                    detailedOrder = { ...order, ...response };
                } catch (error) {
                    console.warn('Could not fetch detailed order data:', error);
                }
            }

            setSelectedOrder(detailedOrder);
            setShowOrderModal(true);
        } catch (error) {
        }
    };

    const handleRefresh = async () => {
        const refreshToast = toast.loading('جاري تحديث الطلبات...');
        try {
            await loadOrders();
            toast.success('تم تحديث الطلبات بنجاح', { id: refreshToast });
        } catch (error) {
            toast.error('فشل في تحديث الطلبات', { id: refreshToast });
        }
    };

    const handleExport = () => {
        try {
            const csvContent = convertToCSV(filteredOrders);
            downloadCSV(csvContent, 'orders_export.csv');
            toast.success('تم تصدير الطلبات بنجاح');
        } catch (error) {
            toast.error('فشل في تصدير الطلبات');
        }
    };

    const convertToCSV = (data, options = {}) => {
        // Default configuration with Arabic support - using semicolon for better compatibility
        const config = {
            delimiter: ';',  // Changed to semicolon - better for Arabic and international support
            encoding: 'utf-8-sig',
            forceQuotes: true, // Force quotes around all fields
            dateFormat: 'YYYY-MM-DD',
            includeHeaders: true,
            ...options
        };

        // Arabic headers with proper RTL support
        const headers = [
            'رقم الطلب',      // Order ID
            'التاريخ',        // Date
            'المنتج',        // Content
            'التفاصيل',        // Content
            'حالة الطلب',     // Order Status
            'حالة العرض',     // Order Status
        ];

        let csvContent = '';

        // Add BOM for UTF-8 encoding (helps with Arabic display in Excel)
        if (config.encoding === 'utf-8-sig') {
            csvContent += '\ufeff';
        }

        // Add headers if enabled
        if (config.includeHeaders) {
            csvContent += headers.map(header => escapeCSVField(header, config)).join(config.delimiter) + '\r\n';
        }

        // Process data rows
        data.forEach(order => {
            const row = [
                escapeCSVField(order.orderNumber || '', config),
                escapeCSVField(formatDate(order.date) || '', config),
                escapeCSVField(order.content || '', config),
                escapeCSVField(order.Description || '', config),
                escapeCSVField(order.status || '', config),
                escapeCSVField(order.offer || '', config),
            ];
            csvContent += row.join(config.delimiter) + '\r\n';
        });

        return csvContent;
    };

    // Helper function to properly escape CSV fields
    const escapeCSVField = (field, config) => {
        if (field === null || field === undefined) {
            return '""'; // Return empty quoted string for null/undefined
        }

        const fieldStr = String(field).trim();

        // Always wrap in quotes when forceQuotes is true, or escape double quotes
        const escapedField = fieldStr.replace(/"/g, '""');

        // For Arabic support and better compatibility, always quote fields
        if (config.forceQuotes) {
            return `"${escapedField}"`;
        }

        // Check if field needs escaping
        const needsEscaping = fieldStr.includes(config.delimiter) ||
            fieldStr.includes('\n') ||
            fieldStr.includes('\r') ||
            fieldStr.includes('"') ||
            fieldStr.includes(','); // Also escape commas

        if (needsEscaping) {
            return `"${escapedField}"`;
        }

        return fieldStr;
    };

    // Helper function to format dates consistently
    const formatDate = (date) => {
        if (!date) return '';

        try {
            const dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) return date; // Return original if invalid

            // Format as YYYY-MM-DD HH:MM for Arabic locale
            return dateObj.toLocaleString('ar-SA', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        } catch (error) {
            return date; // Return original if formatting fails
        }
    };


    const downloadCSV = (csvContent, filename) => {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Pagination logic
    const totalPages = Math.ceil(totalOrders / rowsPerPage);
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{t('ordersTitle')}</h1>
                    <p className="text-gray-600 mt-1">
                        {t('ordersSubtitle')}
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

            {/* Filters and Search */}
            <Card className="p-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    {/* <div className="flex-1 max-w-md">
                            <Input
                                type="text"
                                placeholder="ابحث حسب رقم الطلب أو المحتوى"
                                icon={Search}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div> */}

                    <div className="flex items-center gap-4">
                        <label className="text-sm text-gray-600">
                            عدد الصفوف:
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

            {/* Orders Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('orderNumber')}
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('orderDate')}
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('product')}
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('details')}
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('orderStatus')}
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
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center">
                                            <Package className="h-12 w-12 text-gray-400 mb-4" />
                                            <p className="text-gray-500">{t('noOrdersAvailable')}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={() => handleOrderClick(order.id)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-primary-600 hover:text-primary-900">
                                                {order.orderNumber}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {order.date}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-xs truncate">
                                                {order.content}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-xs truncate">
                                                {order.Description}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant={DataUtils.getStatusVariant(order.statusId, 'order')}>
                                                {order.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {order.offerId === 1 && user?.userRole != 'Admin' ? (
                                                <div className='flex max-w-full justify-between items-center'>
                                                    <Badge variant={DataUtils.getStatusVariant(order.offerId, 'offer')} className='mx-2 p-2'>
                                                        {order.offer}
                                                    </Badge>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        className="flex-1 max-w-[50%]"

                                                        icon={Plus}
                                                        onClick={() => navigate(`/dashboard/CreateOffer/${order.id}`)}
                                                    >
                                                        {t('createOffer')}
                                                    </Button>
                                                </div>) : (
                                                order.offerId === 1 ? (
                                                    <Badge variant={DataUtils.getStatusVariant(order.offerId, 'offer')} className='mx-5 p-2'>
                                                        {order.offer}
                                                    </Badge>
                                                ) : (<div className='flex max-w-full justify-between items-center'>
                                                    <Badge variant={DataUtils.getStatusVariant(order.offerId, 'offer')} className='mx-5 p-2'>
                                                        {order.offer}
                                                    </Badge>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        icon={Eye}
                                                        className="flex-1 max-w-[50%]"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/dashboard/offer-details/${order.offerDetailsId}`);
                                                        }}
                                                    >
                                                        {t('viewOfferDetails')}
                                                    </Button>
                                                </div>
                                                )
                                            )}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                icon={Eye}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOrderClick(order.id);
                                                }}
                                            >
                                                {t('view')}
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalOrders > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            totalItems={totalOrders}
                            itemsPerPage={rowsPerPage}
                        />
                    </div>
                )}
            </Card>

            {/* Order Details Modal */}
            {showOrderModal && selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    isOpen={showOrderModal}
                    onClose={() => {
                        setShowOrderModal(false);
                        setSelectedOrder(null);
                    }}
                />
            )}
        </div>
    );
};

// Order Details Modal Component
const OrderDetailsModal = ({ order, isOpen, onClose }) => {
    const { t } = useLanguage();

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('orderDetailsTitle', { orderNumber: order.orderNumber })} size="lg">
            <div className="space-y-6">
                {/* Basic Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t('orderNumber')}</label>
                        <p className="mt-1 text-sm text-gray-900">{order.orderNumber}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t('orderDate')}</label>
                        <p className="mt-1 text-sm text-gray-900">{order.date}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t('product')}</label>
                        <p className="mt-1 text-sm text-gray-900">{order.content}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t('details')}</label>
                        <p className="mt-1 text-sm text-gray-900">{order.Description}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t('orderStatus')}</label>
                        <div className="mt-1">
                            <Badge variant={DataUtils.getStatusVariant(order.status)}>
                                {order.status}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Customer Info */}
                {order.rawData?.customerInfo && (
                    <div className="border-t pt-4">
                        <h4 className="text-lg font-medium text-gray-900 mb-3">{t('customerInfo')}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('customerName')}</label>
                                <p className="mt-1 text-sm text-gray-900">
                                    {order.rawData.customerInfo.name || 'غير محدد'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('customerPhone')}</label>
                                <p className="mt-1 text-sm text-gray-900">
                                    {order.rawData.customerInfo.phone || 'غير محدد'}
                                </p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">{t('customerAddress')}</label>
                                <p className="mt-1 text-sm text-gray-900">
                                    {order.rawData.customerInfo.address || 'غير محدد'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Order Items */}
                {order.rawData?.items && order.rawData.items.length > 0 && (
                    <div className="border-t pt-4">
                        <h4 className="text-lg font-medium text-gray-900 mb-3">{t('productDetails')}</h4>
                        <div className="space-y-3">
                            {order.rawData.items.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {item.productName || item.name || 'منتج غير محدد'}
                                        </p>
                                        <p className="text-sm text-gray-600">{t('quantity')}: {item.quantity || 1}</p>
                                    </div>
                                    {item.price && (
                                        <p className="font-medium text-green-600">
                                            {DataUtils.formatCurrency(item.price)}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Total Amount */}
                {order.rawData?.totalAmount && (
                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-medium text-gray-900">{t('totalAmount')}:</span>
                            <span className="text-xl font-bold text-green-600">
                                {DataUtils.formatCurrency(order.rawData.totalAmount)}
                            </span>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="border-t pt-4 flex justify-end space-x-3 space-x-reverse">
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        {t('close')}
                    </Button>

                </div>
            </div>
        </Modal>
    );
};

export default Orders;