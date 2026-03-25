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
                wanna log in?{' '}
                <a
                    onClick={() => {
                        dispatch(logout());
                        extraFn();
                    }}
                >
                    Log out first.
                </a>
            </div>
        </div>
    );
};

export default LogoutButton;
