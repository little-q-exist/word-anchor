import { useDispatch } from 'react-redux';
import { logout } from '@/features/userSlice';
import authService from '@modules/auth/services/auth';
import { useMutation } from '@tanstack/react-query';

interface LogoutButtonProps {
    extraFn?: () => void;
}

const LogoutButton = ({ extraFn }: LogoutButtonProps) => {
    const dispatch = useDispatch();

    const logoutMutation = useMutation({
        mutationFn: authService.logout,
        mutationKey: ['logout'],
        retry: 3,
    });

    return (
        <a
            onClick={() => {
                logoutMutation.mutate();
                dispatch(logout());
                if (extraFn) {
                    extraFn();
                }
            }}
        >
            Log out
        </a>
    );
};

export default LogoutButton;
