import axios from 'axios';

import type {
    LearningMode,
    LearningSession,
    UpsertLearningSessionBody,
} from '@modules/word-learning/types';
import type { User, UserStats } from '@modules/auth/types';
import type { UserLearningData } from '@modules/word-core/types';

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

const getLearningSession = async (
    userId: string,
    mode: LearningMode
): Promise<LearningSession | null> => {
    const response = await axios.get(`${APIURL}/${userId}/learning-sessions/${mode}`);
    return response.data;
};

const upsertLearningSession = async (
    userId: string,
    mode: LearningMode,
    payload: UpsertLearningSessionBody
): Promise<LearningSession> => {
    const response = await axios.put(`${APIURL}/${userId}/learning-sessions/${mode}`, payload);
    return response.data;
};

const deleteLearningSession = async (userId: string, mode: LearningMode): Promise<null> => {
    const response = await axios.delete(`${APIURL}/${userId}/learning-sessions/${mode}`);
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
    getLearningSession,
    upsertLearningSession,
    deleteLearningSession,
    getUsernameExistence,
};
