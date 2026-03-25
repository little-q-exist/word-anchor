import { useState } from 'react';
import type { BriefWordWithLearnStatus } from '@/types';

const useLearnQueue = (briefWords: BriefWordWithLearnStatus[]) => {
    const [index, setIndex] = useState(0);
    const [wordToRepeat, setWordToRepeat] = useState<number[]>([]);
    const [isRepeating, setIsRepeating] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const toNextWord = () => {
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

    return { index, isRepeating, isFinished, toNextWord, addToRepeatQueue, handleRepeat };
};

export default useLearnQueue;
