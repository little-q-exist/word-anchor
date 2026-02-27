import { useState } from 'react';

import wordServices from '../services/words';
import userServices from '../services/users';

import WordCard from '../components/WordCard';
import { Button, Empty, Flex, message } from 'antd';

import type { Route } from './+types/Learn';

import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { useNavigate } from 'react-router';
import WordSideButtonGroup from '../components/WordSideButtonGroup';

// eslint-disable-next-line react-refresh/only-export-components
export async function clientLoader() {
    const words = await wordServices.getWordToLearn();
    return { words };
}

const Learn = ({ loaderData }: Route.ComponentProps) => {
    const user = useSelector((state: RootState) => state.user);

    const navigate = useNavigate();

    const [messageApi, contextHolder] = message.useMessage();

    const words = loaderData.words;
    const [index, setIndex] = useState(0);
    const [wordToRepeat, setWordToRepeat] = useState<number[]>([]);
    const [isRepeating, setIsRepeating] = useState(false);
    const [shouldShowInfo, setShouldShowInfo] = useState(false);
    const wordToShow = words[index];

    const navigateToNextWord = () => {
        if (!isRepeating) {
            if (index < words.length - 1) {
                setIndex(index + 1);
            } else {
                if (wordToRepeat.length > 0) {
                    setIsRepeating(true);
                    setIndex(wordToRepeat[0]);
                } else {
                    messageApi.info(
                        'You have finished learning all the words for today! Great job!'
                    );
                    setTimeout(() => {
                        navigate('..');
                    }, 3000);
                    return;
                }
            }
        } else {
            if (wordToRepeat.length > 0) {
                setIndex(wordToRepeat[0]);
            } else {
                messageApi.success(
                    'You have finished learning all the words for today! Great job!'
                );
                setTimeout(() => {
                    navigate('..');
                }, 3000);
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
                    return nextQueue.concat(index);
                }
                return nextQueue;
            });
        } else {
            const { shouldRepeat } = await userServices.updateFamiliarity(
                user._id,
                wordToShow._id,
                familiarity
            );
            if (shouldRepeat) {
                setWordToRepeat((queue) => queue.concat(index));
            }
        }
        setShouldShowInfo(true);
    };

    if (words.length === 0) {
        return (
            <Flex style={{ height: '100%' }} justify="center" align="center">
                <Empty description={false} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </Flex>
        );
    }

    return (
        <>
            {contextHolder}
            <Flex style={{ height: '100%' }} vertical>
                <div style={{ flex: 1 }}>
                    <WordCard word={wordToShow} visible={shouldShowInfo} />
                </div>

                <Flex justify="space-around" gap="middle" style={{ marginBottom: '1rem' }}>
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
                <WordSideButtonGroup wordId={wordToShow._id} showReturn={false} />
            </Flex>
        </>
    );
};

export default Learn;
