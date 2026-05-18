import { Result } from 'antd';

const FailedResult = ({ message, children }: { message?: string; children?: React.ReactNode }) => {
    return (
        <Result
            status="error"
            title="Operation failed"
            subTitle={message || 'Please go back and try again.'}
            extra={children}
        />
    );
};

export default FailedResult;
