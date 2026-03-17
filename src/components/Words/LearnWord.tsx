import { useMemo, useState } from 'react';

import userServices from '../../services/users';
import wordServices from '../../services/words';

import WordCard from './WordCard';
import { Button, Empty, Flex, message, Skeleton, Spin, Timeline } from 'antd';

import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { useNavigate } from 'react-router';
import WordSideButtonGroup from './WordSideButtonGroup';
import type { BriefWord, BriefWordWithLearnStatus } from '../../types';
import LearnResult from './LearnResult';
import { skipToken, useMutation, useQuery } from '@tanstack/react-query';

type LearnWordInterface =
    | {
          isBriefWordLoading: false;
          loadedWords: BriefWord[];
          mode: 'learn' | 'review';
      }
    | {
          isBriefWordLoading: true;
      };

const LearnWord = (props: LearnWordInterface) => {
    const { isBriefWordLoading } = props;
    const loadedWords = useMemo(() => {
        return !isBriefWordLoading ? props.loadedWords : [];
    }, [isBriefWordLoading, props]);

    const user = useSelector((state: RootState) => state.user);

    const briefWordsWithStatus: BriefWordWithLearnStatus[] = useMemo(() => {
        return (
            loadedWords.map((briefWord) => {
                return { ...briefWord, status: 'idle' };
            }) || []
        );
    }, [loadedWords]);

    const navigate = useNavigate();

    const [messageApi, contextHolder] = message.useMessage();

    const [briefWords, setBriefWords] = useState(briefWordsWithStatus);
    const [index, setIndex] = useState(0);
    const [shouldDisableButton, setShouldDisableButton] = useState(false);
    const [wordToRepeat, setWordToRepeat] = useState<number[]>([]);
    const [isRepeating, setIsRepeating] = useState(false);
    const [shouldShowInfo, setShouldShowInfo] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const {
        data: detailedWordToShow,
        isError,
        status: detailedWordQueryStatus,
    } = useQuery({
        queryKey: ['word', briefWords[index]?._id],
        queryFn: briefWords[index]?._id
            ? () => wordServices.getById(briefWords[index]._id)
            : skipToken,
        enabled: briefWords.length !== 0 && !!briefWords[index]?._id,
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
        onMutate({ familiarity, wordId }) {
            setShouldDisableButton(true);
            const shouldRepeat = familiarity < 4;
            if (shouldRepeat) {
                setBriefWords((prev) =>
                    prev.map((prevWord) =>
                        prevWord._id === wordId ? { ...prevWord, status: 'failed' } : prevWord
                    )
                );
                setWordToRepeat((queue) => {
                    const targetIndex = briefWords.findIndex((w) => w._id === wordId);
                    return targetIndex === -1 ? queue : queue.concat(targetIndex);
                });
            } else {
                setBriefWords((prev) =>
                    prev.map((prevWord) =>
                        prevWord._id === wordId ? { ...prevWord, status: 'passed' } : prevWord
                    )
                );
            }
        },
        onError(error, _variables) {
            messageApi.error('Failed to update familiarity. Please try again.');
            console.error(error);
            setShouldShowInfo(false);
            const wordId = _variables?.wordId;
            if (!wordId) {
                return;
            }
            setWordToRepeat((queue) => {
                const targetIndex = briefWords.findIndex((w) => w._id === wordId);
                return targetIndex === -1 ? queue : queue.filter((i) => i !== targetIndex);
            });
            setBriefWords((prev) =>
                prev.map((prevWord) =>
                    prevWord._id === wordId ? { ...prevWord, status: 'idle' } : prevWord
                )
            );
        },
        onSettled() {
            setShouldDisableButton(false);
        },
    });

    const navigateToNextWord = () => {
        if (!isRepeating) {
            if (index < briefWords.length - 1) {
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
                    setBriefWords((prev) =>
                        prev.map((prevWord, wordIndex) =>
                            wordIndex === index ? { ...prevWord, status: 'failed' } : prevWord
                        )
                    );
                    return nextQueue.concat(index);
                } else {
                    setBriefWords((prev) =>
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
                wordId: briefWords[index]._id,
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

    if (isFinished) {
        return <LearnResult briefWords={briefWords} />;
    }

    if (!isBriefWordLoading && briefWords.length === 0) {
        return (
            <Flex style={{ height: '100%' }} justify="center" align="center">
                <Empty
                    description={'You have learned all the words!'}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </Flex>
        );
    }

    // TODO：闪屏。可以考虑在单词卡片上加个 loading 状态，这样界面就不会闪了。
    if (isBriefWordLoading) {
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
                    items={briefWords.map((word, wordIndex) => {
                        return {
                            content: <div>{word.english}</div>,
                            color: generateColor(word, wordIndex),
                        };
                    })}
                />
                <div style={{ flex: 1 }}>
                    {detailedWordQueryStatus === 'pending' ? (
                        <Skeleton />
                    ) : (
                        <WordCard
                            word={detailedWordToShow}
                            visible={shouldShowInfo}
                            key={detailedWordToShow._id}
                        />
                    )}
                </div>

                <Flex justify="space-around" gap="middle" style={{ marginBottom: '2rem' }}>
                    {!shouldShowInfo && (
                        <>
                            <Button
                                type="primary"
                                onClick={() => handleLearn(5)}
                                style={{ flex: 1 }}
                                disabled={shouldDisableButton}
                            >
                                Known
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => handleLearn(3)}
                                style={{ flex: 1 }}
                                disabled={shouldDisableButton}
                            >
                                Unfamiliar
                            </Button>
                            <Button
                                type="default"
                                onClick={() => handleLearn(0)}
                                style={{ flex: 1 }}
                                disabled={shouldDisableButton}
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
                            disabled={shouldDisableButton}
                        >
                            Next
                        </Button>
                    )}
                </Flex>
                {detailedWordQueryStatus === 'success' && (
                    <WordSideButtonGroup
                        wordId={detailedWordToShow._id}
                        returnOption={{ showReturn: false }}
                    />
                )}
            </Flex>
        </>
    );
};

export default LearnWord;
