import type React from 'react';
import type { Word } from '../../types';

import { Card, Flex, Typography, Space, Tabs, type TabsProps, Skeleton } from 'antd';
import { useState } from 'react';

const { Title, Text } = Typography;

interface WordInfoProps {
    word: Word;
    visible: boolean;
}

interface TabContentProps {
    children: React.ReactNode;
}

const TabContent = (props: TabContentProps) => {
    return <div>{props.children}</div>;
};

const cardStyle: React.CSSProperties = {
    minWidth: '15rem',
    width: '49.5%',
    height: '90%',
};

const cardContentCenterStyle: React.CSSProperties = {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
};

const tabKeyTypes = {
    definitions: 'definitions',
    'example sentense': 'example sentense',
} as const;

type TabKeyType = (typeof tabKeyTypes)[keyof typeof tabKeyTypes];

const tabItems: TabsProps['items'] = [
    {
        key: tabKeyTypes.definitions,
        label: 'Definitions',
    },
    {
        key: tabKeyTypes['example sentense'],
        label: 'Example',
    },
];

const WordCard = ({ word, visible }: WordInfoProps) => {
    const [tabKey, setTabKey] = useState<TabKeyType>('definitions');

    const renderTabContent = () => {
        switch (tabKey) {
            case 'definitions':
                return (
                    <>
                        {word.definitions.map((definition, index) => (
                            <div key={index}>
                                {definition.partOfSpeech} {definition.meaning}
                            </div>
                        ))}
                    </>
                );
            case 'example sentense':
                return (
                    <>
                        {word.exampleSentence.map((sentense, index) => (
                            <div key={index}>{sentense}</div>
                        ))}
                    </>
                );
        }
    };

    return (
        <Flex align="center" justify="space-between" style={{ width: '100%', height: '100%' }}>
            <Card style={{ ...cardStyle, ...cardContentCenterStyle }} variant="borderless">
                <Space align="end" size="large" style={{ flex: 1 }}>
                    <Title level={1} style={{ margin: 0 }}>
                        {word.english}
                    </Title>
                    <Text style={{ fontSize: 20, padding: '0.5em 0' }}>{word.phonetic}</Text>
                </Space>
            </Card>
            <Card
                style={{ ...cardStyle, textAlign: 'center' }}
                styles={{
                    body: {
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        paddingBottom: 0,
                        // ...showWhenVisible,
                    },
                }}
                variant="borderless"
            >
                {visible && (
                    <>
                        <div
                            style={{
                                flex: 1,
                                ...cardContentCenterStyle,
                            }}
                        >
                            <TabContent>{renderTabContent()}</TabContent>
                        </div>
                        <Tabs
                            items={tabItems}
                            tabPlacement="bottom"
                            activeKey={tabKey}
                            onChange={(activeKey) => setTabKey(activeKey as TabKeyType)}
                        />
                    </>
                )}
                {!visible && <Skeleton />}
            </Card>
        </Flex>
    );
};

export default WordCard;
