import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { BriefWordWithLearnStatus, QueueSnapshot } from '@modules/word-learning/types';
import type { UseMutationResult } from '@tanstack/react-query';

const mockMutate = vi.fn();
let capturedOnSuccess: ((data: unknown) => void) | undefined;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let capturedOnError: ((error: unknown) => void) | undefined;

vi.mock('@tanstack/react-query', () => ({
    useMutation: vi.fn(
        (options: {
            mutationFn: (...args: unknown[]) => unknown;
            onSuccess?: (data: unknown) => void;
            onError?: (error: unknown) => void;
        }): Partial<UseMutationResult> => {
            capturedOnSuccess = options.onSuccess;
            capturedOnError = options.onError;
            return {
                mutate: mockMutate,
                data: undefined,
                isPending: false,
                isError: false,
                isSuccess: false,
            };
        }
    ),
}));

vi.mock('@modules/word-learning/services/learningSession', () => ({
    default: {
        updateLearningSession: vi.fn(),
    },
}));

import useLearnQueue from './useLearnQueue';

const makeWord = (id: string, english = 'word'): BriefWordWithLearnStatus => ({
    _id: id,
    english,
    status: 'idle' as const,
});

const makeSnapshot = (overrides: Partial<QueueSnapshot> = {}): QueueSnapshot => ({
    index: 0,
    isRepeating: false,
    repeatQueue: [],
    version: '',
    ...overrides,
});

const threeWords = [makeWord('w1', 'one'), makeWord('w2', 'two'), makeWord('w3', 'three')];

