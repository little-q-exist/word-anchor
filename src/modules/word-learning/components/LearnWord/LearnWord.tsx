import { useEffect, useState } from 'react';

import userServices from '@/shared/services/users';

import WordCards from '@modules/word-core/components/WordCards/WordCards';
import { Button, Empty, Flex, message, Skeleton } from 'antd';

import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { useNavigate } from 'react-router';
import WordSideButtonGroup from '@modules/word-core/components/WordSideButtonGroup/WordSideButtonGroup';
import type { BriefWordWithLearnStatus } from '@/types';
import LearnResult from '../LearnResult/LearnResult';
import { useMutation } from '@tanstack/react-query';
import CenteredSpin from '@/shared/components/CenteredSpin';
import LearnProgress from './LearnProgress';
import useLearnQueue from '@modules/word-learning/hooks/LearnWord/useLearnQueue';
import useBriefWordQuery from '@modules/word-learning/hooks/LearnWord/useBriefWordQuery';
import useDetailedWordQuery from '../../hooks/LearnWord/useDetailedWordQuery';

type LearnWordInterface = {
    mode: 'learn' | 'review';
};

const LearnWord = ({ mode }: LearnWordInterface) => {
    const user = useSelector((state: RootState) => state.user);

    const {
        briefWordsWithStatus,
        isBriefWordLoading,
        isBriefWordError,
        canShowBriefWord,
        isBriefWordQueryEnabled,
    } = useBriefWordQuery(undefined, mode);

    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [briefWords, setBriefWords] = useState<BriefWordWithLearnStatus[]>([]);

    useEffect(() => {
        if (canShowBriefWord) {
            setBriefWords(briefWordsWithStatus);
        }
    }, [briefWordsWithStatus, canShowBriefWord]);

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

    const { detailedWordQuery } = useDetailedWordQuery(
        !!briefWords && briefWords.length !== 0 && !!briefWords[index]?._id,
        briefWords[index]?._id
    );
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

    if (isBriefWordQueryEnabled && isBriefWordLoading) {
        return <CenteredSpin />;
    }

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

    if (isBriefWordError || detailedWordQuery.status === 'error') {
        return <div>some error occurred</div>;
    }

    return (
        <>
            {contextHolder}
            <Flex style={{ height: '100%', marginTop: '1rem' }} vertical>
                <LearnProgress briefWords={briefWords} index={index} key={index} />
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
