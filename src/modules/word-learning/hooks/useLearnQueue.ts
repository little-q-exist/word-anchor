import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
    BriefWordWithLearnStatus,
    LearningMode,
    QueueSnapshot,
} from '@modules/word-learning/types';
import { useMutation } from '@tanstack/react-query';
import learningSessionServices from '@modules/word-learning/services/learningSession';
import { useWhyDidYouUpdate } from 'use-why-did-you-update';

interface HydrateQueue {
    initialState: QueueSnapshot;
    hydrateKey: string;
}

const useLearnQueue = (briefWords?: BriefWordWithLearnStatus[], hydrateQueue?: HydrateQueue) => {
    const [index, setIndex] = useState(0);
    const [repeatQueue, setRepeatQueue] = useState<number[]>([]);
    const [isRepeating, setIsRepeating] = useState(false);
    const [version, setVersion] = useState('');

    const [isFinished, setIsFinished] = useState(false);
    const [appliedHydrateKey, setAppliedHydrateKey] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!hydrateQueue || hydrateQueue.hydrateKey === appliedHydrateKey) {
            return;
        }

        setIndex(hydrateQueue.initialState.index);
        setRepeatQueue(hydrateQueue.initialState.repeatQueue);
        setIsRepeating(hydrateQueue.initialState.isRepeating);
        setVersion(hydrateQueue.initialState.version);
        setIsFinished(false);
        setAppliedHydrateKey(hydrateQueue.hydrateKey);
    }, [appliedHydrateKey, hydrateQueue]);

    const toNextWord = () => {
        if (!briefWords) {
            return;
        }
        if (!isRepeating) {
            if (index < briefWords.length - 1) {
                setIndex(index + 1);
            } else {
                if (repeatQueue.length > 0) {
                    setIsRepeating(true);
                    setIndex(repeatQueue[0]);
                } else {
                    setIsFinished(true);
                }
            }
        } else {
            if (repeatQueue.length > 0) {
                setIndex(repeatQueue[0]);
            } else {
                setIsFinished(true);
            }
        }
    };

    const addToRepeatQueue = (wordId: string) => {
        if (!briefWords) {
            return;
        }
        setRepeatQueue((queue) => {
            const targetIndex = briefWords.findIndex((w) => w._id === wordId);
            return targetIndex === -1 ? queue : queue.concat(targetIndex);
        });
    };

    const handleRepeat = (familiarity: number) => {
        setRepeatQueue((queue) => {
            const nextQueue = queue.slice(1);
            return familiarity < 4 ? nextQueue.concat(index) : nextQueue;
        });
    };

    useWhyDidYouUpdate('queueSnapshot', { hydrateQueue, index, isRepeating, repeatQueue, version });

    const queueSnapshot: QueueSnapshot | undefined = useMemo(() => {
        console.info('queueSnapshot created');
        return hydrateQueue
            ? {
                  index,
                  isRepeating,
                  repeatQueue,
                  version,
              }
            : undefined;
    }, [hydrateQueue, index, isRepeating, repeatQueue, version]);

    const { mutate: queueSnapshotMutate } = useMutation({
        mutationFn: ({
            userId,
            mode,
            queueSnapshot,
        }: {
            userId: string;
            mode: LearningMode;
            queueSnapshot: QueueSnapshot;
        }) =>
            learningSessionServices.updateLearningSession(userId, mode, {
                queueSnapshot,
            }),
        onSuccess(learningSession) {
            setIndex(learningSession.queueSnapshot.index);
            setIsRepeating(learningSession.queueSnapshot.isRepeating);
            setRepeatQueue(learningSession.queueSnapshot.repeatQueue);
            setVersion(learningSession.queueSnapshot.version);
        },
        onError(error) {
            console.log('queue snapshot error', error);
        },
    });

    const syncQueueSnapshot = useCallback(
        (userId: string, mode: LearningMode) => {
            if (!queueSnapshot) {
                return;
            }
            queueSnapshotMutate({ userId, mode, queueSnapshot });
        },
        [queueSnapshot, queueSnapshotMutate]
    );

    return {
        index,
        isRepeating,
        isFinished,
        repeatQueue,
        queueSnapshot,
        toNextWord,
        addToRepeatQueue,
        handleRepeat,
        syncQueueSnapshot,
    };
};

export default useLearnQueue;
