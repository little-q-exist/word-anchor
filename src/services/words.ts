import axios from 'axios';

import type { Word } from '../types';

import globalConfig from './config';

globalConfig();

const APIURL = `/words`;

const getALL = async () => {
    const response = await axios.get(APIURL);
    return response.data;
};

const update = async (word: Word) => {
    const response = await axios.put(`${APIURL}/${word._id}`, word);
    return response.data;
};

export default { getALL, update };
