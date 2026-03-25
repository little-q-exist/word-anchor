import { Button, Checkbox, Form, Input, message, type FormProps } from 'antd';
import { Link } from 'react-router';
import type { LoginFormFieldType } from '../types';

type LoginFormInterface = {
    login: (values: LoginFormFieldType) => void;
};

export const LoginForm = ({ login }: LoginFormInterface) => {
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish: FormProps<LoginFormFieldType>['onFinish'] = async (values) => {
        try {
            await Promise.resolve(login(values));
            messageApi.success('Login successful!');
        } catch (error) {
            console.error('Login error:', error);
            messageApi.error('Login failed!');
        }
    };

    const onFinishFailed: FormProps<LoginFormFieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
        messageApi.error('Login failed!');
    };

    return (
        <>
            {contextHolder}
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
                <Form.Item<LoginFormFieldType>
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

                <Form.Item<LoginFormFieldType>
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

                <Form.Item<LoginFormFieldType> name="remember" valuePropName="checked">
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
