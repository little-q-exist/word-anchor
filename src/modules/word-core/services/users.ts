import axios from 'axios';

import type { UserLearningData } from '@modules/word-core/types';

import globalConfig from '@/shared/services/config';

globalConfig();

const APIURL = `/users`;

const updateFavorite = async (
    userId: string,
    wordId: string
): Promise<Pick<UserLearningData, 'favorited'>> => {
    const response = await axios.patch(`${APIURL}/${userId}/words/${wordId}/favorite`);
    return response.data;
};

export default {
    updateFavorite,
};
