import { queryOptions, useQueries } from '@tanstack/react-query';
import { Skeleton, Table } from 'antd';
import wordService from '@/shared/services/words';
import type { BriefWordWithLearnStatus } from '@/types';

const { Column, ColumnGroup } = Table;

interface LearnResultTableProps {
    briefWords: BriefWordWithLearnStatus[];
}

interface DetailedWordWithLoading {
    key: string;
    isLoading: boolean;
    english?: string;
    phonetic?: string;
    definitions?: { partOfSpeech: string; meaning: string }[];
}

const LearnResultTable = ({ briefWords }: LearnResultTableProps) => {
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
            return results.map((result, index): DetailedWordWithLoading => {
                return {
                    ...(result.data ?? {}),
                    key: briefWords[index]._id,
                    isLoading: result.isLoading,
                };
            });
        },
    });

    return (
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
                                definitions?.map((def, i) => <div key={i}>{def.partOfSpeech}</div>)
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
    );
};

export default LearnResultTable;
