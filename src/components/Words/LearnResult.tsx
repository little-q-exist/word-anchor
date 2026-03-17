import { Flex, Table, Button, Skeleton } from 'antd';
import { useNavigate } from 'react-router';
import type { BriefWordWithLearnStatus } from '../../types';
import { queryOptions, useQueries } from '@tanstack/react-query';
import wordService from '../../services/words';

const { Column, ColumnGroup } = Table;

interface LearnResultProps {
    briefWords: BriefWordWithLearnStatus[];
}

interface DetailedWordRow {
    key: string;
    isLoading: boolean;
    english?: string;
    phonetic?: string;
    definitions?: { partOfSpeech: string; meaning: string }[];
}

const LearnResult = ({ briefWords }: LearnResultProps) => {
    const navigate = useNavigate();

    function fetchDetailedWordDataOption(wordId: string) {
        return queryOptions({
            queryKey: ['word', wordId],
            queryFn: () => wordService.getById(wordId),
            refetchOnMount: false,
            refetchOnWindowFocus: false,
        });
    }

    const detailedWordsQuery = useQueries({
        queries: briefWords.map((word) => fetchDetailedWordDataOption(word._id)),
        combine: (results) => {
            return results.map((result, index): DetailedWordRow => {
                return {
                    ...(result.data ?? {}),
                    key: briefWords[index]._id,
                    isLoading: result.isLoading,
                };
            });
        },
    });

    type DetailedWordWithLoading = DetailedWordRow;

    return (
        <Flex vertical gap="middle" style={{ margin: '1rem 0', height: '100%' }}>
            <h2 style={{ textAlign: 'center' }}>Learning Complete!</h2>
            <Table<DetailedWordWithLoading>
                dataSource={detailedWordsQuery}
                pagination={false}
                style={{ flex: 1, overflow: 'auto' }}
            >
                <Column
                    title="English"
                    dataIndex="english"
                    key="english"
                    render={(
                        english: DetailedWordWithLoading['english'],
                        record: DetailedWordWithLoading
                    ) => (
                        <>
                            {record.isLoading ? (
                                <Skeleton active paragraph={false} />
                            ) : (
                                <div>{english}</div>
                            )}
                        </>
                    )}
                />
                <Column
                    title="Phonetic"
                    dataIndex="phonetic"
                    key="phonetic"
                    render={(
                        phonetic: DetailedWordWithLoading['phonetic'],
                        record: DetailedWordWithLoading
                    ) => (
                        <>
                            {record.isLoading ? (
                                <Skeleton active paragraph={false} />
                            ) : (
                                <div>{phonetic}</div>
                            )}
                        </>
                    )}
                />
                <ColumnGroup title="Definitions">
                    <Column
                        title="partOfSpeech"
                        dataIndex="definitions"
                        key="partOfSpeech"
                        render={(
                            definitions: DetailedWordWithLoading['definitions'],
                            record: DetailedWordWithLoading
                        ) => (
                            <>
                                {record.isLoading ? (
                                    <Skeleton active paragraph={false} />
                                ) : (
                                    definitions?.map((def, i) => (
                                        <div key={i}>{def.partOfSpeech}</div>
                                    ))
                                )}
                            </>
                        )}
                    />
                    <Column
                        title="meaning"
                        dataIndex="definitions"
                        key="meaning"
                        render={(
                            definitions: DetailedWordWithLoading['definitions'],
                            record: DetailedWordWithLoading
                        ) => (
                            <>
                                {record.isLoading ? (
                                    <Skeleton active paragraph={false} />
                                ) : (
                                    definitions?.map((def, i) => <div key={i}>{def.meaning}</div>)
                                )}
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
