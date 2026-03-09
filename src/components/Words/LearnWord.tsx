import { useMemo, useState } from 'react';

import userServices from '../../services/users';

import WordCard from './WordCard';
import { Button, Empty, Flex, message, Popover, Timeline } from 'antd';

import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { useNavigate } from 'react-router';
import WordSideButtonGroup from './WordSideButtonGroup';
import type { Word, WordWithLearnStatus } from '../../types';
import LearnResult from './LearnResult';

interface LearnWordInterface {
    loadedWords: Word[];
}

const LearnWord = ({ loadedWords }: LearnWordInterface) => {
    const user = useSelector((state: RootState) => state.user);

    const wordsWithStatus: WordWithLearnStatus[] = useMemo(() => {
        return (
            loadedWords?.map((word) => {
                return { ...word, status: 'idle' };
            }) || []
        );
    }, [loadedWords]);

    const navigate = useNavigate();

    const [messageApi, contextHolder] = message.useMessage();

    const [words, setWords] = useState(wordsWithStatus);
    const [index, setIndex] = useState(0);
    const [wordToRepeat, setWordToRepeat] = useState<number[]>([]);
    const [isRepeating, setIsRepeating] = useState(false);
    const [shouldShowInfo, setShouldShowInfo] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
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
                    words[index].status = 'failed';
                    setWords((prev) =>
                        prev.map((prevWord, wordIndex) =>
                            wordIndex === index ? { ...prevWord, status: 'failed' } : prevWord
                        )
                    );
                    return nextQueue.concat(index);
                } else {
                    setWords((prev) =>
                        prev.map((prevWord, wordIndex) =>
                            wordIndex === index ? { ...prevWord, status: 'passed' } : prevWord
                        )
                    );
                    return nextQueue;
                }
            });
        } else {
            const { shouldRepeat } = await userServices.updateFamiliarity(
                user._id,
                wordToShow._id,
                familiarity
            );
            if (shouldRepeat) {
                setWords((prev) =>
                    prev.map((prevWord, wordIndex) =>
                        wordIndex === index ? { ...prevWord, status: 'failed' } : prevWord
                    )
                );
                setWordToRepeat((queue) => queue.concat(index));
            } else {
                setWords((prev) =>
                    prev.map((prevWord, wordIndex) =>
                        wordIndex === index ? { ...prevWord, status: 'passed' } : prevWord
                    )
                );
            }
        }
        setShouldShowInfo(true);
    };

    const generateColor = (word: WordWithLearnStatus, wordIndex: number) => {
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

    if (words.length === 0) {
        return (
            <Flex style={{ height: '100%' }} justify="center" align="center">
                <Empty description={false} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </Flex>
        );
    }

    if (isFinished) {
        return <LearnResult words={words} />;
    }

    return (
        <>
            {contextHolder}
            <Flex style={{ height: '100%', marginTop: '1rem' }} vertical>
                <Timeline
                    orientation="horizontal"
                    items={words.map((word, wordIndex) => {
                        return {
                            content:
                                index === wordIndex ? (
                                    <div style={{ color: '#3875f6' }}>{word.english}</div>
                                ) : word.status === 'passed' ? (
                                    <Popover
                                        title={word.english}
                                        content={
                                            <div>
                                                <div>{word.definitions[0].meaning}</div>
                                                <div>{word.definitions[1]?.meaning}</div>
                                            </div>
                                        }
                                    >
                                        <div>{word.english}</div>
                                    </Popover>
                                ) : (
                                    <div>{word.english}</div>
                                ),
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
