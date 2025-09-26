import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import defaultAvatar from '../assets/images/image.jpg';
import Logo from '../assets/images/logo.png';
import {
    LayoutDashboard,
    ShoppingCart,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { Menu as HeadlessMenu } from '@headlessui/react';
import { useAuth } from '../contexts/AuthContext';
export const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const navigation = [
        {
            name: 'لوحة التحكم',
            href: '/dashboard',
            icon: LayoutDashboard,
            current: location.pathname === '/dashboard'
        },
        {
            name: 'الطلبات',
            href: '/dashboard/orders',
            icon: ShoppingCart,
            current: location.pathname === '/dashboard/orders'
        }
    ];

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/auth/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                <div className="relative flex flex-col w-full max-w-xs bg-white">
                    <div className="absolute top-0 left-0 -mr-12 pt-2">
                        <button
                            type="button"
                            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="h-6 w-6 text-white" />
                        </button>
                    </div>
                    <Sidebar navigation={navigation} />
                </div>
            </div>

            {/* Desktop sidebar */}
            {/* <div className="hidden lg:flex lg:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <Sidebar navigation={navigation} user={user} />
                </div>
            </div> */}

            {/* Main content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="flex justify-between items-center px-4 py-4 sm:px-6 lg:px-8">
                        {/* Left side - Mobile menu button */}
                        <div className="flex items-center">
                            <button
                                type="button"
                                className="lg:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Center - Search */}
                        {/* <div className="flex-1 max-w-md mx-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 focus:bg-white"
                                    placeholder="ابحث..."
                                />
                            </div>
                        </div> */}
                        <div className="flex-1 flex w-full max-w-2xl mx-4">
                            <nav className="flex-1 px-2 justify-center flex space-y-1">
                                {navigation.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className={`${item.current
                                                ? 'bg-primary-50 border-b-4 border-primary-500 text-primary-700'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                } group flex items-center px-2 py-3 text-base font-medium transition-colors duration-200`}
                                        >
                                            <Icon
                                                className={`${item.current ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                                                    } ml-4 h-6 w-6`}
                                            />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                        {/* Right side - Notifications and Profile */}
                        <div className="flex items-center space-x-4 space-x-reverse">
                            {/* Notifications */}
                            {/* <button
                                type="button"
                                className="bg-gray-100 p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                            >
                                <Bell className="h-5 w-5" />
                            </button> */}

                            {/* Messages */}
                            {/* <button
                                type="button"
                                className="bg-gray-100 p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                            >
                                <Mail className="h-5 w-5" />
                            </button> */}

                            {/* Profile dropdown */}
                            <HeadlessMenu as="div" className="relative">
                                <div>
                                    <HeadlessMenu.Button className="bg-gray-100 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                        <img
                                            className="h-8 w-8 rounded-full"
                                            src={user?.imageUrl || defaultAvatar}
                                            alt="Profile"
                                        />
                                    </HeadlessMenu.Button>
                                </div>

                                <HeadlessMenu.Items className="origin-top-right absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                    <div className="py-1">
                                        {/* <HeadlessMenu.Item>
                                            {({ active }) => (
                                                <Link
                                                    to="/profile"
                                                    className={`${active ? 'bg-gray-100' : ''
                                                        } flex items-center px-4 py-2 text-sm text-gray-700 w-full`}
                                                >
                                                    <User className="ml-3 h-4 w-4" />
                                                    الملف الشخصي
                                                </Link>
                                            )}
                                        </HeadlessMenu.Item>

                                        <HeadlessMenu.Item>
                                            {({ active }) => (
                                                <Link
                                                    to="/settings"
                                                    className={`${active ? 'bg-gray-100' : ''
                                                        } flex items-center px-4 py-2 text-sm text-gray-700 w-full`}
                                                >
                                                    <Settings className="ml-3 h-4 w-4" />
                                                    الإعدادات
                                                </Link>
                                            )}
                                        </HeadlessMenu.Item> */}

                                        <HeadlessMenu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={handleLogout}
                                                    className={`${active ? 'bg-gray-100' : ''
                                                        } flex items-center px-4 py-2 text-sm text-gray-700 w-full text-right`}
                                                >
                                                    <LogOut className="ml-3 h-4 w-4" />
                                                    تسجيل الخروج
                                                </button>
                                            )}
                                        </HeadlessMenu.Item>
                                    </div>
                                </HeadlessMenu.Items>
                            </HeadlessMenu>
                        </div>
                    </div>
                </header>

                {/* Main content area */}
                <main className="flex-1 overflow-y-auto">
                    <div className="py-6">
                        <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
const Sidebar = ({ navigation, user }) => {
    return (
        <div className="flex flex-col flex-grow bg-white border-l border-gray-200">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 px-4 py-6">
                <img
                    className="h-12 w-auto"
                    src={Logo}
                    alt="ALIA"
                />
                <span className="mr-3 text-xl font-bold text-primary-500">ALIA</span>
            </div>

            {/* Navigation */}
            <div className="flex-1 flex flex-col">
                <nav className="flex-1 px-2 space-y-1">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`${item.current
                                    ? 'bg-primary-50 border-l-4 border-primary-500 text-primary-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    } group flex items-center px-2 py-3 text-base font-medium transition-colors duration-200`}
                            >
                                <Icon
                                    className={`${item.current ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                                        } ml-4 h-6 w-6`}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* User info at bottom */}
                <div className="flex-shrink-0 p-4 border-t border-gray-200">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <img
                                className="h-10 w-10 rounded-full"
                                src={user?.imageUrl || defaultAvatar}
                                alt="User avatar"
                            />
                        </div>
                        <div className="mr-3">
                            <p className="text-sm font-medium text-gray-700">
                                مرحباً بك
                            </p>
                            <p className="text-xs text-gray-500">
                                مدير المتجر
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default DashboardLayout;