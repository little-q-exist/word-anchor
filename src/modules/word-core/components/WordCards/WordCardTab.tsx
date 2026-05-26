import { type TabsProps, Tabs, Typography } from 'antd';
import { useState } from 'react';
import type { Word } from '@modules/word-core/types';
import { centerStyle } from '@/shared/styles/centerStyle';

const { Text } = Typography;

const tabKeyTypes = {
    definitions: 'definitions',
    'example sentence': 'example sentence',
} as const;

type TabKeyType = (typeof tabKeyTypes)[keyof typeof tabKeyTypes];

const tabItems: TabsProps['items'] = [
    {
        key: tabKeyTypes.definitions,
        label: 'Definitions',
    },
    {
        key: tabKeyTypes['example sentence'],
        label: 'Example',
    },
];

interface WordCardTabProps {
    word: Word;
}

const WordCardTab = ({ word }: WordCardTabProps) => {
    const [tabKey, setTabKey] = useState<TabKeyType>('definitions');

    const renderTabContent = () => {
        switch (tabKey) {
            case 'definitions':
                if (!word.definitions || word.definitions.length === 0) {
                    return <Text type="secondary">No definitions available.</Text>;
                }
                return (
                    <>
                        {word.definitions.map((definition, index) => (
                            <div key={index}>
                                {definition.partOfSpeech} {definition.meaning}
                            </div>
                        ))}
                    </>
                );
            case 'example sentence':
                if (!word.exampleSentence || word.exampleSentence.length === 0) {
                    return <Text type="secondary">No example sentences available.</Text>;
                }
                return (
                    <>
                        {word.exampleSentence.map((sentence, index) => (
                            <div key={index}>{sentence}</div>
                        ))}
                    </>
                );
        }
    };

    return (
        <>
            <div
                style={{
                    flex: 1,
                    ...centerStyle,
                }}
            >
                <div>{renderTabContent()}</div>
            </div>
            <Tabs
                items={tabItems}
                tabPlacement="bottom"
                activeKey={tabKey}
                onChange={(activeKey) => setTabKey(activeKey as TabKeyType)}
            />
        </>
    );
};

export default WordCardTab;
