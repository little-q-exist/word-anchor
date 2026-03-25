import { AxiosError } from 'axios';
import { useState } from 'react';
import type { RegisterFormFieldType, StatusType } from '../index';
import authService from '../services/auth';

export const useRegister = () => {
    const [status, setStatus] = useState<StatusType>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const register = async (values: RegisterFormFieldType) => {
        setStatus('loading');
        try {
            await authService.register(values);
            setStatus('success');
        } catch (error: unknown) {
            console.error('Registration failed:', error);
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
    };

    const reset = () => {
        setStatus('idle');
        setErrorMessage('');
    };

    return { register, status, errorMessage, reset };
};
