import { Button, Card, Checkbox, Flex, Form, Input, Result, Spin, message } from 'antd';
import type { FormProps, GetProp } from 'antd';

import userService from '../services/users';

import { Link } from 'react-router';

import { useState } from 'react';
import { AxiosError } from 'axios';

type FieldType = {
    username: string;
    email?: string;
    password: string;
    agreement: string;
};

type StatusType = 'idle' | 'loading' | 'success' | 'failed';

const SuccessResult = () => {
    return (
        <Result
            status="success"
            title="You have successfully registered!"
            subTitle="please go back and login again."
            extra={
                <Button type="primary" key="home">
                    <Link to="..">Back Home</Link>
                </Button>
            }
        />
    );
};

const FailedResult = ({ message }: { message?: string }) => {
    return (
        <Result
            status="error"
            title="Opps! Something went wrong."
            subTitle={message || 'please go back and try again.'}
            extra={
                <Button type="primary" key="home">
                    <Link to="..">Back Home</Link>
                </Button>
            }
        />
    );
};

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
                        Log in
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

const Register = () => {
    const [status, setStatus] = useState<StatusType>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [messageApi, contextHolder] = message.useMessage();

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
                }
                setErrorMessage(error.message || 'Unknown error occurred');
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
                return <SuccessResult />;
            case 'failed':
                return <FailedResult message={errorMessage} />;
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
