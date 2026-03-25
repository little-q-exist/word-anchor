import type { RootState } from '@/store';
import type { BriefWordWithLearnStatus } from '@/types';
import localforage from 'localforage';
import { useSelector } from 'react-redux';

const useWordCache = (
    mode: 'learn' | 'review' | undefined,
    briefWords: BriefWordWithLearnStatus[]
) => {
    console.log(localforage);
    const userId = useSelector((state: RootState) => state.user?._id);
    if (!mode || briefWords.length === 0 || !userId) {
        return;
    }

    const cacheKey = `${userId}-${mode}-briefWords`;

    const getCache = async (): Promise<BriefWordWithLearnStatus[] | null> => {
        try {
            const cachedWords = await localforage.getItem<BriefWordWithLearnStatus[]>(cacheKey);
            return cachedWords || null;
        } catch (error) {
            console.error('Error occurred while getting item from localforage:', error);
            return null;
        }
    };

    const setCache = async () => {
        const cachedWords = await localforage.getItem<BriefWordWithLearnStatus[]>(cacheKey);
        if (!cachedWords) {
            try {
                await localforage.setItem(cacheKey, briefWords);
            } catch (error) {
                console.error('Error occurred while setting item in localforage:', error);
            }
        }
    };

    const removeCache = async () => {
        try {
            await localforage.removeItem(cacheKey);
        } catch (error) {
            console.error('Error occurred while removing item from localforage:', error);
        }
    };

    return { getCache, setCache, removeCache };
};

export default useWordCache;
