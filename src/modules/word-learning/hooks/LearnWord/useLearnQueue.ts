import { useEffect, useMemo, useState } from 'react';
import type { BriefWordWithLearnStatus, LearnQueueSnapshot } from '@/types';

type LearnQueueInitialState = {
    index?: number;
    isRepeating?: boolean;
    repeatQueue?: number[];
};

const sanitizeIndex = (index: number, maxIndex: number) => {
    if (!Number.isFinite(index)) {
        return 0;
    }
    if (index < 0) {
        return 0;
    }
    if (index > maxIndex) {
        return maxIndex;
    }
    return index;
};

const sanitizeRepeatQueue = (repeatQueue: number[], maxIndex: number) => {
    return repeatQueue.filter(
        (repeatIndex) =>
            Number.isInteger(repeatIndex) && repeatIndex >= 0 && repeatIndex <= maxIndex
    );
};

const getNormalizedInitialState = (
    briefWords: BriefWordWithLearnStatus[],
    initialState?: LearnQueueInitialState
) => {
    if (briefWords.length === 0) {
        return { index: 0, isRepeating: false, repeatQueue: [] };
    }

    const maxIndex = briefWords.length - 1;
    const repeatQueue = sanitizeRepeatQueue(initialState?.repeatQueue ?? [], maxIndex);
    const index = sanitizeIndex(initialState?.index ?? 0, maxIndex);
    const isRepeating = Boolean(initialState?.isRepeating) && repeatQueue.length > 0;

    return { index, isRepeating, repeatQueue };
};

const useLearnQueue = (
    briefWords: BriefWordWithLearnStatus[],
    initialState?: LearnQueueInitialState,
    hydrateKey?: string
) => {
    const normalizedInitialState = useMemo(
        () => getNormalizedInitialState(briefWords, initialState),
        [briefWords, initialState]
    );

    const [index, setIndex] = useState(normalizedInitialState.index);
    const [wordToRepeat, setWordToRepeat] = useState<number[]>(normalizedInitialState.repeatQueue);
    const [isRepeating, setIsRepeating] = useState(normalizedInitialState.isRepeating);
    const [isFinished, setIsFinished] = useState(false);
    const [appliedHydrateKey, setAppliedHydrateKey] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!hydrateKey || hydrateKey === appliedHydrateKey) {
            return;
        }

        setIndex(normalizedInitialState.index);
        setWordToRepeat(normalizedInitialState.repeatQueue);
        setIsRepeating(normalizedInitialState.isRepeating);
        setIsFinished(false);
        setAppliedHydrateKey(hydrateKey);
    }, [appliedHydrateKey, hydrateKey, normalizedInitialState]);

    useEffect(() => {
        if (briefWords.length === 0) {
            setIndex(0);
            setWordToRepeat([]);
            setIsRepeating(false);
            setIsFinished(false);
            return;
        }

        const maxIndex = briefWords.length - 1;
        setIndex((prev) => sanitizeIndex(prev, maxIndex));
        setWordToRepeat((prev) => sanitizeRepeatQueue(prev, maxIndex));
    }, [briefWords.length]);

    useEffect(() => {
        if (wordToRepeat.length === 0 && isRepeating) {
            setIsRepeating(false);
        }
    }, [isRepeating, wordToRepeat.length]);

    const toNextWord = () => {
        setIsFinished(false);
        if (!isRepeating) {
            if (index < briefWords.length - 1) {
                setIndex(index + 1);
            } else {
                if (wordToRepeat.length > 0) {
                    setIsRepeating(true);
                    setIndex(wordToRepeat[0]);
                } else {
                    setIsFinished(true);
                    return;
                }
            }
        } else {
            if (wordToRepeat.length > 0) {
                setIndex(wordToRepeat[0]);
            } else {
                setIsFinished(true);
                return;
            }
        }
    };

    const addToRepeatQueue = (wordId: string) => {
        setWordToRepeat((queue) => {
            const targetIndex = briefWords.findIndex((w) => w._id === wordId);
            return targetIndex === -1 ? queue : queue.concat(targetIndex);
        });
    };

    const handleRepeat = (familiarity: number) => {
        setWordToRepeat((queue) => {
            const nextQueue = queue.slice(1);
            return familiarity < 4 ? nextQueue.concat(index) : nextQueue;
        });
    };

    const queueSnapshot: Omit<LearnQueueSnapshot, 'updatedAt'> = useMemo(
        () => ({
            index,
            isRepeating,
            repeatQueue: wordToRepeat,
        }),
        [index, isRepeating, wordToRepeat]
    );

    return {
        index,
        isRepeating,
        isFinished,
        repeatQueue: wordToRepeat,
        queueSnapshot,
        toNextWord,
        addToRepeatQueue,
        handleRepeat,
    };
};

export default useLearnQueue;
