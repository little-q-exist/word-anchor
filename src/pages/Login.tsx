import {
    Button,
    Card,
    Checkbox,
    Flex,
    Form,
    Input,
    message,
    Result,
    Spin,
    type FormProps,
    type GetProp,
} from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import loginService from '../services/login';
import { AxiosError } from 'axios';
import type { User } from '../types';

type FieldType = {
    username: string;
    password: string;
    remember?: string;
};

type StatusType = 'idle' | 'loading' | 'success' | 'failed';

type LoginFormInterface = {
    onFinish: GetProp<FormProps, 'onFinish'>;
    onFinishFailed: GetProp<FormProps, 'onFinishFailed'>;
};

const LoginForm = ({ onFinish, onFinishFailed }: LoginFormInterface) => {
    return (
        <>
            <h2>login</h2>
            <Form
                name="login"
                wrapperCol={{ span: 50 }}
                style={{ width: '25rem' }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    name="username"
                    rules={[
                        { required: true, message: 'Please input your username!' },
                        { type: 'string' },
                        { whitespace: true },
                        {
                            pattern: new RegExp('^[\u4e00-\u9fa5a-zA-Z0-9]+$'),
                            message: 'Username only allows Chinese, characters and numbers',
                        },
                    ]}
                >
                    <Input placeholder="Username" />
                </Form.Item>

                <Form.Item<FieldType>
                    name="password"
                    rules={[
                        { required: true, message: 'Please input your password!' },
                        { type: 'string' },
                        { whitespace: true },
                        {
                            pattern: new RegExp('^[a-zA-Z0-9_]+$'),
                            message: 'Password only allows characters and numbers',
                        },
                    ]}
                >
                    <Input.Password placeholder="Password" />
                </Form.Item>

                <Form.Item<FieldType> name="remember" valuePropName="checked">
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Log in
                    </Button>
                    <Link to="../register">Register here!</Link>
                </Form.Item>
            </Form>
        </>
    );
};

const FailedResult = ({
    message,
    setStatus,
}: {
    message?: string;
    setStatus: React.Dispatch<React.SetStateAction<StatusType>>;
}) => {
    return (
        <Result
            status="error"
            title="Opps! Something went wrong."
            subTitle={message || 'please go back or try again.'}
            extra={[
                <Button type="default" key="home">
                    <Link to="..">Back Home</Link>
                </Button>,
                <Button
                    type="primary"
                    key="return"
                    onClick={() => {
                        setStatus('idle');
                    }}
                >
                    Try Again
                </Button>,
            ]}
        />
    );
};

const Login = () => {
    const [status, setStatus] = useState<StatusType>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setStatus('loading');
        try {
            const userToken: User = await loginService.login(values);
            console.log('Success:', values);
            setStatus('success');
            if (values.remember) {
                localStorage.setItem('reciteWordAppUser', JSON.stringify(userToken));
            }
            messageApi.success('Login successful!');
            navigate('..');
        } catch (error: unknown) {
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
                return (
                    <Spin spinning={status === 'loading'}>
                        <LoginForm onFinish={onFinish} onFinishFailed={onFinishFailed} />
                    </Spin>
                );
            case 'failed':
                return <FailedResult message={errorMessage} setStatus={setStatus} />;
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
