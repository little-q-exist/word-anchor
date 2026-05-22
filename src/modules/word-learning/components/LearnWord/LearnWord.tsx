import { useEffect, useMemo, useState } from 'react';

import WordCards from '@modules/word-core/components/WordCards/WordCards';
import { Empty, Flex, Skeleton, Result, Button, theme } from 'antd';

import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import WordSideButtonGroup from '@modules/word-core/components/WordSideButtonGroup/WordSideButtonGroup';
import type { BriefWordWithLearnStatus, LearningMode } from '@modules/word-learning/types';
import LearnResult from '../LearnResult/LearnResult';
import LearnProgress from './LearnProgress';
import LearnWordButtons from './LearnWordButtons';
import useLearnQueue from '@/modules/word-learning/hooks/useLearnQueue';
import useDetailedWordQuery from '../../hooks/queries/useDetailedWordQuery';
import useLearningSession from '../../hooks/queries/useLearningSessionQuery';

const LearnWord = ({ mode }: { mode: LearningMode }) => {
    const { token } = theme.useToken();
    const user = useSelector((state: RootState) => state.user);

    const [briefWords, setBriefWords] = useState<BriefWordWithLearnStatus[] | undefined>(undefined);
    const [shouldShowInfo, setShouldShowInfo] = useState(false);

    const { learningSessionQuery, noWordReturned } = useLearningSession(mode, user?._id);

    const {
        data: learningSession,
        isLoading: isLearningSessionLoading,
        isError: isLearningSessionError,
        isSuccess: isLearningSessionSuccess,
        refetch: refetchLearningSession,
    } = learningSessionQuery;

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
        jumpToIndex,
        addToRepeatQueue,
        handleRepeat,
    } = useLearnQueue(briefWords, hydrateQueue, user?._id, mode);

    const detailedWordQuery = useDetailedWordQuery(briefWords?.[index]?._id);

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

    if (isLearningSessionLoading) {
        return (
            <Flex
                style={{ height: '100%', padding: token.paddingXXL }}
                justify="center"
                align="center"
            >
                <Skeleton active paragraph={{ rows: 6 }} style={{ width: '100%', maxWidth: 600 }} />
            </Flex>
        );
    }

    if (isLearningSessionSuccess && noWordReturned && learningSession === null) {
        return (
            <Flex style={{ height: '100%' }} justify="center" align="center">
                <Empty description="You have learned all the words in this session." />
            </Flex>
        );
    }

    if (isLearningSessionError || detailedWordQuery.status === 'error') {
        return (
            <Flex style={{ height: '100%' }} justify="center" align="center">
                <Result
                    status="error"
                    title="Failed to load learning session"
                    subTitle="An error occurred while preparing your words. Please try again."
                    extra={[
                        <Button
                            type="primary"
                            key="retry"
                            onClick={() => {
                                refetchLearningSession();
                                detailedWordQuery.refetch();
                            }}
                        >
                            Try Again
                        </Button>,
                    ]}
                />
            </Flex>
        );
    }

    if (isFinished && !!briefWords) {
        return <LearnResult briefWords={briefWords} />;
    }

    return (
        <Flex style={{ height: '100%', paddingTop: token.paddingXXL }} vertical>
            {briefWords && <LearnProgress briefWords={briefWords} index={index} key={index} onChange={jumpToIndex} />}
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

            <LearnWordButtons
                userId={user?._id}
                briefWords={briefWords}
                currentIndex={index}
                isRepeating={isRepeating}
                showInfo={shouldShowInfo}
                onShowInfoChange={setShouldShowInfo}
                onMarkWordStatus={markWordStatus}
                onAddToRepeatQueue={addToRepeatQueue}
                onHandleRepeat={handleRepeat}
                onNextWord={toNextWord}
            />
            {detailedWordQuery.status === 'success' && (
                <WordSideButtonGroup
                    wordId={detailedWordQuery.data._id}
                    returnOption={{ showReturn: false }}
                />
            )}
        </Flex>
    );
};

export default LearnWord;
