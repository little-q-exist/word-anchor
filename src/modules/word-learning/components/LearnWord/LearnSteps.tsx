import { Drawer, Steps, Empty } from 'antd';
import type { BriefWordWithLearnStatus } from '@modules/word-learning/types';

interface LearnStepsProps {
    briefWords: BriefWordWithLearnStatus[];
    index: number;
    onChange: (index: number) => void;
    open: boolean;
}

const LearnSteps = ({ briefWords, index, onChange, open }: LearnStepsProps) => {
    if (briefWords.length === 0) {
        return (
            <Drawer open={open} placement="left" mask={false}>
                <Empty />
            </Drawer>
        );
    }

    const items = briefWords.map((word) => ({
        key: word._id,
        title: word.english,
        status: (word.status === 'passed' ? 'finish' : 'wait') as 'finish' | 'wait',
        disabled: word.status !== 'passed',
    }));

    return (
        <Drawer open={open} placement="left" mask={false}>
            <Steps
                orientation="vertical"
                current={index}
                items={items}
                onChange={(stepIndex) => onChange(stepIndex)}
            />
        </Drawer>
    );
};

export default LearnSteps;
