import axios from 'axios';

import { SERVER_URL } from '../constant';

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

export default { getUserById, updateFamiliarity };
