import { Outlet } from 'react-router-dom';
export const AuthLayout = () => {

    return (
        <div className={`app`}>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AuthLayout;