import type { RootState } from '@/store';
import type {
    BriefWordWithLearnStatus,
    LearnQueueSnapshot,
    LearningSession,
} from '@modules/word-learning/types';
import axios from 'axios';
import localforage from 'localforage';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import userServices from '@modules/word-learning/services/users';

const DEVICE_ID_KEY = 'recite-word-device-id';

const getOrCreateDeviceId = () => {
    const existing = localStorage.getItem(DEVICE_ID_KEY);
    if (existing) {
        return existing;
    }

    const generated = `device-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(DEVICE_ID_KEY, generated);
    return generated;
};

const getSnapshotUpdatedAt = (snapshot: LearnQueueSnapshot | null) => {
    return snapshot?.updatedAt ?? 0;
};

const shouldUseRemoteSession = (
    remoteSession: LearningSession | null,
    localWords: BriefWordWithLearnStatus[] | null,
    localQueueSnapshot: LearnQueueSnapshot | null
) => {
    if (!remoteSession || remoteSession.words.length === 0) {
        return false;
    }
    if (!localWords || localWords.length === 0) {
        return true;
    }

    return remoteSession.queueSnapshot.updatedAt >= getSnapshotUpdatedAt(localQueueSnapshot);
};

const useWordCache = (mode: 'learn' | 'review' | undefined) => {
    const userId = useSelector((state: RootState) => state.user?._id);
    const [cachedBriefWords, setCachedBriefWords] = useState<BriefWordWithLearnStatus[] | null>(
        null
    );
    const [cachedLastLearnedIndex, setCachedLastLearnedIndex] = useState<number | null>(null);
    const [cachedQueueSnapshot, setCachedQueueSnapshot] = useState<LearnQueueSnapshot | null>(null);
    const [cachedSessionVersion, setCachedSessionVersion] = useState<number | null>(null);
    const [isCacheReady, setIsCacheReady] = useState(false);

    const cacheWordKey = `${userId}-${mode}-briefWords`;
    const cacheIndexKey = `${userId}-${mode}-lastLearnedIndex`;
    const cacheQueueKey = `${userId}-${mode}-learnQueueSnapshot`;

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
            if (!userId || !mode) {
                return;
            }
            try {
                await localforage.setItem(cacheIndexKey, index);
            } catch (error) {
                console.error('Error occurred while setting index in localforage:', error);
            }
        },
        [cacheIndexKey, mode, userId]
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
            await Promise.all([
                localforage.removeItem(cacheWordKey),
                localforage.removeItem(cacheIndexKey),
                localforage.removeItem(cacheQueueKey),
            ]);
        } catch (error) {
            console.error('Error occurred while removing item from localforage:', error);
        }
    }, [cacheWordKey, cacheIndexKey, cacheQueueKey, mode, userId]);

    const syncSessionCache = useCallback(
        async (briefWords: BriefWordWithLearnStatus[], snapshot: LearnQueueSnapshot) => {
            if (!userId || !mode || briefWords.length === 0) {
                return;
            }

            try {
                const response = await userServices.upsertLearningSession(userId, mode, {
                    words: briefWords,
                    queueSnapshot: snapshot,
                    version: cachedSessionVersion ?? undefined,
                    deviceId: getOrCreateDeviceId(),
                });
                setCachedSessionVersion(response.version);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 409) {
                    const latestSession = (
                        error.response.data as { data?: { latest?: LearningSession } }
                    )?.data?.latest;
                    if (latestSession) {
                        setCachedBriefWords(latestSession.words);
                        setCachedQueueSnapshot(latestSession.queueSnapshot);
                        setCachedLastLearnedIndex(latestSession.queueSnapshot.index);
                        setCachedSessionVersion(latestSession.version);

                        await Promise.all([
                            localforage.setItem(cacheWordKey, latestSession.words),
                            localforage.setItem(cacheQueueKey, latestSession.queueSnapshot),
                            localforage.setItem(cacheIndexKey, latestSession.queueSnapshot.index),
                        ]);
                    }
                    return;
                }
                console.error('Error occurred while syncing learning session:', error);
            }
        },
        [cacheIndexKey, cacheQueueKey, cacheWordKey, cachedSessionVersion, mode, userId]
    );

    const removeSessionCache = useCallback(async () => {
        if (!userId || !mode) {
            return;
        }

        try {
            await userServices.deleteLearningSession(userId, mode);
            setCachedSessionVersion(null);
        } catch (error) {
            console.error('Error occurred while deleting learning session:', error);
        }
    }, [mode, userId]);

    useEffect(() => {
        const fetchCachedWords = async () => {
            if (!userId || !mode) {
                return;
            }
            const [cachedWord, cachedQueue, cachedIndex, remoteSession] = await Promise.all([
                getWordCache(),
                getQueueCache(),
                getIndexCache(),
                userServices.getLearningSession(userId, mode).catch(() => null),
            ]);

            const useRemote = shouldUseRemoteSession(remoteSession, cachedWord, cachedQueue);

            if (useRemote && remoteSession) {
                setCachedBriefWords(remoteSession.words);
                setCachedQueueSnapshot(remoteSession.queueSnapshot);
                setCachedLastLearnedIndex(remoteSession.queueSnapshot.index);
                setCachedSessionVersion(remoteSession.version);

                await Promise.all([
                    localforage.setItem(cacheWordKey, remoteSession.words),
                    localforage.setItem(cacheQueueKey, remoteSession.queueSnapshot),
                    localforage.setItem(cacheIndexKey, remoteSession.queueSnapshot.index),
                ]);
            } else {
                if (cachedWord) {
                    setCachedBriefWords(cachedWord);
                }

                if (cachedQueue) {
                    setCachedQueueSnapshot(cachedQueue);
                    setCachedLastLearnedIndex(cachedQueue.index);
                } else if (cachedIndex !== null) {
                    setCachedLastLearnedIndex(cachedIndex);
                }

                if (remoteSession) {
                    setCachedSessionVersion(remoteSession.version);
                }
            }

            setIsCacheReady(true);
        };
        if (userId && mode) {
            fetchCachedWords();
        }
    }, [
        cacheIndexKey,
        cacheQueueKey,
        cacheWordKey,
        getIndexCache,
        getQueueCache,
        getWordCache,
        mode,
        userId,
    ]);

    return {
        cachedBriefWords,
        cachedLastLearnedIndex,
        cachedQueueSnapshot,
        isCacheReady,
        setWordCache,
        removeCache,
        syncSessionCache,
        removeSessionCache,
        setIndexCache,
        setQueueCache,
        cachedSessionVersion,
    };
};

export default useWordCache;
