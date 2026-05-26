import { useMemo, useState } from 'react';
import { Progress, Button, Flex } from 'antd';
import { BarsOutlined } from '@ant-design/icons';
import type { BriefWordWithLearnStatus } from '@modules/word-learning/types';
import LearnSteps from './LearnSteps';

interface LearnProgressProps {
    briefWords: BriefWordWithLearnStatus[];
    currentIndex: number;
    index: number;
    onChange: (index: number) => void;
}

const LearnProgress = ({ briefWords, currentIndex, index, onChange }: LearnProgressProps) => {
    const [open, setOpen] = useState(false);
    const percent = useMemo(() => {
        if (briefWords.length === 0) {
            return 0;
        }

        return Math.round((index / briefWords.length) * 100);
    }, [briefWords.length, index]);

    const onClose = () => {
        setOpen(false);
    };

    return (
        <Flex gap="small" align="center">
            <Button icon={<BarsOutlined />} size="middle" onClick={() => setOpen(true)} />
            <div style={{ flex: 1 }}>
                <Progress percent={percent} showInfo={false} />
            </div>
            <LearnSteps
                briefWords={briefWords}
                currentIndex={currentIndex}
                index={index}
                onChange={onChange}
                open={open}
                onClose={onClose}
            />
        </Flex>
    );
};

export default LearnProgress;
