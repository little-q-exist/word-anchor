import learningSessionServices from '@modules/word-learning/services/learningSession';
import useSuccessQuery from './useSuccessQuery';
import { queryOptions } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { toNextStep } from '@/features/LearnWordSlice';

const useLearningSessionQuery = (
    mode: 'learn' | 'review',
    userId?: string,
    enable: boolean = true
) => {
    const dispatch = useDispatch();
    const learningSessionQuery = useSuccessQuery(
        queryOptions({
            queryKey: ['learningSession', userId, mode],
            
            enabled: enable && !!userId,
            queryFn: () => learningSessionServices.getLearningSession(userId!, mode),
            refetchOnWindowFocus: false,
        }) as ReturnType<typeof queryOptions>,
        'fetchingSession',
        () => dispatch(toNextStep({ hasSession: true }))
    );

    return { learningSessionQuery };
};

export default useLearningSessionQuery;
