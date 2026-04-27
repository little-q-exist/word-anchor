import axios from 'axios';

import type {
    LearningMode,
    LearningSession,
    UpsertLearningSessionBody,
} from '@modules/word-learning/types';

import globalConfig from '@/shared/services/config';

globalConfig();

const APIURL = `/users`;

export const getLearningSession = async (
    userId: string,
    mode: LearningMode
): Promise<LearningSession | null> => {
    const response = await axios.get(`${APIURL}/${userId}/learning-sessions/${mode}`);
    return response.data;
};

export const upsertLearningSession = async (
    userId: string,
    mode: LearningMode,
    payload: UpsertLearningSessionBody
): Promise<LearningSession> => {
    const response = await axios.put(`${APIURL}/${userId}/learning-sessions/${mode}`, payload);
    return response.data;
};

export const deleteLearningSession = async (userId: string, mode: LearningMode): Promise<null> => {
    const response = await axios.delete(`${APIURL}/${userId}/learning-sessions/${mode}`);
    return response.data;
};

export default {
    getLearningSession,
    upsertLearningSession,
    deleteLearningSession,
};
