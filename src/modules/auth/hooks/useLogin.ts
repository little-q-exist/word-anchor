import { AxiosError } from 'axios';
import type { LoginFormFieldType, StatusType } from '../types';
import authService from '../services/auth';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login as loginAction } from '@/features/userSlice';
import { useNavigate } from 'react-router';

const useLogin = () => {
    const [status, setStatus] = useState<StatusType>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const login = async (values: LoginFormFieldType) => {
        setStatus('loading');
        try {
            const userToken = await authService.login(values);
            setStatus('success');
            if (values.remember) {
                localStorage.setItem('reciteWordAppUser', JSON.stringify(userToken));
            }
            dispatch(loginAction(userToken));
            navigate('..');
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.error('Login failed:', error);
                if (error instanceof AxiosError) {
                    if (
                        typeof error.response?.data?.error === 'string' ||
                        error.response?.data?.error instanceof String
                    ) {
                        setErrorMessage(
                            error.response?.data?.error || error.message || 'Unknown error occurred'
                        );
                    } else {
                        setErrorMessage(error.message || 'Unknown error occurred');
                    }
                }
                setStatus('failed');
            }
        }
    };

    const reset = () => {
        setStatus('idle');
        setErrorMessage('');
    };

    return { login, status, errorMessage, reset };
};

export default useLogin;
