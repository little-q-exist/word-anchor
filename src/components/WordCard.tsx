import type { Word } from '../types';

import { Card, Flex, Typography, Space } from 'antd';

const { Title, Text } = Typography;

interface WordInfoProps {
    word: Word;
    visible: boolean;
}

const WordCard = ({ word, visible }: WordInfoProps) => {
    const cardStyle: React.CSSProperties = {
        minWidth: '15rem',
        width: '49.5%',
        height: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
    };

    const showWhenVisible: React.CSSProperties = { opacity: visible ? 1 : 0 };

    return (
        <div style={{ width: '100%', height: '95%' }}>
            <Flex align="center" justify="space-between" style={{ width: '100%', height: '100%' }}>
                <Card style={cardStyle} variant="borderless">
                    <Space align="end" size="large" style={{ flex: 1 }}>
                        <Title level={1} style={{ margin: 0 }}>
                            {word.english}
                        </Title>
                        <Text style={{ fontSize: 20, padding: '0.5em 0' }}>{word.phonetic}</Text>
                    </Space>
                </Card>
                <Card
                    style={{ ...cardStyle, ...showWhenVisible, textAlign: 'center' }}
                    variant="borderless"
                >
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

export default WordCard;
