import { Button, Checkbox, Flex, Form, Input, type FormProps } from 'antd';
import { useNavigate } from 'react-router';

type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
};

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const Login = () => {
    const navigate = useNavigate();
    return (
        <div>
            <h2>login</h2>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item label={null}>
                    <Flex justify="space-around">
                        <Button type="primary" htmlType="submit">
                            Log in
                        </Button>
                        <Button
                            type="default"
                            htmlType="button"
                            onClick={() => navigate('../register', { relative: 'route' })}
                        >
                            Register
                        </Button>
                    </Flex>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Login;
