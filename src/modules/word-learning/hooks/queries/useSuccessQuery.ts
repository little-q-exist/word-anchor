import type { LearnWordStatus } from '@/features/LearnWordSlice';
import type { RootState } from '@/store';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const useSuccessQuery = (
    props: ReturnType<typeof queryOptions>,
    state: LearnWordStatus,
    onSuccess: () => unknown
) => {
    const learnWordState = useSelector((state: RootState) => state.learnWordState);
    const { data, isSuccess } = useQuery(props);

    useEffect(() => {
        if (isSuccess && state === learnWordState) {
            onSuccess();
        }
    }, [isSuccess, learnWordState, onSuccess, state]);

    return { data, isSuccess };
};

export default useSuccessQuery;
