import { Result } from 'antd';

interface SuccessResultInterface {
    children?: React.ReactNode;
}

const SuccessResult = ({ children }: SuccessResultInterface) => {
    return (
        <Result
            status="success"
            title="Registration successful"
            subTitle="Please go back and log in again."
            extra={children}
        />
    );
};

export default SuccessResult;
