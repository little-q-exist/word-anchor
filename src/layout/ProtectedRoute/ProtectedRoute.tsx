import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router';
import type { RootState } from '../../store';
import { Button } from 'antd';
import type { ProtectedRouteConfig } from './types';
import FailedResult from '../../components/common/FailedResult';

interface ProtectedRouteProps {
    children?: React.ReactNode;
    config?: ProtectedRouteConfig;
}

const ProtectedRoute = ({
    children,
    config = { requiredRole: 'user', mustLogin: true },
}: ProtectedRouteProps) => {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user);

    if (config.requiredRole === 'user') {
        if ('mustLogin' in config && config.mustLogin && !user) {
            return (
                <FailedResult message="You must be logged in to access this page.">
                    <Button onClick={() => navigate('/login')}>Go to Login</Button>
                </FailedResult>
            );
        }
        if ('mustNotLogin' in config && config.mustNotLogin && user) {
            return (
                <FailedResult message="You are already logged in.">
                    <Button onClick={() => navigate(-1)}>Go Back</Button>
                </FailedResult>
            );
        }
    }

    return children || <Outlet />;
};

export default ProtectedRoute;
