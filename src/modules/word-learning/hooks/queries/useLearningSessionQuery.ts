import learningSessionServices from '@modules/word-learning/services/learningSession';
import useSuccessQuery from './useSuccessQuery';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import type { LearningMode } from '@modules/word-learning/types';

const useLearningSession = (mode: 'learn' | 'review', userId?: string, enable: boolean = true) => {
    const queryClient = useQueryClient();
    const hasMutated = useRef(false);
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

    const learningSessionQuery = useSuccessQuery(
        {
            queryKey: ['learningSession', userId, mode],
            enabled: enable && !!userId,
            queryFn: () => learningSessionServices.getLearningSession(userId!, mode),
            refetchOnWindowFocus: false,
        },
        (session) => {
            if (!session && !hasMutated.current) {
                hasMutated.current = true;
                learnSessionMutation.mutate({ userId: userId!, mode });
            }
        }
    );

    return { learningSessionQuery, noWordReturned: hasMutated.current };
};

export default useLearningSession;
