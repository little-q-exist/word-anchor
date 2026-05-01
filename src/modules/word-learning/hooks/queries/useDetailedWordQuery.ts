import { skipToken } from '@tanstack/react-query';
import wordServices from '@modules/word-core/services/words';
import useSuccessQuery from './useSuccessQuery';
import { toNextStep } from '@/features/LearnWordSlice';
import { useDispatch } from 'react-redux';

const useDetailedWordQuery = (enable: boolean, wordId?: string) => {
    const dispatch = useDispatch();
    const shouldFetch = enable && !!wordId;

    const detailedWordQuery = useSuccessQuery(
        {
            queryKey: ['word', wordId],
            queryFn: shouldFetch ? () => wordServices.getById(wordId!) : skipToken,
            enabled: shouldFetch,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        },
        'fetchingDetailedWord',
        () => dispatch(toNextStep())
    );

    return { detailedWordQuery };
};

export default useDetailedWordQuery;
