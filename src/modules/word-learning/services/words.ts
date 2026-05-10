import axios from 'axios';

import type { BriefWordListWithMode } from '@modules/word-learning/types';

import globalConfig from '@/shared/services/config';

globalConfig();

const APIURL = `/words`;

const getWordToLearn = async (limit?: number): Promise<BriefWordListWithMode> => {
    const response = await axios.get(`${APIURL}/learn${limit ? `?limit=${limit}` : ''}`);
    return response.data;
};

const getWordToReview = async (): Promise<BriefWordListWithMode> => {
    const response = await axios.get(`${APIURL}/review`);
    return response.data;
};

export default { getWordToLearn, getWordToReview };
