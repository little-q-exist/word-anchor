import { Button, Card, Checkbox, Flex, Form, Input, type FormProps } from 'antd';
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
        <Flex vertical align="center" justify="space-around" style={{ height: '100%' }}>
            <Card>
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
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input placeholder="Username" />
                    </Form.Item>

                    <Form.Item<FieldType>
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
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
                        <Button
                            type="link"
                            htmlType="button"
                            style={{ margin: '.5rem 0' }}
                            onClick={() => navigate('../register', { relative: 'route' })}
                        >
                            Register here!
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Flex>
    );
};

export default Login;
