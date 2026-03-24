import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router';
import type { RootState } from '@/store';
import { Button } from 'antd';
import type { ProtectedRouteConfig } from './types';
import FailedResult from '@/shared/components/FailedResult';

interface ProtectedRouteProps {
    children?: React.ReactNode;
    extra?: React.ReactNode;
    config?: ProtectedRouteConfig;
    disabled?: boolean;
}

const ProtectedRoute = ({
    children,
    extra,
    config = { requiredRole: 'user', mustLogin: true },
    disabled = false,
}: ProtectedRouteProps) => {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user);

    if (disabled) {
        return children || <Outlet />;
    }

    if (config.requiredRole === 'user') {
        if ('mustLogin' in config && config.mustLogin && !user) {
            return (
                <FailedResult message="You must be logged in to access this page.">
                    <Button onClick={() => navigate('/login')}>Go to Login</Button>
                    {extra}
                </FailedResult>
            );
        }
        if ('mustNotLogin' in config && config.mustNotLogin && user) {
            return (
                <FailedResult message="You are already logged in.">
                    <Button onClick={() => navigate(-1)}>Go Back</Button>
                    {extra}
                </FailedResult>
            );
        }
    }

    return children || <Outlet />;
};

export default ProtectedRoute;
