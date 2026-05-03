import learningSessionServices from '@modules/word-learning/services/learningSession';
import useSuccessQuery from './useSuccessQuery';
import { useDispatch } from 'react-redux';
import { toNextStep } from '@/features/LearnWordSlice';

const useLearningSessionQuery = (
    mode: 'learn' | 'review',
    userId?: string,
    enable: boolean = true
) => {
    const dispatch = useDispatch();
    const learningSessionQuery = useSuccessQuery(
        {
            queryKey: ['learningSession', userId, mode],
            enabled: enable && !!userId,
            queryFn: () => learningSessionServices.getLearningSession(userId!, mode),
            refetchOnWindowFocus: false,
        },
        'fetchingSession',
        (session) => dispatch(toNextStep({ hasSession: !!session }))
    );

    const learningSession = learningSessionQuery.data;
    const isLearningSessionLoading = learningSessionQuery.status === 'pending';
    const isLearningSessionError = learningSessionQuery.status === 'error';

    return {
        learningSession,
        isLearningSessionLoading,
        isLearningSessionError,
    };
};

export default useLearningSessionQuery;
