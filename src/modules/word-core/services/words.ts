import axios from 'axios';

import type { Word } from '@modules/word-core/types';

import globalConfig from '@/shared/services/config';

globalConfig();

const APIURL = `/words`;

interface getParamInterface {
    english?: string;
    meaning?: string;
    tags?: string;
    limit?: number;
    page?: number;
}
const getBy = async (params: getParamInterface): Promise<{ words: Word[]; count: number }> => {
    const response = await axios.get(APIURL, {
        params,
    });
    return response.data;
};

const getById = async (id: string): Promise<Word> => {
    const response = await axios.get(`${APIURL}/${id}`);
    return response.data;
};

export default { getBy, getById };
