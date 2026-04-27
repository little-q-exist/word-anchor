import { useQuery } from '@tanstack/react-query';
import learningSessionServices from '@modules/word-learning/services/learningSession';

const useLearningSessionQuery = (
    enable: boolean = true,
    userId: string,
    mode: 'learn' | 'review'
) => {
    const learningSessionQuery = useQuery({
        queryKey: ['learningSession', userId, mode],
        enabled: enable,
        queryFn: () => learningSessionServices.getLearningSession(userId, mode),
        refetchOnWindowFocus: false,
    });

    return { learningSessionQuery };
};

export default useLearningSessionQuery;
