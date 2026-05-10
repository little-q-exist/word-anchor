import axios from 'axios';

import type { LearningMode, LearningSession, QueueSnapshot } from '@modules/word-learning/types';

import globalConfig from '@/shared/services/config';

globalConfig();

const APIURL = `/users`;

const getLearningSession = async (
    userId: string,
    mode: LearningMode
): Promise<LearningSession | null> => {
    const response = await axios.get(`${APIURL}/${userId}/learning-sessions/${mode}`);
    return response.data;
};

const createLearningSession = async (
    userId: string,
    mode: LearningMode
): Promise<LearningSession> => {
    const response = await axios.post(`${APIURL}/${userId}/learning-sessions/${mode}`);
    return response.data;
};

const updateLearningSession = async (
    userId: string,
    mode: LearningMode,
    payload: { queueSnapshot: QueueSnapshot }
): Promise<LearningSession> => {
    const response = await axios.patch(`${APIURL}/${userId}/learning-sessions/${mode}`, payload);
    return response.data;
};

const deleteLearningSession = async (userId: string, mode: LearningMode): Promise<null> => {
    const response = await axios.delete(`${APIURL}/${userId}/learning-sessions/${mode}`);
    return response.data;
};

export default {
    getLearningSession,
    createLearningSession,
    updateLearningSession,
    deleteLearningSession,
};
