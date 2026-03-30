import { useQuery, skipToken } from '@tanstack/react-query';
import wordServices from '@/shared/services/words';

const useDetailedWordQuery = (enable: boolean, wordId: string) => {
    const detailedWordQuery = useQuery({
        queryKey: ['word', wordId],
        queryFn: wordId ? () => wordServices.getById(wordId) : skipToken,
        enabled: enable,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    return { detailedWordQuery };
};

export default useDetailedWordQuery;
