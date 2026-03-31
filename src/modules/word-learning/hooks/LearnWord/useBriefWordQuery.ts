import type { BriefWordWithLearnStatus } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import wordServices from '@/shared/services/words';

const useBriefWordQuery = (enable: boolean, mode: 'learn' | 'review') => {
    const briefWordQuery = useQuery({
        queryKey: ['learnWords', mode],
        queryFn: () =>
            mode === 'learn' ? wordServices.getWordToLearn() : wordServices.getWordToReview(),
        refetchOnWindowFocus: false,
        enabled: enable,
    });
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
