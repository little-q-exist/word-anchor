import { Timeline, theme } from 'antd';
import type { BriefWordWithLearnStatus } from '@modules/word-learning/types';

interface LearnProgressProps {
    briefWords: BriefWordWithLearnStatus[];
    index: number;
}

const LearnProgress = ({ briefWords, index }: LearnProgressProps) => {
    const { token } = theme.useToken();

    const generateColor = (word: BriefWordWithLearnStatus, wordIndex: number) => {
        if (wordIndex === index) {
            return token.colorPrimary;
        } else {
            switch (word.status) {
                case 'idle':
                    return token.colorTextTertiary;
                case 'passed':
                    return token.colorSuccess;
                case 'failed':
                    return token.colorError;
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
