import axios from 'axios';
import { AxiosError } from 'axios';

import { SERVER_URL } from '@/constant';

interface StandardResponse<T = unknown> {
    code: number;
    data: T;
    message: string;
}

const isStandardResponse = (payload: unknown): payload is StandardResponse => {
    if (!payload || typeof payload !== 'object') {
        return false;
    }
    const maybePayload = payload as Record<string, unknown>;
    return (
        typeof maybePayload.code === 'number' &&
        typeof maybePayload.message === 'string' &&
        'data' in maybePayload
    );
};

let configured = false;

export default () => {
    if (configured) {
        return;
    }
    configured = true;

    axios.defaults.baseURL = SERVER_URL;

    axios.interceptors.request.use((config) => {
        const loggedUserJSON = localStorage.getItem('reciteWordAppUser');
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    });

    axios.interceptors.response.use(
        (response) => {
            if (isStandardResponse(response.data)) {
                response.data = response.data.data;
            }
            return response;
        },
        (error: AxiosError) => {
            const errorData = error.response?.data;
            if (isStandardResponse(errorData) && error.response) {
                error.response.data = {
                    ...errorData,
                    error: errorData.message,
                };
            }
            return Promise.reject(error);
        }
    );
};
