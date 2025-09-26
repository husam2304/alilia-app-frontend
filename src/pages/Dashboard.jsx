import { useState, useEffect } from 'react';
import {
    ShoppingBag,
    TrendingUp,
    Truck,
    MapPin,
    Package,
    Bell,
    Mail,
    Search,
    Download,
    FileText,
    Printer
} from 'lucide-react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import { dashboardService } from '../service';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/cards/Card';
import StatCard from '../components/cards/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [chartsData, setChartsData] = useState(null);
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { data: AdminDashboardData, isLoading: isAdminDashboardLoading } = useQuery({
        queryKey: ['AdminDashboardData'],
        queryFn: () => dashboardService.dashboardAdmin(),
        enabled: user.userRole == 'Admin',
    });
    const { data: VendorDashboardData, isLoading: isVendorDashboardLoading } = useQuery({
        queryKey: ['VendorDashboardData'],
        queryFn: () => dashboardService.dashboardVendor(),
        enabled: user.userRole == 'Vendor',
    });
    useEffect(() => {
        if (isAdminDashboardLoading || isVendorDashboardLoading) {
            setLoading(true);
            return;
        }
        if (user.userRole == 'Admin' && AdminDashboardData) {
            handleDashboardData(AdminDashboardData);
        }
        if (user.userRole == 'Vendor' && VendorDashboardData) {
            handleDashboardData(VendorDashboardData);
        }
    }, [VendorDashboardData, AdminDashboardData]);

    const handleDashboardData = async (data) => {
        try {
            if (!data?.success) {
                throw new Error(data?.message || 'فشل في جلب بيانات لوحة التحكم');
            }
            console.log(data);
            setDashboardData(data?.dashboard?.summary);

            setChartsData(prev => ({ ...prev, lineChart: data?.dashboard?.charts.ordersChart }));



            setChartsData(prev => ({ ...prev, pieChart: data?.dashboard?.offerStatus }));
            if (user.userRole == "Admin") {
                setChartsData(prev => ({ ...prev, barChart: data?.dashboard?.systemProfitByYear }));
                // Handle top products
                setTopProducts(data?.dashboard?.topProducts);
            }
            else if (user.userRole == "Vendor") {
                setChartsData(prev => ({ ...prev, barChart: data?.dashboard?.profitByYear }));
                // Handle top products
                setTopProducts(data?.dashboard?.mostProductsSells);

            }

        } catch (error) {
            // Load fallback data
            setDashboardData(getFallbackSummaryData());
            setChartsData(getFallbackChartsData());
            setTopProducts(getFallbackTopProducts());
        } finally {
            setLoading(false);
        }
    };



    const exportData = async (format) => {
        try {
            const loadingToast = toast.loading('جاري تصدير البيانات...');

            const response = await DashboardAPI.exportData(format);

            // Create download
            const blob = new Blob([JSON.stringify(response.data, null, 2)], {
                type: format === 'json' ? 'application/json' : 'text/csv'
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `dashboard_data.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.dismiss(loadingToast);
            toast.success('تم تصدير البيانات بنجاح');
        } catch (error) {
            handleApiError(error, 'فشل في تصدير البيانات');
        }
    };

    // Fallback data functions
    const getFallbackSummaryData = () => ({
        totalOffers: 0,
        totalProfits: 0,
        totalDeliveries: 0,
        citiesServed: 0,
        productsMarketed: 0
    });

    const getFallbackChartsData = () => ({
        lineChart: {
            labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        pieChart: {
            labels: ['عرض مقبول', 'عرض مرفوض', 'عرض منتهي', 'قائم'],
            data: [0, 0, 0, 0]
        },
        barChart: {
            labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    });

    const getFallbackTopProducts = () => [
    ];

    // Chart configurations
    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: false }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return value.toLocaleString('ar');
                    }
                }
            }
        }
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        }
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return value.toLocaleString('ar');
                    }
                }
            }
        }
    };

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
                    <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
                    <p className="text-gray-600 mt-1">
                        مرحباً {user?.name || 'بك'}, إليك نظرة عامة على أعمالك
                    </p>
                </div>

                {/* Export Actions */}
                {/* <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            icon={<Download />}
                            onClick={() => exportData('json')}
                        >
                            تصدير JSON
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            icon={<FileText />}
                            onClick={() => exportData('csv')}
                        >
                            تصدير CSV
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            icon={<Printer />}
                            onClick={() => window.print()}
                        >
                            طباعة
                        </Button>
                    </div> */}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard
                    title=" عدد  العروض النشطة"
                    value={dashboardData?.activeOffers || 0}

                    icon={ShoppingBag}
                    color="primary"
                />

                <StatCard
                    title="عدد طلبات القائمة"
                    value={dashboardData?.pendingOrders || 0}

                    icon={Truck}
                    color="secondary"
                />

                <StatCard
                    title="عدد الطلبات"
                    value={dashboardData?.completedOffers || 0}

                    icon={Package}
                    color="primary"
                />
                <StatCard
                    title="عدد الطلبات المكتمة "
                    value={dashboardData?.totalOrders || 0}

                    icon={MapPin}
                    color="secondary"
                />
                <StatCard
                    title="إجمالي الأرباح"
                    value={dashboardData?.totalProfit || 0}

                    icon={TrendingUp}
                    color="primary"
                />
            </div>

            {/* Charts Row */}
            <div className="grid  grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pie Chart */}
                <Card className="p-6 bg-card-150">
                    <h3 className="text-lg font-semibold mb-4">طلبات التوصيل</h3>
                    <div className="flex items-center gap-4">
                        <div className="w-48 h-48">
                            <Doughnut
                                data={{
                                    labels: ['عرض مقبول', 'عرض مرفوض', 'عرض منتهي', 'قائم'],
                                    datasets: [{
                                        data: [chartsData?.pieChart?.offerAccepted, chartsData?.pieChart?.offerRejected, chartsData?.pieChart?.offersExpired, chartsData?.pieChart?.preparing],
                                        backgroundColor: ['#931158', '#912baa', '#2c0962', '#075a0a'],
                                        borderWidth: 0
                                    }]
                                }}
                                options={pieChartOptions}
                            />
                        </div>
                        <div className="space-y-2">
                            {(chartsData?.pieChart?.labels || ['قائمة', 'بانتظار', 'تم الاستلام', 'تم الإلغاء']).map((label, index) => (
                                <div key={label} className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: ['#931158', '#912baa', '#2c0962', '#075a0a'][index] }}
                                    />
                                    <span className="text-sm text-gray-600">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Line Chart */}
                <Card className="p-6 lg:col-span-2 bg-card-150">
                    <h3 className="text-lg font-semibold mb-4">طلبات العروض</h3>
                    <div className="h-64">
                        <Line
                            data={{
                                labels: chartsData?.lineChart?.map(item => item.label) || ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
                                datasets: [{
                                    label: 'هذا العام',
                                    data: chartsData?.lineChart?.map(item => item.value) || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                    borderColor: '#b3006e',
                                    backgroundColor: 'rgba(179, 0, 110, 0.1)',
                                    fill: true,
                                    tension: 0.4
                                }]
                            }}
                            options={lineChartOptions}
                        />
                    </div>
                </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bar Chart */}
                <Card className="p-6 lg:col-span-2 bg-card-150">
                    <h3 className="text-lg font-semibold mb-4">الأرباح خلال السنة</h3>
                    <div className="h-64">
                        <Bar
                            data={{
                                labels: chartsData?.barChart?.map(item => item.monthName) || ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
                                datasets: [{
                                    data: chartsData?.barChart?.map(item => item.profit) || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                    backgroundColor: [
                                        '#b3006e', '#8e24aa', '#9c27b0', '#673ab7',
                                        '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
                                        '#009688', '#4caf50', '#8bc34a', '#cddc39'
                                    ],
                                    borderRadius: 4
                                }]
                            }}
                            options={barChartOptions}
                        />
                    </div>
                </Card>

                {/* Top Products */}
                <Card className="p-6 bg-card-150">
                    <h3 className="text-lg font-semibold mb-4">المنتجات الأكثر تسوق</h3>
                    <div className="space-y-3">
                        {topProducts?.slice(0, 6)?.map((product, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <span className="font-medium text-gray-900">
                                    {typeof product === 'string' ? product : product.productName}
                                </span>
                                <span className="text-sm text-gray-500">
                                    #{index + 1}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;