import axios from 'axios';

import type { UserLearningData } from '@modules/word-core/types';
import type { UserStats } from '@modules/auth/types';

import globalConfig from '@/shared/services/config';

globalConfig();

const APIURL = `/users`;

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

export default {
    updateFamiliarity,
    getLearningData,
    getUserStats,
};
