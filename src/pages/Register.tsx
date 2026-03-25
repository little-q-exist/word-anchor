import { Button, Card, Flex, Spin } from 'antd';

import { Link } from 'react-router';

import SuccessResult from '../shared/components/SuccessResult';
import FailedResult from '../shared/components/FailedResult';
import ProtectedRoute from '../layout/ProtectedRoute/ProtectedRoute';
import { RegisterForm, useRegister } from '../modules/auth/index';

const Register = () => {
    const { status, errorMessage, register, reset } = useRegister();

    const renderContent = () => {
        switch (status) {
            case 'loading':
            case 'idle':
                return <RegisterForm register={register} />;
            case 'success':
                return (
                    <SuccessResult>
                        <Button type="default" key="home">
                            <Link to="..">Back Home</Link>
                        </Button>
                    </SuccessResult>
                );
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
        <ProtectedRoute config={{ requiredRole: 'user', mustNotLogin: true }}>
            <Flex vertical align="center" justify="space-around" style={{ height: '100%' }}>
                <Spin spinning={status === 'loading'}>
                    <Card>{renderContent()}</Card>
                </Spin>
            </Flex>
        </ProtectedRoute>
    );
};

export default Register;
