import learningSessionServices from '@modules/word-learning/services/learningSession';
import useSuccessQuery from './useSuccessQuery';
import { useDispatch } from 'react-redux';
import { toNextStep } from '@/features/LearnWordSlice';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { LearningMode } from '../../types';

const useLearningSession = (mode: 'learn' | 'review', userId?: string, enable: boolean = true) => {
    const queryClient = useQueryClient();
    const learnSessionMutation = useMutation({
        mutationFn: ({ userId, mode }: { userId: string; mode: LearningMode }) =>
            learningSessionServices.createLearningSession(userId, mode),
        onSuccess: async (data) => {
            queryClient.setQueryData(['learningSession', userId, mode], data);
        },
        onError(error) {
            console.error(error);
        },
    });

    const dispatch = useDispatch();
    const learningSessionQuery = useSuccessQuery(
        {
            queryKey: ['learningSession', userId, mode],
            enabled: enable && !!userId,
            queryFn: () => learningSessionServices.getLearningSession(userId!, mode),
            refetchOnWindowFocus: false,
        },
        'fetchingSession',
        (session) => {
            dispatch(toNextStep({ hasSession: !!session }));
            console.log('session', session);
            if (!session) {
                learnSessionMutation.mutate({ userId: userId!, mode });
            }
        }
    );

    return learningSessionQuery;
};

export default useLearningSession;
