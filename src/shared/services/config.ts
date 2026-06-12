import axios from 'axios';
import { AxiosError } from 'axios';

import { SERVER_URL } from '@/constant';
import { getAccessTokenUser, setAccessTokenUser } from './tokenStore';
import type { User } from '@/modules/auth/types';

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

let refreshPromise: Promise<string> | null = null;

const refreshToken = (): Promise<string> => {
    if (!refreshPromise) {
        refreshPromise = axios
            .post<User>('/api/refresh', undefined, {
                withCredentials: true,
                baseURL: SERVER_URL,
            })
            .then((res) => {
                setAccessTokenUser(JSON.stringify(res.data));
                return res.data.accessToken;
            })
            .finally(() => (refreshPromise = null));
    }
    return refreshPromise;
};

export default () => {
    if (configured) {
        return;
    }
    configured = true;

    axios.defaults.baseURL = SERVER_URL;

    axios.defaults.withCredentials = true;

    axios.interceptors.request.use((config) => {
        const accessTokenUser = getAccessTokenUser();
        if (accessTokenUser) {
            const accessToken = (JSON.parse(accessTokenUser) as User).accessToken;
            config.headers.Authorization = `Bearer ${accessToken}`;
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

    axios.interceptors.response.use(
        (res) => res,
        async (error: AxiosError) => {
            const originalRequest = error.config;

            if (
                !originalRequest ||
                originalRequest.url?.includes('/api/refresh') ||
                error.response?.status !== 401 ||
                originalRequest?._retry
            ) {
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            try {
                const newAccessToken = await refreshToken();
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axios(originalRequest);
            } catch (error) {
                return Promise.reject(error);
            }
        }
    );
};
