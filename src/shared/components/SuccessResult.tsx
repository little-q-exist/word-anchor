import { Result } from 'antd';

interface SuccessResultInterface {
    children?: React.ReactNode;
}

const SuccessResult = ({ children }: SuccessResultInterface) => {
    return (
        <Result
            status="success"
            title="You have successfully registered!"
            subTitle="please go back and login again."
            extra={children}
        />
    );
};

export default SuccessResult;
