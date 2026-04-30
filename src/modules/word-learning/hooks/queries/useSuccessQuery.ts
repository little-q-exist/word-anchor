import type { LearnWordStatus } from '@/features/LearnWordSlice';
import type { RootState } from '@/store';
import { useQuery, type UseQueryOptions, type QueryKey } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const useSuccessQuery = <
    TQueryFnData = unknown,
    TError = Error,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
>(
    props: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    state: LearnWordStatus,
    onSuccess: () => unknown
) => {
    const onSuccessRef = useRef(onSuccess);
    onSuccessRef.current = onSuccess;
    const learnWordState = useSelector((state: RootState) => state.learnWordState);
    const query = useQuery(props);

    useEffect(() => {
        if (query.isSuccess && state === learnWordState) {
            onSuccessRef.current();
        }
    }, [query.isSuccess, learnWordState, state]);

    return query;
};

export default useSuccessQuery;
