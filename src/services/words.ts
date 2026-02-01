import axios from 'axios';

import type { Word } from '../types';

import { SERVER_URL } from '../constant';

const APIURL = `${SERVER_URL}/words`;

const getALL = async () => {
    const response = await axios.get(APIURL);
    return response.data;
};

const update = async (word: Word) => {
    const response = await axios.put(`${APIURL}/${word._id}`, word);
    return response.data;
};

const updateFamiliarity = async (wordId: string, familiarity: number) => {
    const response = await axios.patch(`${APIURL}/${wordId}/familiarity`, {
        familiarity,
    });
    return response.data;
};

export default { getALL, update, updateFamiliarity };
