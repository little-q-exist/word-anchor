import { type TabsProps, Tabs } from 'antd';
import { useState } from 'react';
import type { Word } from '@/types';
import { centerStyle } from '@/shared/styles/centerStyle';

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

interface WordCardTabProps {
    word: Word;
}

const WordCardTab = ({ word }: WordCardTabProps) => {
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
