import { useMemo, useState } from 'react';

import userServices from '../../../../services/users';
import wordServices from '../../../../services/words';

import WordCards from '../../../word-core/components/WordCards/WordCards';
import { Button, Empty, Flex, message, Skeleton } from 'antd';

import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store';
import { useNavigate } from 'react-router';
import WordSideButtonGroup from '../../../word-core/components/WordSideButtonGroup/WordSideButtonGroup';
import type { BriefWord, BriefWordWithLearnStatus } from '../../../../types';
import LearnResult from '../LearnResult/LearnResult';
import { skipToken, useMutation, useQuery } from '@tanstack/react-query';
import CenteredSpin from '../../../../shared/components/CenteredSpin';
import LearnProgress from './LearnProgress';
import useLearnQueue from '../../hooks/LearnWord/useLearnQueue';

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

    if (isBriefWordLoading) {
        return <CenteredSpin />;
    }

    if (isError) {
        return <div>some error occurred</div>;
    }

    return (
        <>
            {contextHolder}
            <Flex style={{ height: '100%', marginTop: '1rem' }} vertical>
                <LearnProgress briefWords={briefWords} index={index} key={index} />
                <div style={{ flex: 1 }}>
                    {detailedWordQueryStatus === 'pending' ? (
                        <Skeleton />
                    ) : (
                        <WordCards
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
