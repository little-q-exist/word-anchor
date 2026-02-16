import axios from 'axios';
import type { NewUser } from '../types';

import { SERVER_URL } from '../constant';

const APIURL = `${SERVER_URL}/login`;

const login = async (user: NewUser) => {
    const response = await axios.post(APIURL, user);
    return response.data;
};

export default { login };
