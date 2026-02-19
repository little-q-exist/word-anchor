import axios from 'axios';
import type { NewUser } from '../types';

import globalConfig from './config';

globalConfig();

const APIURL = `/login`;

const login = async (user: NewUser) => {
    const response = await axios.post(APIURL, user);
    return response.data;
};

export default { login };
