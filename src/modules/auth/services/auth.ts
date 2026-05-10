import axios from 'axios';
import type { NewUser, User } from '@modules/auth/types';

import globalConfig from '@/shared/services/config';

globalConfig();

const LOGIN_API_URL = `/login`;
const REGISTER_API_URL = `/users/register`;

const login = async (user: NewUser): Promise<User> => {
    const response = await axios.post(LOGIN_API_URL, user);
    return response.data;
};

const register = async (user: NewUser) => {
    const response = await axios.post(REGISTER_API_URL, user);
    return response.data;
};

export default { login, register };
