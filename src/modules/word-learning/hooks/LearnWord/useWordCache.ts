import type { RootState } from '@/store';
import type { BriefWordWithLearnStatus, LearnQueueSnapshot } from '@/types';
import localforage from 'localforage';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const useWordCache = (mode: 'learn' | 'review' | undefined) => {
    const userId = useSelector((state: RootState) => state.user?._id);
    const [cachedBriefWords, setCachedBriefWords] = useState<BriefWordWithLearnStatus[] | null>(
        null
    );
    const [cachedLastLearnedIndex, setCachedLastLearnedIndex] = useState<number | null>(null);
    const [cachedQueueSnapshot, setCachedQueueSnapshot] = useState<LearnQueueSnapshot | null>(null);
    const [isCacheReady, setIsCacheReady] = useState(false);

    const cacheWordKey = `${userId ?? 'guest'}-${mode}-briefWords`;
    const cacheIndexKey = `${userId ?? 'guest'}-${mode}-lastLearnedIndex`;
    const cacheQueueKey = `${userId ?? 'guest'}-${mode}-learnQueueSnapshot`;

    const getWordCache = useCallback(async (): Promise<BriefWordWithLearnStatus[] | null> => {
        if (!userId || !mode) {
            return null;
        }
        try {
            const cachedWords = await localforage.getItem<BriefWordWithLearnStatus[]>(cacheWordKey);
            return cachedWords || null;
        } catch (error) {
            console.error('Error occurred while getting item from localforage:', error);
            return null;
        }
    }, [cacheWordKey, mode, userId]);

    const getIndexCache = useCallback(async (): Promise<number | null> => {
        if (!userId || !mode) {
            return null;
        }
        try {
            const cachedIndex = await localforage.getItem<number>(cacheIndexKey);
            return cachedIndex ?? null;
        } catch (error) {
            console.error('Error occurred while getting index from localforage:', error);
            return null;
        }
    }, [cacheIndexKey, mode, userId]);

    const getQueueCache = useCallback(async (): Promise<LearnQueueSnapshot | null> => {
        if (!userId || !mode) {
            return null;
        }
        try {
            const cachedQueue = await localforage.getItem<LearnQueueSnapshot>(cacheQueueKey);
            return cachedQueue ?? null;
        } catch (error) {
            console.error('Error occurred while getting queue snapshot from localforage:', error);
            return null;
        }
    }, [cacheQueueKey, mode, userId]);

    const setWordCache = useCallback(
        async (briefWords: BriefWordWithLearnStatus[]) => {
            if (!briefWords || briefWords.length === 0) {
                return;
            }
            if (!userId || !mode) {
                return;
            }
            try {
                await localforage.setItem(cacheWordKey, briefWords);
            } catch (error) {
                console.error('Error occurred while setting item in localforage:', error);
            }
        },
        [cacheWordKey, mode, userId]
    );

    const setIndexCache = useCallback(
        async (index: number) => {
            try {
                await localforage.setItem(cacheIndexKey, index);
            } catch (error) {
                console.error('Error occurred while setting index in localforage:', error);
            }
        },
        [cacheIndexKey]
    );

    const setQueueCache = useCallback(
        async (snapshot: Omit<LearnQueueSnapshot, 'updatedAt'>) => {
            if (!userId || !mode) {
                return;
            }
            try {
                const queueSnapshot: LearnQueueSnapshot = {
                    ...snapshot,
                    updatedAt: Date.now(),
                };
                await localforage.setItem(cacheQueueKey, queueSnapshot);
                await localforage.setItem(cacheIndexKey, snapshot.index);
            } catch (error) {
                console.error('Error occurred while setting queue snapshot in localforage:', error);
            }
        },
        [cacheIndexKey, cacheQueueKey, mode, userId]
    );

    const removeCache = useCallback(async () => {
        if (!userId || !mode) {
            return;
        }
        try {
            await localforage.removeItem(cacheWordKey);
            await localforage.removeItem(cacheIndexKey);
            await localforage.removeItem(cacheQueueKey);
        } catch (error) {
            console.error('Error occurred while removing item from localforage:', error);
        }
    }, [cacheWordKey, cacheIndexKey, cacheQueueKey, mode, userId]);

    useEffect(() => {
        const fetchCachedWords = async () => {
            const cachedWord = await getWordCache();
            if (cachedWord) {
                setCachedBriefWords(cachedWord);
            }

            const cachedQueue = await getQueueCache();
            if (cachedQueue) {
                setCachedQueueSnapshot(cachedQueue);
                setCachedLastLearnedIndex(cachedQueue.index);
            } else {
                const cachedIndex = await getIndexCache();
                if (cachedIndex !== null) {
                    setCachedLastLearnedIndex(cachedIndex);
                }
            }

            setIsCacheReady(true);
        };
        fetchCachedWords();
    }, [getIndexCache, getQueueCache, getWordCache]);

    return {
        cachedBriefWords,
        cachedLastLearnedIndex,
        cachedQueueSnapshot,
        isCacheReady,
        setWordCache,
        removeCache,
        setIndexCache,
        setQueueCache,
    };
};

export default useWordCache;
