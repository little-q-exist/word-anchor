import axios from 'axios';
import type { NewUser, User } from '@/types';

import globalConfig from '@/shared/services/config';

globalConfig();

const APIURL = `/login`;

const login = async (user: NewUser): Promise<User> => {
    const response = await axios.post(APIURL, user);
    return response.data;
};

const register = async (user: NewUser) => {
    // TODO
    const response = await axios.post(`/users/register`, user);
    return response.data;
};

export default { login, register };
