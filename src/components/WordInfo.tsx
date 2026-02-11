import type { Word } from '../types';

import { Card, Flex, Typography, Space } from 'antd';

const { Title, Text } = Typography;

interface WordInfoProps {
    word: Word;
    visible: boolean;
}

const WordInfo = ({ word, visible }: WordInfoProps) => {
    const cardStyle = { minWidth: '15rem', width: '49.5%', height: '90%' };

    const showWhenVisible = { display: visible ? '' : '' };

    return (
        <div style={{ width: '100%', height: '75vh' }}>
            <Flex align="center" justify="space-between" style={{ width: '100%', height: '100%' }}>
                <Card style={cardStyle}>
                    <Space align="end" size="large">
                        <Title level={1} style={{ margin: 0 }}>
                            {word.english}
                        </Title>
                        <Text style={{ fontSize: 20, padding: '0.5em 0' }}>{word.phonetic}</Text>
                    </Space>
                </Card>
                <Card style={{ ...cardStyle, ...showWhenVisible }}>
                    {word.definitions.map((definition, index) => (
                        <div key={index}>
                            {definition.partOfSpeech} {definition.meaning}
                        </div>
                    ))}
                </Card>
            </Flex>
        </div>
    );
};

export default WordInfo;
