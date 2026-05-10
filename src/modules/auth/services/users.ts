import axios from 'axios';

import globalConfig from '@/shared/services/config';

globalConfig();

const APIURL = `/users`;

const getUsernameExistence = async (username: string): Promise<{ exists: boolean }> => {
    const response = await axios.get(`${APIURL}/${username}/existence`);
    return response.data;
};

export default {
    getUsernameExistence,
};
