import { Button, Checkbox, Form, Input, type FormProps, type GetProp } from 'antd';
import { Link } from 'react-router';
import type { FieldType } from '../types';

type LoginFormInterface = {
    onFinish: GetProp<FormProps, 'onFinish'>;
    onFinishFailed: GetProp<FormProps, 'onFinishFailed'>;
};

export const LoginForm = ({ onFinish, onFinishFailed }: LoginFormInterface) => {
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
