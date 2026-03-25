import axios from 'axios';

import type { User, UserLearningData, UserStats } from '../../types';

import globalConfig from './config';

globalConfig();

const APIURL = `/users`;

const getUserById = async (id: string): Promise<User> => {
    return (await axios.get(`${APIURL}/${id}`)).data;
};

const updateFamiliarity = async (
    userId: string,
    wordId: string,
    familiarity: number
): Promise<UserLearningData & { shouldRepeat: boolean }> => {
    const response = await axios.patch(`${APIURL}/${userId}/words/${wordId}/familiarity`, {
        familiarity,
    });
    return response.data;
};

const updateFavorite = async (
    userId: string,
    wordId: string
): Promise<Pick<UserLearningData, 'favorited'>> => {
    const response = await axios.patch(`${APIURL}/${userId}/words/${wordId}/favorite`);
    return response.data;
};

const getLearningData = async <T extends keyof UserLearningData>(
    userId: string,
    wordId: string,
    fields?: T[]
): Promise<UserLearningData> => {
    let fieldsString;
    if (fields) {
        fieldsString = fields.join(',');
    }
    const response = await axios.get(
        `${APIURL}/${userId}/words/${wordId}${fields ? `?fields=${fieldsString}` : ''}`
    );
    return response.data;
};

const getUserStats = async (userId: string): Promise<UserStats> => {
    const response = await axios.get(`${APIURL}/${userId}/stats`);
    return response.data;
};

const getUsernameExistence = async (username: string): Promise<{ exists: boolean }> => {
    const response = await axios.get(`${APIURL}/${username}/existence`);
    return response.data;
};

export default {
    getUserById,
    updateFamiliarity,
    updateFavorite,
    getLearningData,
    getUserStats,
    getUsernameExistence,
};
