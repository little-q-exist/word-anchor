import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
    BriefWordWithLearnStatus,
    LearningMode,
    QueueSnapshot,
} from '@modules/word-learning/types';
import { useMutation } from '@tanstack/react-query';
import learningSessionServices from '@modules/word-learning/services/learningSession';

interface HydrateQueue {
    initialState: QueueSnapshot;
    hydrateKey: string;
}

function isSnapshotEqual(a: QueueSnapshot, b: QueueSnapshot): boolean {
    return (
        a.index === b.index &&
        a.isRepeating === b.isRepeating &&
        a.version === b.version &&
        a.repeatQueue.length === b.repeatQueue.length &&
        a.repeatQueue.every((v, i) => v === b.repeatQueue[i])
    );
}

const useLearnQueue = (
    briefWords?: BriefWordWithLearnStatus[],
    hydrateQueue?: HydrateQueue,
    userId?: string,
    mode?: LearningMode,
) => {
    const [index, setIndex] = useState(0);
    const [repeatQueue, setRepeatQueue] = useState<number[]>([]);
    const [isRepeating, setIsRepeating] = useState(false);
    const [version, setVersion] = useState('');

    const [isFinished, setIsFinished] = useState(false);
    const [appliedHydrateKey, setAppliedHydrateKey] = useState<string | undefined>(undefined);

    const lastSyncedRef = useRef<QueueSnapshot | undefined>(undefined);

    const toNextWord = useCallback(() => {
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
    }, [briefWords, index, isRepeating, repeatQueue]);

    const addToRepeatQueue = useCallback((wordId: string) => {
        if (!briefWords) {
            return;
        }
        setRepeatQueue((queue) => {
            const targetIndex = briefWords.findIndex((w) => w._id === wordId);
            return targetIndex === -1 ? queue : queue.concat(targetIndex);
        });
    }, [briefWords]);

    const handleRepeat = useCallback((familiarity: number) => {
        setRepeatQueue((queue) => {
            const nextQueue = queue.slice(1);
            return familiarity < 4 ? nextQueue.concat(index) : nextQueue;
        });
    }, [index]);

    const queueSnapshot: QueueSnapshot | undefined = useMemo(() => {
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
            userId: mutUserId,
            mode: mutMode,
            queueSnapshot: mutQueueSnapshot,
        }: {
            userId: string;
            mode: LearningMode;
            queueSnapshot: QueueSnapshot;
        }) =>
            learningSessionServices.updateLearningSession(mutUserId, mutMode, {
                queueSnapshot: mutQueueSnapshot,
            }),
        onSuccess(learningSession) {
            lastSyncedRef.current = learningSession.queueSnapshot;
            setIndex(learningSession.queueSnapshot.index);
            setIsRepeating(learningSession.queueSnapshot.isRepeating);
            setRepeatQueue(learningSession.queueSnapshot.repeatQueue);
            setVersion(learningSession.queueSnapshot.version);
        },
        onError(error) {
            console.log('queue snapshot error', error);
        },
    });

    const syncQueueSnapshot = useCallback(() => {
        if (!queueSnapshot || !userId || !mode) {
            return;
        }
        queueSnapshotMutate({ userId, mode, queueSnapshot });
    }, [queueSnapshot, queueSnapshotMutate, userId, mode]);

    useEffect(() => {
        if (!queueSnapshot) {
            return;
        }
        if (!lastSyncedRef.current) {
            lastSyncedRef.current = queueSnapshot;
            return;
        }
        if (isSnapshotEqual(lastSyncedRef.current, queueSnapshot)) {
            return;
        }
        lastSyncedRef.current = queueSnapshot;
        syncQueueSnapshot();
    }, [queueSnapshot, syncQueueSnapshot]);

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
        lastSyncedRef.current = hydrateQueue.initialState;
    }, [appliedHydrateKey, hydrateQueue]);

    return {
        index,
        isRepeating,
        isFinished,
        repeatQueue,
        queueSnapshot,
        toNextWord,
        addToRepeatQueue,
        handleRepeat,
    };
};

export default useLearnQueue;
