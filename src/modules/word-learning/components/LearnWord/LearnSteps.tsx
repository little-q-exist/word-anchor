import { Drawer, Steps, Empty } from 'antd';
import type { BriefWordWithLearnStatus } from '@modules/word-learning/types';

interface LearnStepsProps {
    briefWords: BriefWordWithLearnStatus[];
    currentIndex: number;
    index: number;
    onChange: (index: number) => void;
    open: boolean;
    onClose: () => void;
}

const LearnSteps = ({
    briefWords,
    currentIndex,
    index,
    onChange,
    open,
    onClose,
}: LearnStepsProps) => {
    const generateStatus = (status: BriefWordWithLearnStatus['status'], wordIndex: number) => {
        if (wordIndex === index) {
            return 'process';
        }
        switch (status) {
            case 'passed':
                return 'finish';
            case 'failed':
                return 'error';
            default:
                return 'wait';
        }
    };

    const items = briefWords.map((word, wordIndex) => ({
        key: word._id,
        title: word.english,
        status: generateStatus(word.status, wordIndex),
        disabled: word.status !== 'passed' && wordIndex !== index,
    })) satisfies { status: 'finish' | 'error' | 'wait' | 'process' }[];

    return (
        <Drawer open={open} placement="left" mask={false} onClose={onClose}>
            {briefWords.length > 0 ? (
                <Steps
                    orientation="vertical"
                    current={currentIndex}
                    items={items}
                    onChange={onChange}
                />
            ) : (
                <Empty description="No words to learn" />
            )}
        </Drawer>
    );
};

export default LearnSteps;
