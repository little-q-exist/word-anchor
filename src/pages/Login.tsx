import { Button, Card, Flex, theme } from 'antd';
import { Link } from 'react-router';

import FailedResult from '../shared/components/FailedResult';
import { LoginForm } from '@modules/auth/index';
import useLogin from '../modules/auth/hooks/useLogin';
import ProtectedRoute from '../layout/ProtectedRoute/ProtectedRoute';
import LogoutButton from '../modules/auth/components/LogoutButton';

const Login = () => {
    const { token } = theme.useToken();
    const { login, status, errorMessage, reset } = useLogin();

    const renderContent = () => {
        switch (status) {
            case 'idle':
            case 'loading':
            case 'success':
                return <LoginForm login={login} loading={status === 'loading'} />;
            case 'failed':
                return (
                    <FailedResult message={errorMessage}>
                        <>
                            <Button type="default" key="home">
                                <Link to="..">Back Home</Link>
                            </Button>
                            <Button
                                type="primary"
                                key="return"
                                onClick={() => {
                                    reset();
                                }}
                            >
                                Try Again
                            </Button>
                        </>
                    </FailedResult>
                );
        }
    };
    return (
        <ProtectedRoute
            config={{ requiredRole: 'user', mustNotLogin: true }}
            extra={<LogoutButton extraFn={() => reset()} />}
            disabled={status === 'success'}
        >
            <Flex vertical align="center" justify="space-around" style={{ height: '100%' }}>
                <Card style={{ padding: token.paddingXL }}>{renderContent()}</Card>
            </Flex>
        </ProtectedRoute>
    );
};

export default Login;
