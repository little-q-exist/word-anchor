import axios from 'axios';

import type { NewWord, Word } from '../types';

import globalConfig from './config';

globalConfig();

const APIURL = `/words`;

const getWordToLearn = async (limit: number): Promise<Word[]> => {
    const response = await axios.get(`${APIURL}/learn${limit ? `?limit=${limit}` : ''}`);
    return response.data;
};

const getWordToReview = async (): Promise<Word[]> => {
    const response = await axios.get(`${APIURL}/review`);
    return response.data;
};

interface getParamInterface {
    english?: string;
    meaning?: string;
    tags?: string;
    limit?: number;
    page?: number;
}
const getBy = async (params: getParamInterface): Promise<Word[]> => {
    const response = await axios.get(APIURL, {
        params,
    });
    return response.data;
};

const getCount = async () => {
    const response = await axios.get(`${APIURL}/count`);
    return response.data;
};

const update = async (word: Word) => {
    const response = await axios.put(`${APIURL}/${word._id}`, word);
    return response.data;
};

const post = async (word: NewWord): Promise<Word> => {
    const response = await axios.post(`${APIURL}`, word);
    return response.data;
};

export default { getWordToLearn, getWordToReview, getBy, getCount, update, post };
