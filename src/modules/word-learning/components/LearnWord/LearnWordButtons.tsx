import { useState } from 'react';
import { Button, Flex, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import userServices from '@modules/word-learning/services/users';
import type { BriefWordWithLearnStatus, LearningMode } from '@modules/word-learning/types';

interface LearnWordButtonsProps {
    userId?: string;
    briefWords: BriefWordWithLearnStatus[] | undefined;
    currentIndex: number;
    isRepeating: boolean;
    mode: LearningMode;
    showInfo: boolean;
    onShowInfoChange: (visible: boolean) => void;
    onMarkWordStatus: (wordId: string, status: BriefWordWithLearnStatus['status']) => void;
    onAddToRepeatQueue: (wordId: string) => void;
    onHandleRepeat: (familiarity: number) => void;
    onSyncQueueSnapshot: (userId: string, mode: LearningMode) => void;
    onNextWord: () => void;
}

const LearnWordButtons = ({
    userId,
    briefWords,
    currentIndex,
    isRepeating,
    mode,
    showInfo,
    onShowInfoChange,
    onMarkWordStatus,
    onAddToRepeatQueue,
    onHandleRepeat,
    onSyncQueueSnapshot,
    onNextWord,
}: LearnWordButtonsProps) => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [shouldDisableButton, setShouldDisableButton] = useState(false);

    const familiarityMutation = useMutation({
        mutationFn: ({
            userId: mutUserId,
            wordId,
            familiarity,
        }: {
            userId: string;
            wordId: string;
            familiarity: number;
        }) => userServices.updateFamiliarity(mutUserId, wordId, familiarity),
        onMutate({ familiarity, wordId }) {
            setShouldDisableButton(true);
            const shouldRepeat = familiarity < 4;
            if (shouldRepeat) {
                onMarkWordStatus(wordId, 'failed');
                onAddToRepeatQueue(wordId);
            } else {
                onMarkWordStatus(wordId, 'passed');
            }
        },
        onSuccess({ shouldRepeat, wordId }) {
            onMarkWordStatus(wordId, shouldRepeat ? 'failed' : 'passed');
        },
        onError(error, variables) {
            messageApi.error('Failed to update familiarity. Please try again.');
            console.error(error);
            onShowInfoChange(false);
            const wordId = variables?.wordId;
            if (!wordId) {
                return;
            }
            onAddToRepeatQueue(wordId);
            onMarkWordStatus(wordId, 'idle');
        },
        onSettled() {
            setShouldDisableButton(false);
        },
    });

    const handleLearn = async (familiarity: number) => {
        if (!userId) {
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
            onHandleRepeat(familiarity);
            onMarkWordStatus(briefWords[currentIndex]._id, familiarity < 4 ? 'failed' : 'passed');
        } else {
            familiarityMutation.mutate({
                userId,
                wordId: briefWords[currentIndex]._id,
                familiarity,
            });
        }
        onSyncQueueSnapshot(userId, mode);
        onShowInfoChange(true);
    };

    const navigateToNextWord = () => {
        onNextWord();
        onShowInfoChange(false);
    };

    return (
        <>
            {contextHolder}
            <Flex justify="space-around" gap="middle" style={{ marginBottom: '2rem' }}>
                {!showInfo && (
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
                {showInfo && (
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
        </>
    );
};

export default LearnWordButtons;
