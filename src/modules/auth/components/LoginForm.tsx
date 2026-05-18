import { Button, Checkbox, Form, Input, Typography, theme, type FormProps } from 'antd';
import { Link } from 'react-router';
import type { LoginFormFieldType } from '../types';

type LoginFormInterface = {
    login: (values: LoginFormFieldType) => void;
    loading?: boolean;
};

export const LoginForm = ({ login, loading }: LoginFormInterface) => {
    const { token } = theme.useToken();

    const onFinish: FormProps<LoginFormFieldType>['onFinish'] = async (values) => {
        login(values);
    };

    const onFinishFailed: FormProps<LoginFormFieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: token.paddingXL }}>
                Login
            </Typography.Title>
            <Form
                name="login"
                style={{
                    width: '100%',
                    maxWidth: 400,
                    margin: '0 auto',
                }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="vertical"
            >
                <Form.Item<LoginFormFieldType>
                    name="username"
                    label="Username"
                    rules={[
                        { required: true, message: 'Please input your username' },
                        { type: 'string' },
                        { whitespace: true },
                        {
                            pattern: new RegExp('^[一-龥a-zA-Z0-9]+$'),
                            message: 'Username only allows Chinese, characters and numbers',
                        },
                    ]}
                >
                    <Input placeholder="Enter your username" />
                </Form.Item>

                <Form.Item<LoginFormFieldType>
                    name="password"
                    label="Password"
                    rules={[
                        { required: true, message: 'Please input your password' },
                        { type: 'string' },
                        { whitespace: true },
                        {
                            pattern: new RegExp('^[a-zA-Z0-9_]+$'),
                            message: 'Password only allows characters and numbers',
                        },
                    ]}
                >
                    <Input.Password placeholder="Enter your password" />
                </Form.Item>

                <Form.Item<LoginFormFieldType> name="remember" valuePropName="checked">
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Log in
                    </Button>
                    <div style={{ marginTop: token.paddingSM, textAlign: 'center' }}>
                        <Link to="../register">Don't have an account? Register</Link>
                    </div>
                </Form.Item>
            </Form>
        </>
    );
};
