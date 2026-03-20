import { Button, Checkbox, Form, Input, message, type FormProps } from 'antd';
import type { RegisterFormFieldType } from '../types';
import userService from '../../../services/users';

type RegisterFormInterface = {
    // eslint-disable-next-line no-unused-vars
    register: (_values: RegisterFormFieldType) => void;
};

export const RegisterForm = ({ register }: RegisterFormInterface) => {
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish: FormProps<RegisterFormFieldType>['onFinish'] = async (values) => {
        register(values);
    };

    const onFinishFailed: FormProps<RegisterFormFieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
        messageApi.error('Registration failed!');
    };

    return (
        <>
            {contextHolder}
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
                <Form.Item<RegisterFormFieldType>
                    label="Username"
                    name="username"
                    validateDebounce={1000}
                    hasFeedback
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
                    <Input />
                </Form.Item>

                <Form.Item<RegisterFormFieldType>
                    label="Email"
                    name="email"
                    rules={[{ type: 'email' }]}
                    hasFeedback
                >
                    <Input />
                </Form.Item>

                <Form.Item<RegisterFormFieldType>
                    label="Password"
                    name="password"
                    hasFeedback
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

                <Form.Item<RegisterFormFieldType>
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
