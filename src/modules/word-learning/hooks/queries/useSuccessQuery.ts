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
    onSuccess?: (data: TData) => void,
    onError?: (error: TError) => void
) => {
    const onSuccessRef = useRef(onSuccess);
    onSuccessRef.current = onSuccess;
    const onErrorRef = useRef(onError);
    onErrorRef.current = onError;
    const learnWordState = useSelector((state: RootState) => state.learnWordState);
    const query = useQuery(props);

    useEffect(() => {
        if (query.isSuccess && onSuccessRef.current) {
            onSuccessRef.current(query.data);
        }
        if (query.isError && onErrorRef.current) {
            onErrorRef.current(query.error);
        }
    }, [query.isSuccess, query.data, query.isError, query.error, learnWordState, state]);

    return query;
};

export default useSuccessQuery;