describe('useLearnQueue', () => {
    beforeEach(() => {
        mockMutate.mockClear();
        capturedOnSuccess = undefined;
        capturedOnError = undefined;
        vi.clearAllMocks();
    });

    // ── Initial state ──
    describe('initial state', () => {
        it('returns default values when no hydrateQueue is provided', () => {
            const { result } = renderHook(() => useLearnQueue());
            expect(result.current.index).toBe(0);
            expect(result.current.isRepeating).toBe(false);
            expect(result.current.isFinished).toBe(false);
            expect(result.current.repeatQueue).toEqual([]);
            expect(result.current.queueSnapshot).toBeUndefined();
        });

        it('does not compute queueSnapshot when hydrateQueue is not provided', () => {
            const { result } = renderHook(() => useLearnQueue(threeWords));
            expect(result.current.queueSnapshot).toBeUndefined();
        });
    });

    // ── Hydration ──
    describe('hydration', () => {
        it('hydrates state from hydrateQueue on first render', () => {
            const hydrateQueue = {
                initialState: makeSnapshot({ index: 2, repeatQueue: [0, 1], version: 'abc' }),
                hydrateKey: 'key-1',
            };
            const { result } = renderHook(() => useLearnQueue(threeWords, hydrateQueue));
            expect(result.current.index).toBe(2);
            expect(result.current.repeatQueue).toEqual([0, 1]);
            expect(result.current.queueSnapshot?.version).toBe('abc');
            expect(result.current.isFinished).toBe(false);
        });

        it('does not re-hydrate when the same hydrateKey is used', () => {
            const hydrateQueue = {
                initialState: makeSnapshot({ index: 1 }),
                hydrateKey: 'key-1',
            };
            const { result, rerender } = renderHook(
                (props) => useLearnQueue(threeWords, props.hydrateQueue),
                { initialProps: { hydrateQueue } }
            );
            expect(result.current.index).toBe(1);

            // Simulate local state change
            act(() => {
                result.current.toNextWord();
            });
            expect(result.current.index).toBe(2);

            // Re-render with the same hydrateKey — should keep local state
            rerender({ hydrateQueue: { ...hydrateQueue } });
            expect(result.current.index).toBe(2);
        });

        it('re-hydrates when hydrateKey changes', () => {
            const { result, rerender } = renderHook(
                (props: { hydrateQueue: { initialState: QueueSnapshot; hydrateKey: string } }) =>
                    useLearnQueue(threeWords, props.hydrateQueue),
                {
                    initialProps: {
                        hydrateQueue: {
                            initialState: makeSnapshot({ index: 0 }),
                            hydrateKey: 'key-1',
                        },
                    },
                }
            );
            expect(result.current.index).toBe(0);

            rerender({
                hydrateQueue: {
                    initialState: makeSnapshot({ index: 2, repeatQueue: [1] }),
                    hydrateKey: 'key-2',
                },
            });
            expect(result.current.index).toBe(2);
            expect(result.current.repeatQueue).toEqual([1]);
        });
    });

    // ── toNextWord ──
    describe('toNextWord', () => {
        it('advances index when not repeating and not at the end', () => {
            const hydrateQueue = {
                initialState: makeSnapshot({ index: 0 }),
                hydrateKey: 'k',
            };
            const { result } = renderHook(() => useLearnQueue(threeWords, hydrateQueue));
            act(() => {
                result.current.toNextWord();
            });
            expect(result.current.index).toBe(1);
            expect(result.current.isRepeating).toBe(false);
        });

        it('enters repeat mode when at last word and repeatQueue has items', () => {
            const hydrateQueue = {
                initialState: makeSnapshot({ index: 2, repeatQueue: [0] }),
                hydrateKey: 'k',
            };
            const { result } = renderHook(() => useLearnQueue(threeWords, hydrateQueue));
            act(() => {
                result.current.toNextWord();
            });
            expect(result.current.isRepeating).toBe(true);
            expect(result.current.index).toBe(0);
        });

        it('finishes when at last word and repeatQueue is empty', () => {
            const hydrateQueue = {
                initialState: makeSnapshot({ index: 2 }),
                hydrateKey: 'k',
            };
            const { result } = renderHook(() => useLearnQueue(threeWords, hydrateQueue));
            act(() => {
                result.current.toNextWord();
            });
            expect(result.current.isFinished).toBe(true);
        });

        it('in repeat mode, advances to next repeat item', () => {
            const hydrateQueue = {
                initialState: makeSnapshot({ index: 0, isRepeating: true, repeatQueue: [1, 2] }),
                hydrateKey: 'k',
            };
            const { result } = renderHook(() => useLearnQueue(threeWords, hydrateQueue));
            act(() => {
                result.current.toNextWord();
            });
            expect(result.current.index).toBe(1);
            expect(result.current.isRepeating).toBe(true);
        });

        it('in repeat mode, finishes when repeatQueue is empty', () => {
            const hydrateQueue = {
                initialState: makeSnapshot({ index: 0, isRepeating: true, repeatQueue: [] }),
                hydrateKey: 'k',
            };
            const { result } = renderHook(() => useLearnQueue(threeWords, hydrateQueue));
            act(() => {
                result.current.toNextWord();
            });
            expect(result.current.isFinished).toBe(true);
        });

        it('does nothing when briefWords is undefined', () => {
            const hydrateQueue = {
                initialState: makeSnapshot(),
                hydrateKey: 'k',
            };
            const { result } = renderHook(() => useLearnQueue(undefined, hydrateQueue));
            act(() => {
                result.current.toNextWord();
            });
            expect(result.current.index).toBe(0);
        });
    });

    // ── addToRepeatQueue ──
    describe('addToRepeatQueue', () => {
        it('adds the word index to the repeat queue', () => {
            const hydrateQueue = {
                initialState: makeSnapshot({ repeatQueue: [1] }),
                hydrateKey: 'k',
            };
            const { result } = renderHook(() => useLearnQueue(threeWords, hydrateQueue));
            act(() => {
                result.current.addToRepeatQueue('w3');
            });
            expect(result.current.repeatQueue).toEqual([1, 2]);
        });

        it('does nothing when word is not found', () => {
            const hydrateQueue = {
                initialState: makeSnapshot(),
                hydrateKey: 'k',
            };
            const { result } = renderHook(() => useLearnQueue(threeWords, hydrateQueue));
            act(() => {
                result.current.addToRepeatQueue('nonexistent');
            });
            expect(result.current.repeatQueue).toEqual([]);
        });

        it('does nothing when briefWords is undefined', () => {
            const { result } = renderHook(() => useLearnQueue(undefined));
            act(() => {
                result.current.addToRepeatQueue('w1');
            });
            expect(result.current.repeatQueue).toEqual([]);
        });
    });

    // ── handleRepeat ──
    describe('handleRepeat', () => {
        it('re-adds current index to end when familiarity < 4', () => {
            const hydrateQueue = {
                initialState: makeSnapshot({ index: 1, repeatQueue: [0, 2] }),
                hydrateKey: 'k',
            };
            const { result } = renderHook(() => useLearnQueue(threeWords, hydrateQueue));
            act(() => {
                result.current.handleRepeat(3);
            });
            expect(result.current.repeatQueue).toEqual([2, 1]);
        });

        it('removes from front only when familiarity >= 4', () => {
            const hydrateQueue = {
                initialState: makeSnapshot({ index: 1, repeatQueue: [0, 2] }),
                hydrateKey: 'k',
            };
            const { result } = renderHook(() => useLearnQueue(threeWords, hydrateQueue));
            act(() => {
                result.current.handleRepeat(4);
            });
            expect(result.current.repeatQueue).toEqual([2]);
        });

        it('handles edge case familiarity = 0', () => {
            const hydrateQueue = {
                initialState: makeSnapshot({ index: 0, repeatQueue: [1] }),
                hydrateKey: 'k',
            };
            const { result } = renderHook(() => useLearnQueue(threeWords, hydrateQueue));
            act(() => {
                result.current.handleRepeat(0);
            });
            expect(result.current.repeatQueue).toEqual([0]);
        });
    });

    // ── queueSnapshot ──
    describe('queueSnapshot', () => {
        it('reflects current state when hydrateQueue is provided', () => {
            const hydrateQueue = {
                initialState: makeSnapshot({ index: 0, repeatQueue: [] }),
                hydrateKey: 'k',
            };
            const { result } = renderHook(() => useLearnQueue(threeWords, hydrateQueue));
            act(() => {
                result.current.toNextWord();
            });
            expect(result.current.queueSnapshot).toEqual({
                index: 1,
                isRepeating: false,
                repeatQueue: [],
                version: '',
            });
        });

        it('is undefined when hydrateQueue is not provided', () => {
            const { result } = renderHook(() => useLearnQueue(threeWords));
            expect(result.current.queueSnapshot).toBeUndefined();
        });
    });

    // ── Sync behavior ──
    describe('sync on user action', () => {
        it('triggers sync when toNextWord changes queueSnapshot', () => {
            const hydrateQueue = {
                initialState: makeSnapshot(),
                hydrateKey: 'k',
            };
            const { result } = renderHook(() =>
                useLearnQueue(threeWords, hydrateQueue, 'user1', 'learn')
            );

            // Hydration should not trigger sync
            expect(mockMutate).not.toHaveBeenCalled();

            // User action triggers sync
            act(() => {
                result.current.toNextWord();
            });
            expect(mockMutate).toHaveBeenCalledTimes(1);
            expect(mockMutate).toHaveBeenCalledWith({
                userId: 'user1',
                mode: 'learn',
                queueSnapshot: expect.objectContaining({ index: 1 }),
            });
        });

        it('triggers sync when addToRepeatQueue changes queueSnapshot', () => {
            const hydrateQueue = {
                initialState: makeSnapshot(),
                hydrateKey: 'k',
            };
            const { result } = renderHook(() =>
                useLearnQueue(threeWords, hydrateQueue, 'user1', 'review')
            );

            mockMutate.mockClear();

            act(() => {
                result.current.addToRepeatQueue('w2');
            });
            expect(mockMutate).toHaveBeenCalledTimes(1);
            expect(mockMutate).toHaveBeenCalledWith({
                userId: 'user1',
                mode: 'review',
                queueSnapshot: expect.objectContaining({ repeatQueue: [1] }),
            });
        });

        it('triggers sync when handleRepeat changes queueSnapshot', () => {
            const hydrateQueue = {
                initialState: makeSnapshot({ repeatQueue: [0, 1] }),
                hydrateKey: 'k',
            };
            const { result } = renderHook(() =>
                useLearnQueue(threeWords, hydrateQueue, 'user1', 'learn')
            );

            mockMutate.mockClear();

            act(() => {
                result.current.handleRepeat(4);
            });
            expect(mockMutate).toHaveBeenCalledTimes(1);
            expect(mockMutate).toHaveBeenCalledWith({
                userId: 'user1',
                mode: 'learn',
                queueSnapshot: expect.objectContaining({ repeatQueue: [1] }),
            });
        });

        it('does NOT trigger sync on hydration (injection)', () => {
            const hydrateQueue = {
                initialState: makeSnapshot({ index: 1 }),
                hydrateKey: 'key-1',
            };
            renderHook(() => useLearnQueue(threeWords, hydrateQueue, 'user1', 'learn'));

            // Hydration should not have triggered sync
            expect(mockMutate).not.toHaveBeenCalled();
        });

        it('does NOT trigger sync when hydrateKey changes (injection)', () => {
            const { rerender } = renderHook(
                (props: {
                    hydrateQueue: { initialState: QueueSnapshot; hydrateKey: string };
                    userId: string;
                    mode: 'learn' | 'review';
                }) => useLearnQueue(threeWords, props.hydrateQueue, props.userId, props.mode),
                {
                    initialProps: {
                        hydrateQueue: {
                            initialState: makeSnapshot({ index: 0 }),
                            hydrateKey: 'key-1',
                        },
                        userId: 'user1',
                        mode: 'learn' as const,
                    },
                }
            );

            mockMutate.mockClear();

            // Re-render with new hydrateKey — simulates server pushing new data
            rerender({
                hydrateQueue: {
                    initialState: makeSnapshot({ index: 2 }),
                    hydrateKey: 'key-2',
                },
                userId: 'user1',
                mode: 'learn' as const,
            });

            expect(mockMutate).not.toHaveBeenCalled();
        });

        it('does NOT sync when userId or mode are missing', () => {
            const hydrateQueue = {
                initialState: makeSnapshot(),
                hydrateKey: 'k',
            };

            // Missing both userId and mode
            const { result: r1 } = renderHook(() => useLearnQueue(threeWords, hydrateQueue));
            act(() => {
                r1.current.toNextWord();
            });
            expect(mockMutate).not.toHaveBeenCalled();
        });

        it('after sync onSuccess, server state is applied and no re-sync loop occurs', () => {
            const hydrateQueue = {
                initialState: makeSnapshot({ index: 0, version: 'old' }),
                hydrateKey: 'k',
            };
            const { result } = renderHook(() =>
                useLearnQueue(threeWords, hydrateQueue, 'user1', 'learn')
            );

            // First user action
            act(() => {
                result.current.toNextWord();
            });
            expect(mockMutate).toHaveBeenCalledTimes(1);

            // Simulate server response — state comes back with a new version
            const serverSnapshot = makeSnapshot({ index: 1, version: 'new' });
            act(() => {
                capturedOnSuccess?.({
                    queueSnapshot: serverSnapshot,
                } as unknown);
            });

            // Server state should be applied
            expect(result.current.queueSnapshot?.version).toBe('new');

            // No additional sync should have been triggered by onSuccess
            expect(mockMutate).toHaveBeenCalledTimes(1);
        });

        // ── Sync behavior ──
        describe('sync on user action', () => {
            it('does not trigger sync when toNextWord has no state effect (e.g., end of repeat)', () => {
                const hydrateQueue = {
                    initialState: makeSnapshot({ index: 0, isRepeating: true, repeatQueue: [] }),
                    hydrateKey: 'k',
                };
                const { result } = renderHook(() =>
                    useLearnQueue(threeWords, hydrateQueue, 'user1', 'learn')
                );

                mockMutate.mockClear();

                act(() => {
                    result.current.toNextWord();
                });
                expect(mockMutate).not.toHaveBeenCalled();
            });
        });
    });
});
