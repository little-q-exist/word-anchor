import type { RootState } from '@/store';
import type { BriefWordWithLearnStatus } from '@/types';
import localforage from 'localforage';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const useWordCache = (mode: 'learn' | 'review' | undefined) => {
    const userId = useSelector((state: RootState) => state.user?._id);
    const [cachedBriefWords, setCachedBriefWords] = useState<BriefWordWithLearnStatus[] | null>(
        null
    );
    const [isCacheReady, setIsCacheReady] = useState(false);

    const cacheKey = `${userId ?? 'guest'}-${mode}-briefWords`;

    const getCache = useCallback(async (): Promise<BriefWordWithLearnStatus[] | null> => {
        if (!userId || !mode) {
            return null;
        }
        try {
            const cachedWords = await localforage.getItem<BriefWordWithLearnStatus[]>(cacheKey);
            return cachedWords || null;
        } catch (error) {
            console.error('Error occurred while getting item from localforage:', error);
            return null;
        }
    }, [cacheKey, mode, userId]);

    const setCache = useCallback(
        async (briefWords: BriefWordWithLearnStatus[]) => {
            if (!briefWords || briefWords.length === 0) {
                return;
            }
            if (!userId || !mode) {
                return;
            }
            try {
                await localforage.setItem(cacheKey, briefWords);
            } catch (error) {
                console.error('Error occurred while setting item in localforage:', error);
            }
        },
        [cacheKey, mode, userId]
    );

    const removeCache = useCallback(async () => {
        if (!userId || !mode) {
            return;
        }
        try {
            await localforage.removeItem(cacheKey);
        } catch (error) {
            console.error('Error occurred while removing item from localforage:', error);
        }
    }, [cacheKey, mode, userId]);

    useEffect(() => {
        const fetchCachedWords = async () => {
            const cached = await getCache();
            if (cached) {
                setCachedBriefWords(cached);
            }
            setIsCacheReady(true);
        };
        fetchCachedWords();
    }, [getCache]);

    return { cachedBriefWords, isCacheReady, setCache, removeCache };
};

export default useWordCache;
