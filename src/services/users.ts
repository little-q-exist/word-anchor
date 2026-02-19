import axios from 'axios';

import type { NewUser } from '../types';

import globalConfig from './config';

globalConfig();

const APIURL = `/users`;

const getUserById = async (id: string) => {
    return (await axios.get(`${APIURL}/${id}`)).data;
};

const updateFamiliarity = async (userId: string, wordId: string, familiarity: number) => {
    const response = await axios.patch(`${APIURL}/${userId}/words/${wordId}/familiarity`, {
        familiarity,
    });
    return response.data;
};

const register = async (user: NewUser) => {
    const response = await axios.post(`${APIURL}/register`, user);
    return response.data;
};

export default { getUserById, updateFamiliarity, register };
