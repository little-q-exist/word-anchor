import { Timeline } from 'antd';
import type { BriefWordWithLearnStatus } from '@/types';

interface LearnProgressProps {
    briefWords: BriefWordWithLearnStatus[];
    index: number;
}

const LearnProgress = ({ briefWords, index }: LearnProgressProps) => {
    const generateColor = (word: BriefWordWithLearnStatus, wordIndex: number) => {
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
    return (
        <Timeline
            orientation="horizontal"
            items={briefWords.map((word, wordIndex) => {
                return {
                    content: <div>{word.english}</div>,
                    color: generateColor(word, wordIndex),
                };
            })}
        />
    );
};

export default LearnProgress;
