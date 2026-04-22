import axios from 'axios';

import globalConfig from '@/shared/services/config';

globalConfig();

const APIURL = `/words`;

const getTags = async (): Promise<string[]> => {
    const response = await axios.get(`${APIURL}/tags`);
    return response.data;
};

export default { getTags };
