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
    const { words } = loaderData;

    const user = useSelector((state: RootState) => state.user);

    const navigate = useNavigate();

    const [messageApi, contextHolder] = message.useMessage();

    const [index, setIndex] = useState(0);
    const [shouldShowInfo, setShouldShowInfo] = useState(false);
    const wordToShow = words[index];

    const navigateToNextWord = () => {
        const nextIndex = (index + 1) % words.length;
        setIndex(nextIndex);
        setShouldShowInfo(false);
    };

    const handleLearn = (familiarity: number) => {
        if (!user) {
            messageApi.info('Please login first!');
            setTimeout(() => {
                navigate('../login');
            }, 3000);
            return;
        }
        userServices.updateFamiliarity(user._id, wordToShow._id, familiarity);
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

                <Flex justify="space-around" style={{ marginBottom: '1rem' }}>
                    {!shouldShowInfo && (
                        <>
                            <Button
                                type="primary"
                                onClick={() => handleLearn(5)}
                                style={{ width: '47%' }}
                            >
                                Known
                            </Button>
                            <Button
                                type="default"
                                onClick={() => handleLearn(0)}
                                style={{ width: '47%' }}
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
                <WordSideButtonGroup wordId={wordToShow._id} />
            </Flex>
        </>
    );
};

export default Learn;
