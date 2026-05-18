import { Button, Checkbox, Form, Input, Typography, theme, type FormProps } from 'antd';
import type { RegisterFormFieldType } from '../types';
import userService from '../services/users';

type RegisterFormInterface = {
    register: (values: RegisterFormFieldType) => void;
    loading?: boolean;
};

export const RegisterForm = ({ register, loading }: RegisterFormInterface) => {
    const { token } = theme.useToken();

    const onFinish: FormProps<RegisterFormFieldType>['onFinish'] = async (values) => {
        register(values);
    };

    const onFinishFailed: FormProps<RegisterFormFieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: token.paddingXL }}>
                Register
            </Typography.Title>
            <Form
                name="register"
                style={{
                    width: '100%',
                    maxWidth: 400,
                    margin: '0 auto',
                }}
                initialValues={{ agreement: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="vertical"
            >
                <Form.Item<RegisterFormFieldType>
                    name="username"
                    label="Username"
                    validateDebounce={1000}
                    hasFeedback
                    rules={[
                        { required: true, message: 'Please input your username' },
                        { type: 'string' },
                        { whitespace: true },
                        { max: 20 },
                        { min: 2 },
                        {
                            pattern: new RegExp('^[一-龥a-zA-Z0-9]+$'),
                            message: 'Username only allows Chinese, characters and numbers',
                        },
                        {
                            validator: async (_, value) => {
                                if (value) {
                                    const result = await userService.getUsernameExistence(value);
                                    if (result.exists) {
                                        return Promise.reject(new Error('Username already exists'));
                                    }
                                    return await Promise.resolve();
                                }
                            },
                        },
                    ]}
                >
                    <Input placeholder="Enter your username" />
                </Form.Item>

                <Form.Item<RegisterFormFieldType>
                    name="email"
                    label="Email"
                    rules={[{ type: 'email', message: 'Please enter a valid email' }]}
                    hasFeedback
                >
                    <Input placeholder="Enter your email (optional)" />
                </Form.Item>

                <Form.Item<RegisterFormFieldType>
                    name="password"
                    label="Password"
                    hasFeedback
                    rules={[
                        { required: true, message: 'Please input your password' },
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
                    <Input.Password placeholder="Enter your password" />
                </Form.Item>

                <Form.Item<RegisterFormFieldType>
                    name="agreement"
                    valuePropName="checked"
                    rules={[
                        {
                            validator: (_, value) =>
                                value
                                    ? Promise.resolve()
                                    : Promise.reject(new Error('Please accept the agreement')),
                        },
                    ]}
                >
                    <Checkbox>
                        I have read the <a href="#">agreement</a>
                    </Checkbox>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};
