import axios from 'axios';

import { SERVER_URL } from '../constant';
import type { NewUser } from '../types';

const APIURL = `${SERVER_URL}/users`;

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
