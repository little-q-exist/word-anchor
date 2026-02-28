import { Result } from 'antd';

const FailedResult = ({ message, children }: { message?: string; children?: React.ReactNode }) => {
    return (
        <Result
            status="error"
            title="Opps! Something went wrong."
            subTitle={message || 'please go back or try again.'}
            extra={children}
        />
    );
};

export default FailedResult;
