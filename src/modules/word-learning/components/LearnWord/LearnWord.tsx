import { useEffect, useMemo, useState } from 'react';

import userServices from '@/shared/services/users';
import wordServices from '@/shared/services/words';

import WordCards from '@modules/word-core/components/WordCards/WordCards';
import { Button, Empty, Flex, message, Skeleton } from 'antd';

import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { useNavigate } from 'react-router';
import WordSideButtonGroup from '@modules/word-core/components/WordSideButtonGroup/WordSideButtonGroup';
import type { BriefWordWithLearnStatus } from '@/types';
import LearnResult from '../LearnResult/LearnResult';
import { skipToken, useMutation, useQuery } from '@tanstack/react-query';
import CenteredSpin from '@/shared/components/CenteredSpin';
import LearnProgress from './LearnProgress';
import useLearnQueue from '@modules/word-learning/hooks/LearnWord/useLearnQueue';
import useWordCache from '@modules/word-learning/hooks/LearnWord/useWordCache';

type LearnWordInterface = {
    mode: 'learn' | 'review';
};

const LearnWord = ({ mode }: LearnWordInterface) => {
    const user = useSelector((state: RootState) => state.user);

    const { cachedBriefWords, isCacheReady, setCache } = useWordCache(mode);

    const briefWordQuery = useQuery({
        queryKey: ['learnWords', mode],
        queryFn: () =>
            mode === 'learn' ? wordServices.getWordToLearn() : wordServices.getWordToReview(),
        refetchOnWindowFocus: false,
        enabled: isCacheReady && !cachedBriefWords,
    });

    const briefWordsWithStatus: BriefWordWithLearnStatus[] = useMemo(() => {
        const loadedWords = briefWordQuery.data?.words || [];
        return (
            loadedWords.map((briefWord) => {
                return { ...briefWord, status: 'idle' };
            }) || []
        );
    }, [briefWordQuery.data?.words]);

    const isBriefWordLoading = briefWordQuery.status === 'pending';
    const isBriefWordError = briefWordQuery.status === 'error';

    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [briefWords, setBriefWords] = useState(briefWordsWithStatus);

    useEffect(() => {
        if (briefWordQuery.status === 'success' && briefWordQuery.data) {
            setBriefWords(briefWordsWithStatus);
            setCache(briefWordsWithStatus);
        }
    }, [briefWordQuery.data, briefWordQuery.status, briefWordsWithStatus, setCache]);

    const [shouldDisableButton, setShouldDisableButton] = useState(false);
    const [shouldShowInfo, setShouldShowInfo] = useState(false);

    const { index, isRepeating, isFinished, toNextWord, addToRepeatQueue, handleRepeat } =
        useLearnQueue(briefWords);

    const navigateToNextWord = () => {
        toNextWord();
        setShouldShowInfo(false);
    };

    const markWordStatus = (wordId: string, status: BriefWordWithLearnStatus['status']) => {
        setBriefWords((prev) =>
            prev.map((prevWord) => (prevWord._id === wordId ? { ...prevWord, status } : prevWord))
        );
    };

    const detailedWordQuery = useQuery({
        queryKey: ['word', briefWords[index]?._id],
        queryFn: briefWords[index]?._id
            ? () => wordServices.getById(briefWords[index]._id)
            : skipToken,
        enabled: !!briefWords && briefWords.length !== 0 && !!briefWords[index]?._id,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const detailedWordToShow = detailedWordQuery.data;
    const canShowDetailedWord = detailedWordQuery.status === 'success' && !!detailedWordToShow;

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
                markWordStatus(wordId, 'failed');
                addToRepeatQueue(wordId);
            } else {
                markWordStatus(wordId, 'passed');
            }
        },
        onSuccess({ shouldRepeat, wordId }) {
            markWordStatus(wordId, shouldRepeat ? 'failed' : 'passed');
        },
        onError(error, _variables) {
            messageApi.error('Failed to update familiarity. Please try again.');
            console.error(error);
            setShouldShowInfo(false);
            const wordId = _variables?.wordId;
            if (!wordId) {
                return;
            }
            addToRepeatQueue(wordId);
            markWordStatus(wordId, 'idle');
        },
        onSettled() {
            setShouldDisableButton(false);
        },
    });

    const handleLearn = async (familiarity: number) => {
        if (!user) {
            messageApi.info('Please login first!');
            setTimeout(() => {
                navigate('../login');
            }, 3000);
            return;
        }

        if (isRepeating) {
            handleRepeat(familiarity);
            markWordStatus(briefWords[index]._id, familiarity < 4 ? 'failed' : 'passed');
        } else {
            familiarityMutation.mutate({
                userId: user._id,
                wordId: briefWords[index]._id,
                familiarity,
            });
        }
        setShouldShowInfo(true);
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

    if (!isCacheReady || isBriefWordLoading) {
        return <CenteredSpin />;
    }

    if (isBriefWordError || detailedWordQuery.status === 'error') {
        return <div>some error occurred</div>;
    }

    return (
        <>
            {contextHolder}
            <Flex style={{ height: '100%', marginTop: '1rem' }} vertical>
                <LearnProgress briefWords={briefWords} index={index} key={index} />
                <div style={{ flex: 1 }}>
                    {detailedWordQuery.status === 'pending' ? (
                        <Skeleton />
                    ) : canShowDetailedWord ? (
                        <WordCards
                            word={detailedWordToShow}
                            visible={shouldShowInfo}
                            key={detailedWordToShow._id}
                        />
                    ) : (
                        <Skeleton />
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
                {canShowDetailedWord && (
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
