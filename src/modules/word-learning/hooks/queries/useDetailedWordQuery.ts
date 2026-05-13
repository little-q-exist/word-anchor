import { skipToken } from '@tanstack/react-query';
import wordServices from '@modules/word-core/services/words';
import useSuccessQuery from './useSuccessQuery';

const useDetailedWordQuery = (wordId?: string, enable: boolean = true) => {
    const shouldFetch = enable && !!wordId;

    const detailedWordQuery = useSuccessQuery({
        queryKey: ['word', wordId],
        queryFn: shouldFetch ? () => wordServices.getById(wordId!) : skipToken,
        enabled: shouldFetch,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    return detailedWordQuery;
};

export default useDetailedWordQuery;
