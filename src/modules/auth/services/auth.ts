import axios from 'axios';
import type { LoginFormFieldType, NewUser, User } from '@modules/auth/types';

import globalConfig from '@/shared/services/config';

globalConfig();

const LOGIN_API_URL = `/login`;
const LOGOUT_API_URL = `/logout`;
const REGISTER_API_URL = `/users/register`;

const login = async (loginFormField: LoginFormFieldType): Promise<User> => {
    const response = await axios.post(LOGIN_API_URL, loginFormField);
    return response.data;
};

const logout = async () => {
    await axios.post(LOGOUT_API_URL);
};

const register = async (user: NewUser) => {
    const response = await axios.post(REGISTER_API_URL, user);
    return response.data;
};

export default { login, logout, register };
