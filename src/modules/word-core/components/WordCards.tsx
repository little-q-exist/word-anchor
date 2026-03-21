import type { Word } from '../../../types';

import { Flex, Typography, Space, Skeleton } from 'antd';

import WordCardTab from './WordCardTab';
import WordCard from './WordCard';

const { Title, Text } = Typography;

interface WordCardProps {
    word: Word;
    visible: boolean;
}

const WordCards = ({ word, visible }: WordCardProps) => {
    return (
        <Flex align="center" justify="space-between" style={{ width: '100%', height: '100%' }}>
            <WordCard centerContent>
                <Space size="large" style={{ flex: 1 }}>
                    <Title level={1} style={{ margin: 0 }}>
                        {word.english}
                    </Title>
                    <Space vertical align="end">
                        <Text style={{ fontSize: 20, padding: '0.5em 0' }}>{word.phonetic}</Text>
                    </Space>
                </Space>
            </WordCard>
            <WordCard>
                {visible && <WordCardTab word={word} />}
                {!visible && <Skeleton />}
            </WordCard>
        </Flex>
    );
};

export default WordCards;
