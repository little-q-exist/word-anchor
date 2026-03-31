import { useCallback, useRef } from 'react';

export const useDebounce = <T>(callback: (value: T) => void, delay: number) => {
    const timer = useRef<NodeJS.Timeout | null>(null);

    return useCallback(
        (value: T) => {
            if (timer.current) {
                clearTimeout(timer.current);
            }
            timer.current = setTimeout(() => {
                callback(value);
            }, delay);
        },
        [callback, delay]
    );
};
