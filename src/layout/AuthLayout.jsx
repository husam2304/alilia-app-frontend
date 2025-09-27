import { Outlet } from 'react-router-dom';
import LoginImage from '../assets/images/login.jpg';

export const AuthLayout = () => {

    return (
        <div className={`app`}>
            <main className="main-content">

                <div className="h-screen bg-gray-50 flex overflow-hidden" >
                    {/* Right Side - Login Form */}
                    <div className="md:w-2/3 p-8 lg:p-12 px-6 py-8 flex flex-1 justify-center overflow-scroll">
                        <Outlet />
                    </div>

                    {/* Left Side - Image */}
                    < div className="hidden md:flex md:w-1/2 relative" >
                        <img
                            src={LoginImage}
                            alt="CANDID Store"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    </div >
                </div >
            </main>
        </div>
    );
};

export default AuthLayout;