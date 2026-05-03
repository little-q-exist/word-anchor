import type { BriefWordWithLearnStatus } from '@modules/word-learning/types';
import { useMemo } from 'react';
import wordServices from '@modules/word-learning/services/words';
import useResultQuery from './useSuccessQuery';
import { toNextStep } from '@/features/LearnWordSlice';
import { useDispatch } from 'react-redux';

const useBriefWordQuery = (mode: 'learn' | 'review', enable: boolean = true) => {
    const dispatch = useDispatch();
    const briefWordQuery = useResultQuery(
        {
            queryKey: ['briefWords', mode],
            queryFn: () =>
                mode === 'learn' ? wordServices.getWordToLearn() : wordServices.getWordToReview(),
            refetchOnWindowFocus: false,
            enabled: enable,
        },
        'fetchingBriefWords',
        () => dispatch(toNextStep())
    );
    const briefWordsWithStatus: BriefWordWithLearnStatus[] = useMemo(() => {
        const loadedWords = briefWordQuery.data?.words || [];
        return (
            loadedWords.map((briefWord) => {
                return { ...briefWord, status: 'idle' };
            }) || []
        );
    }, [briefWordQuery.data?.words]);

    const isBriefWordLoading = briefWordQuery.status === 'pending';
    const isBriefWordError = briefWordQuery.status === 'error';
    const canShowBriefWord = !!(briefWordQuery.status === 'success' && briefWordQuery.data);
    const isBriefWordQueryEnabled = enable;

    return {
        briefWordsWithStatus,
        isBriefWordQueryEnabled,
        isBriefWordLoading,
        isBriefWordError,
        canShowBriefWord,
    };
};

export default useBriefWordQuery;
