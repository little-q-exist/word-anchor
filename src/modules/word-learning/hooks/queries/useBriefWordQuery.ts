import type { BriefWordWithLearnStatus } from '@modules/word-learning/types';
import { useMemo } from 'react';
import wordServices from '@modules/word-learning/services/words';
import useSuccessQuery from './useSuccessQuery';
import { toNextStep } from '@/features/LearnWordSlice';
import { useDispatch } from 'react-redux';

const useBriefWordQuery = (enable: boolean = true, mode: 'learn' | 'review') => {
    const dispatch = useDispatch();
    const briefWordQuery = useSuccessQuery(
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
