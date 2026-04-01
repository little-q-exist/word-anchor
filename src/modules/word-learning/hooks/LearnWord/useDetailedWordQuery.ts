import { useQuery, skipToken } from '@tanstack/react-query';
import wordServices from '@/shared/services/words';

const useDetailedWordQuery = (enable: boolean, wordId?: string) => {
    const shouldFetch = enable && !!wordId;

    const detailedWordQuery = useQuery({
        queryKey: ['word', wordId],
        queryFn: shouldFetch ? () => wordServices.getById(wordId!) : skipToken,
        enabled: shouldFetch,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    return { detailedWordQuery };
};

export default useDetailedWordQuery;
