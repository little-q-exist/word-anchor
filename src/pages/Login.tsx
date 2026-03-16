import { Button, Card, Flex, message, Spin, type FormProps } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';

import loginService from '../services/login';
import { AxiosError } from 'axios';
import type { User } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { login, logout } from '../features/userSlice';
import FailedResult from '../components/common/FailedResult';
import { LoginForm, type StatusType, type FieldType } from '../modules/auth/index';

const Login = () => {
    const [status, setStatus] = useState<StatusType>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (user && status !== 'success') {
            setStatus('failed');
            setErrorMessage('You have alreadly logged in!');
        }
    }, [status, user]);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setStatus('loading');
        try {
            messageApi.success('Login successful!');
            const userToken: User = await loginService.login(values);
            console.log('Success:', values);
            setStatus('success');
            if (values.remember) {
                localStorage.setItem('reciteWordAppUser', JSON.stringify(userToken));
            }
            navigate('..');
            dispatch(login(userToken));
        } catch (error: unknown) {
            messageApi.error('Login failed!');
            if (error instanceof AxiosError) {
                console.error('Login failed:', error);
                if (error instanceof AxiosError) {
                    if (
                        typeof error.response?.data?.error === 'string' ||
                        error.response?.data?.error instanceof String
                    ) {
                        setErrorMessage(
                            error.response?.data?.error || error.message || 'Unknown error occurred'
                        );
                    } else {
                        setErrorMessage(error.message || 'Unknown error occurred');
                    }
                }
                setStatus('failed');
            }
        }
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
        messageApi.error('Login failed!');
    };

    const renderContent = () => {
        switch (status) {
            case 'idle':
            case 'loading':
            case 'success':
                return (
                    <Spin spinning={status !== 'idle'}>
                        <LoginForm onFinish={onFinish} onFinishFailed={onFinishFailed} />
                    </Spin>
                );
            case 'failed':
                return (
                    <FailedResult message={errorMessage}>
                        {!user && (
                            <>
                                <Button type="default" key="home">
                                    <Link to="..">Back Home</Link>
                                </Button>
                                <Button
                                    type="primary"
                                    key="return"
                                    onClick={() => {
                                        setStatus('idle');
                                    }}
                                >
                                    Try Again
                                </Button>
                            </>
                        )}
                        {user && (
                            <div>
                                <div>
                                    wanna log in?{' '}
                                    <a
                                        onClick={() => {
                                            dispatch(logout());
                                            setStatus('idle');
                                            setErrorMessage('');
                                        }}
                                    >
                                        Log out first.
                                    </a>
                                </div>
                            </div>
                        )}
                    </FailedResult>
                );
        }
    };
    return (
        <>
            {contextHolder}
            <Flex vertical align="center" justify="space-around" style={{ height: '100%' }}>
                <Card>{renderContent()}</Card>
            </Flex>
        </>
    );
};

export default Login;
