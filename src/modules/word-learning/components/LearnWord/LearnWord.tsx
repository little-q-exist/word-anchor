import { useEffect, useMemo, useState } from 'react';

import userServices from '@modules/word-learning/services/users';

import WordCards from '@modules/word-core/components/WordCards/WordCards';
import { Button, Empty, Flex, message, Skeleton } from 'antd';

import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { useNavigate } from 'react-router';
import WordSideButtonGroup from '@modules/word-core/components/WordSideButtonGroup/WordSideButtonGroup';
import type { BriefWordWithLearnStatus, LearningMode } from '@modules/word-learning/types';
import LearnResult from '../LearnResult/LearnResult';
import { useMutation } from '@tanstack/react-query';
import CenteredSpin from '@/shared/components/CenteredSpin';
import LearnProgress from './LearnProgress';
import useLearnQueue from '@/modules/word-learning/hooks/useLearnQueue';
import useDetailedWordQuery from '../../hooks/queries/useDetailedWordQuery';
import useLearningSession from '../../hooks/queries/useLearningSessionQuery';

const LearnWord = ({ mode }: { mode: LearningMode }) => {
    const user = useSelector((state: RootState) => state.user);

    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [briefWords, setBriefWords] = useState<BriefWordWithLearnStatus[] | undefined>(undefined);
    const [shouldDisableButton, setShouldDisableButton] = useState(false);
    const [shouldShowInfo, setShouldShowInfo] = useState(false);

    const {
        data: learningSession,
        isLoading: isLearningSessionLoading,
        isError: isLearningSessionError,
        isSuccess: isLearningSessionSuccess,
    } = useLearningSession(mode, user?._id);

    useEffect(() => {
        if (isLearningSessionSuccess && learningSession?.words) {
            setBriefWords(learningSession.words);
        }
    }, [learningSession, isLearningSessionSuccess]);

    const learnQueueInitialState = useMemo(
        () => learningSession?.queueSnapshot ?? undefined,
        [learningSession?.queueSnapshot]
    );

    const learnQueueHydrateKey = useMemo(
        () => (learningSession ? `${mode}-${user?._id}` : undefined),
        [learningSession, mode, user?._id]
    );

    const hydrateQueue = useMemo(
        () =>
            learnQueueInitialState && learnQueueHydrateKey
                ? { initialState: learnQueueInitialState, hydrateKey: learnQueueHydrateKey }
                : undefined,
        [learnQueueHydrateKey, learnQueueInitialState]
    );

    const {
        index,
        isRepeating,
        isFinished,
        toNextWord,
        addToRepeatQueue,
        handleRepeat,
        syncQueueSnapshot,
    } = useLearnQueue(briefWords, hydrateQueue);

    const detailedWordQuery = useDetailedWordQuery(briefWords?.[index]?._id);

    const navigateToNextWord = () => {
        toNextWord();
        setShouldShowInfo(false);
    };

    const markWordStatus = (wordId: string, status: BriefWordWithLearnStatus['status']) => {
        setBriefWords((prev) => {
            if (!prev) {
                return prev;
            }
            return prev.map((prevWord) =>
                prevWord._id === wordId ? { ...prevWord, status } : prevWord
            );
        });
    };

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
        if (!briefWords) {
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
        syncQueueSnapshot(user._id, mode);
        setShouldShowInfo(true);
    };

    if (isLearningSessionLoading) {
        return <CenteredSpin />;
    }

    if (isLearningSessionSuccess && !learningSession) {
        return (
            <Flex style={{ height: '100%' }} justify="center" align="center">
                <Empty
                    description={'You have learned all the words!'}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </Flex>
        );
    }

    if (isLearningSessionError || detailedWordQuery.status === 'error') {
        return <div>some error occurred</div>;
    }

    if (isFinished && !!briefWords) {
        return <LearnResult briefWords={briefWords} />;
    }

    return (
        <>
            {contextHolder}
            <Flex style={{ height: '100%', marginTop: '1rem' }} vertical>
                {briefWords && <LearnProgress briefWords={briefWords} index={index} key={index} />}
                <div style={{ flex: 1 }}>
                    {detailedWordQuery.status === 'success' ? (
                        <WordCards
                            word={detailedWordQuery.data}
                            visible={shouldShowInfo}
                            key={detailedWordQuery.data._id}
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
                {detailedWordQuery.status === 'success' && (
                    <WordSideButtonGroup
                        wordId={detailedWordQuery.data._id}
                        returnOption={{ showReturn: false }}
                    />
                )}
            </Flex>
        </>
    );
};

export default LearnWord;
