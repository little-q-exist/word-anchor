import { useDispatch } from 'react-redux';
import { logout } from '@/features/userSlice';

interface LogoutButtonProps {
    extraFn: () => void;
}

const LogoutButton = ({ extraFn }: LogoutButtonProps) => {
    const dispatch = useDispatch();

    return (
        <div>
            <div>
                Already have an account?{' '}
                <a
                    onClick={() => {
                        dispatch(logout());
                        extraFn();
                    }}
                >
                    Log out
                </a>
            </div>
        </div>
    );
};

export default LogoutButton;
