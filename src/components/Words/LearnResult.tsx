import { Flex, Table, Button } from 'antd';
import { useNavigate } from 'react-router';
import type { Word, BriefWordWithLearnStatus } from '../../types';

const { Column, ColumnGroup } = Table;

interface LearnResultProps {
    words: BriefWordWithLearnStatus[];
}

const LearnResult = ({ words }: LearnResultProps) => {
    const navigate = useNavigate();

    // TODO: fetch full word data for all words in the list to show more info in the result page, currently only english and phonetic are shown, we can show part of speech and meaning as well after fetching full data
    const wordsToShow = words.map((word) => {
        return { ...word, key: word._id };
    });

    return (
        <Flex vertical gap="middle" style={{ margin: '1rem 0', height: '100%' }}>
            <h2 style={{ textAlign: 'center' }}>Learning Complete!</h2>
            <Table<BriefWordWithLearnStatus>
                dataSource={wordsToShow}
                pagination={false}
                style={{ flex: 1, overflow: 'auto' }}
            >
                <Column title="English" dataIndex="english" key="english" />
                <Column title="Phonetic" dataIndex="phonetic" key="phonetic" />
                <ColumnGroup title="Definitions">
                    <Column
                        title="partOfSpeech"
                        dataIndex="definitions"
                        key="partOfSpeech"
                        render={(definitions: Word['definitions']) => (
                            <>
                                {definitions.map((def, i) => (
                                    <div key={i}>{def.partOfSpeech}</div>
                                ))}
                            </>
                        )}
                    />
                    <Column
                        title="meaning"
                        dataIndex="definitions"
                        key="meaning"
                        render={(definitions: Word['definitions']) => (
                            <>
                                {definitions.map((def, i) => (
                                    <div key={i}>{def.meaning}</div>
                                ))}
                            </>
                        )}
                    />
                </ColumnGroup>
            </Table>
            <Flex justify="center">
                <Button type="primary" onClick={() => navigate('..')} size="large">
                    Finish and Go Back
                </Button>
            </Flex>
        </Flex>
    );
};

export default LearnResult;
