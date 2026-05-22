import { Drawer, Steps, Empty } from 'antd';
import type { BriefWordWithLearnStatus } from '@modules/word-learning/types';

interface LearnStepsProps {
    briefWords: BriefWordWithLearnStatus[];
    index: number;
    onChange: (index: number) => void;
    open: boolean;
    onClose: () => void;
}

const LearnSteps = ({ briefWords, index, onChange, open, onClose }: LearnStepsProps) => {
    const generateStatus = (status: BriefWordWithLearnStatus['status']) => {
        switch (status) {
            case 'passed':
                return 'finish';
            case 'failed':
                return 'error';
            default:
                return 'wait';
        }
    };

    const items = briefWords.map((word) => ({
        key: word._id,
        title: word.english,
        status: generateStatus(word.status),
        disabled: word.status !== 'passed',
    })) satisfies { status: 'finish' | 'error' | 'wait' }[];

    return (
        <Drawer open={open} placement="left" mask={false} onClose={onClose}>
            {briefWords.length > 0 ? (
                <Steps
                    orientation="vertical"
                    current={index}
                    items={items}
                    onChange={(stepIndex) => onChange(stepIndex)}
                />
            ) : (
                <Empty description="No words to learn" />
            )}
        </Drawer>
    );
};

export default LearnSteps;
