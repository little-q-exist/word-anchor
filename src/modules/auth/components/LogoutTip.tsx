import LogoutButton from './LogoutButton';

interface LogoutTipProps {
    extraFn?: () => void;
}

const LogoutTip = ({ extraFn }: LogoutTipProps) => {
    return (
        <div>
            <div>
                Already have an account? <LogoutButton extraFn={extraFn} />
            </div>
        </div>
    );
};

export default LogoutTip;
