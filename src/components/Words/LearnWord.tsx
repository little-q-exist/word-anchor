import { useMemo, useState } from 'react';

import userServices from '../../services/users';
import wordServices from '../../services/words';

import WordCard from './WordCard';
import { Button, Empty, Flex, message, Spin, Timeline } from 'antd';

import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { useNavigate } from 'react-router';
import WordSideButtonGroup from './WordSideButtonGroup';
import type { BriefWord, BriefWordWithLearnStatus } from '../../types';
import LearnResult from './LearnResult';
import { useMutation, useQuery } from '@tanstack/react-query';

type LearnWordInterface =
    | {
          isLoading: false;
          loadedWords: BriefWord[];
          mode: 'learn' | 'review';
      }
    | {
          isLoading: true;
      };

const LearnWord = (props: LearnWordInterface) => {
    const { isLoading } = props;
    const loadedWords = useMemo(() => {
        return !isLoading && 'loadedWords' in props ? props.loadedWords : [];
    }, [isLoading, props]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const mode = useMemo(() => {
        return !isLoading && 'mode' in props ? props.mode : 'learn';
    }, [isLoading, props]);

    const user = useSelector((state: RootState) => state.user);

    const wordsWithStatus: BriefWordWithLearnStatus[] = useMemo(() => {
        return (
            loadedWords.map((briefWord) => {
                return { ...briefWord, status: 'idle' };
            }) || []
        );
    }, [loadedWords]);

    const navigate = useNavigate();

    const [messageApi, contextHolder] = message.useMessage();

    const [wordIds, setWordIds] = useState(wordsWithStatus);
    const [index, setIndex] = useState(0);
    const [wordToRepeat, setWordToRepeat] = useState<number[]>([]);
    const [isRepeating, setIsRepeating] = useState(false);
    const [shouldShowInfo, setShouldShowInfo] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const {
        data: wordToShow,
        isError,
        isPending,
    } = useQuery({
        queryKey: ['word', wordIds[index]._id],
        queryFn: () => wordServices.getById(wordIds[index]._id),
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const familiarityMutation = useMutation({
        mutationFn: ({
            userId,
            wordId,
            familiarity,
        }: {
            userId: string;
            wordId: string;
            familiarity: number;
        }) => userServices.updateFamiliarity(userId, wordId, familiarity),
        onMutate({ familiarity }) {
            const shouldRepeat = familiarity < 4;
            if (shouldRepeat) {
                setWordIds((prev) =>
                    prev.map((prevWord, wordIndex) =>
                        wordIndex === index ? { ...prevWord, status: 'failed' } : prevWord
                    )
                );
                setWordToRepeat((queue) => queue.concat(index));
            } else {
                setWordIds((prev) =>
                    prev.map((prevWord, wordIndex) =>
                        wordIndex === index ? { ...prevWord, status: 'passed' } : prevWord
                    )
                );
            }
        },
        onError(error) {
            messageApi.error('Failed to update familiarity. Please try again.');
            console.error(error);
            setShouldShowInfo(false);
            setWordToRepeat((queue) => queue.filter((i) => i !== index));
            setWordIds((prev) =>
                prev.map((prevWord, wordIndex) =>
                    wordIndex === index ? { ...prevWord, status: 'idle' } : prevWord
                )
            );
        },
    });

    const navigateToNextWord = () => {
        if (!isRepeating) {
            if (index < wordIds.length - 1) {
                setIndex(index + 1);
            } else {
                if (wordToRepeat.length > 0) {
                    setIsRepeating(true);
                    setIndex(wordToRepeat[0]);
                } else {
                    setIsFinished(true);
                    return;
                }
            }
        } else {
            if (wordToRepeat.length > 0) {
                setIndex(wordToRepeat[0]);
            } else {
                setIsFinished(true);
                return;
            }
        }
        setShouldShowInfo(false);
    };

    const handleLearn = async (familiarity: number) => {
        if (!user) {
            messageApi.info('Please login first!');
            setTimeout(() => {
                navigate('../login');
            }, 3000);
            return;
        }

        if (isRepeating) {
            setWordToRepeat((queue) => {
                const nextQueue = queue.slice(1);
                if (familiarity < 4) {
                    setWordIds((prev) =>
                        prev.map((prevWord, wordIndex) =>
                            wordIndex === index ? { ...prevWord, status: 'failed' } : prevWord
                        )
                    );
                    return nextQueue.concat(index);
                } else {
                    setWordIds((prev) =>
                        prev.map((prevWord, wordIndex) =>
                            wordIndex === index ? { ...prevWord, status: 'passed' } : prevWord
                        )
                    );
                    return nextQueue;
                }
            });
        } else {
            familiarityMutation.mutate({
                userId: user._id,
                wordId: wordIds[index]._id,
                familiarity,
            });
        }
        setShouldShowInfo(true);
    };

    const generateColor = (word: BriefWordWithLearnStatus, wordIndex: number) => {
        if (wordIndex === index) {
            return 'blue';
        } else {
            switch (word.status) {
                case 'idle':
                    return 'gray';
                case 'passed':
                    return 'green';
                case 'failed':
                    return 'red';
            }
        }
    };

    if (wordIds.length === 0) {
        return (
            <Flex style={{ height: '100%' }} justify="center" align="center">
                <Empty description={false} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </Flex>
        );
    }

    if (isFinished) {
        return <LearnResult words={wordIds} />;
    }

    if (isLoading || isPending) {
        return (
            <Flex style={{ height: '100%' }} justify="center" align="center">
                <Spin spinning />
            </Flex>
        );
    }

    if (isError) {
        return <div>some error occurred</div>;
    }

    return (
        <>
            {contextHolder}
            <Flex style={{ height: '100%', marginTop: '1rem' }} vertical>
                <Timeline
                    orientation="horizontal"
                    items={wordIds.map((word, wordIndex) => {
                        return {
                            content: <div>{word.english}</div>,
                            color: generateColor(word, wordIndex),
                        };
                    })}
                />
                <div style={{ flex: 1 }}>
                    <WordCard word={wordToShow} visible={shouldShowInfo} key={wordToShow._id} />
                </div>

                <Flex justify="space-around" gap="middle" style={{ marginBottom: '2rem' }}>
                    {!shouldShowInfo && (
                        <>
                            <Button
                                type="primary"
                                onClick={() => handleLearn(5)}
                                style={{ flex: 1 }}
                            >
                                Known
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => handleLearn(3)}
                                style={{ flex: 1 }}
                            >
                                Unfamiliar
                            </Button>
                            <Button
                                type="default"
                                onClick={() => handleLearn(0)}
                                style={{ flex: 1 }}
                            >
                                Unknown
                            </Button>
                        </>
                    )}
                    {shouldShowInfo && (
                        <Button
                            type="primary"
                            onClick={navigateToNextWord}
                            style={{ width: '50%' }}
                        >
                            Next
                        </Button>
                    )}
                </Flex>
                <WordSideButtonGroup wordId={wordToShow._id} returnOption={{ showReturn: false }} />
            </Flex>
        </>
    );
};

export default LearnWord;
