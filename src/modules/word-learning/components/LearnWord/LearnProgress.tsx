import { useMemo, useState } from 'react';
import { Progress, Button, Flex } from 'antd';
import { BarsOutlined } from '@ant-design/icons';
import type { BriefWordWithLearnStatus } from '@modules/word-learning/types';
import LearnSteps from './LearnSteps';

interface LearnProgressProps {
    briefWords: BriefWordWithLearnStatus[];
    index: number;
    onChange: (index: number) => void;
}

const LearnProgress = ({ briefWords, index, onChange }: LearnProgressProps) => {
    const [open, setOpen] = useState(false);
    const percent = useMemo(
        () => Math.round((index / briefWords.length) * 100),
        [briefWords.length, index]
    );

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
                index={index}
                onChange={(i) => {
                    onChange(i);
                    onClose();
                }}
                open={open}
                onClose={onClose}
            />
        </Flex>
    );
};

export default LearnProgress;
