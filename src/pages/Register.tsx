import { Button, Card, Checkbox, Flex, Form, Input, Spin, message } from 'antd';
import type { FormProps, GetProp } from 'antd';

import userService from '../services/users';

import { Link } from 'react-router';

import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import SuccessResult from '../components/common/SuccessResult';
import FailedResult from '../components/common/FailedResult';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { logout } from '../features/userSlice';

type FieldType = {
    username: string;
    email?: string;
    password: string;
    agreement: string;
};

type StatusType = 'idle' | 'loading' | 'success' | 'failed';

type RegisterFormInterface = {
    onFinish: GetProp<FormProps, 'onFinish'>;
    onFinishFailed: GetProp<FormProps, 'onFinishFailed'>;
};

const RegisterForm = ({ onFinish, onFinishFailed }: RegisterFormInterface) => {
    return (
        <>
            <h2>Register</h2>
            <Form
                name="register"
                style={{ width: '30rem' }}
                initialValues={{ agreement: true }}
                labelCol={{ span: 5 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Username"
                    name="username"
                    rules={[
                        { required: true, message: 'Please input your username!' },
                        { type: 'string' },
                        { whitespace: true },
                        { max: 20 },
                        { min: 2 },
                        {
                            pattern: new RegExp('^[\u4e00-\u9fa5a-zA-Z0-9]+$'),
                            message: 'Username only allows Chinese, characters and numbers',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType> label="Email" name="email" rules={[{ type: 'email' }]}>
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Password"
                    name="password"
                    rules={[
                        { required: true, message: 'Please input your password!' },
                        { type: 'string' },
                        { whitespace: true },
                        { max: 100 },
                        { min: 7 },
                        {
                            pattern: new RegExp('^[a-zA-Z0-9_]+$'),
                            message: 'Password only allows characters and numbers',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item<FieldType>
                    name="agreement"
                    valuePropName="checked"
                    label={null}
                    rules={[
                        {
                            validator: (_, value) =>
                                value
                                    ? Promise.resolve()
                                    : Promise.reject(new Error('Please accept agreement')),
                        },
                    ]}
                >
                    <Checkbox>
                        I have read the <a href="#">agreement</a>
                    </Checkbox>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

const Register = () => {
    const user = useSelector((state: RootState) => state.user);
    const [status, setStatus] = useState<StatusType>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch();

    useEffect(() => {
        if (user && status !== 'success') {
            setStatus('failed');
            setErrorMessage('You have already logged in.');
        }
    }, [user, status]);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setStatus('loading');
        try {
            await userService.register(values);
            console.log('Success:', values);
            setStatus('success');
        } catch (error: unknown) {
            console.error('Registration failed:', error);
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
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
        messageApi.error('Registration failed!');
    };

    const renderContent = () => {
        switch (status) {
            case 'loading':
            case 'idle':
                return <RegisterForm onFinish={onFinish} onFinishFailed={onFinishFailed} />;
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
                                    wanna sign up for a new account?{' '}
                                    <a
                                        onClick={() => {
                                            dispatch(logout());
                                            setStatus('idle');
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
                <Spin spinning={status === 'loading'}>
                    <Card>{renderContent()}</Card>
                </Spin>
            </Flex>
        </>
    );
};

export default Register;
