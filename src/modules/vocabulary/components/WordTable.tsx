import { Spin, Table } from 'antd';
import { Link } from 'react-router';
import type { Word } from '@/types';
import { useCallback } from 'react';
import wordServices from '@/services/words';
import { useQuery } from '@tanstack/react-query';
import type { UseSearchWordReturnType } from '../hooks/useSearchWord';

const { Column, ColumnGroup } = Table;

interface WordTableProps {
    selectedTags: UseSearchWordReturnType['selectedTags'];
    searchType: UseSearchWordReturnType['searchType'];
    searchValue: UseSearchWordReturnType['searchValue'];
    page: UseSearchWordReturnType['page'];
    setPage: UseSearchWordReturnType['setPage'];
}

const WordTable = ({ selectedTags, searchType, searchValue, page, setPage }: WordTableProps) => {
    const fetchWords = useCallback(() => {
        const tags = selectedTags.length > 0 ? selectedTags.join(',') : undefined;

        return wordServices.getBy({
            page,
            tags,
            [searchType === 'Eng' ? 'english' : 'meaning']: searchValue,
        });
    }, [page, searchType, searchValue, selectedTags]);

    const wordQuery = useQuery({
        queryKey: ['words', { page, searchType, searchValue, selectedTags }],
        queryFn: fetchWords,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const wordsToShow =
        wordQuery.data?.words.map((word) => {
            return { ...word, key: word._id };
        }) || [];

    if (wordQuery.isError) {
        console.error(wordQuery.error);
        return <div>Error loading words. Please try again later.</div>;
    }

    return (
        <Spin spinning={wordQuery.isPending}>
            <Table<Word>
                dataSource={wordsToShow}
                pagination={{
                    total: wordQuery.data?.count || 0,
                    current: page,
                    pageSize: 9,
                    onChange(page) {
                        setPage(page);
                    },
                }}
                style={{ flex: 1 }}
            >
                <Column
                    title="English"
                    dataIndex="english"
                    key="english"
                    render={(english: Word['english'], word: Word) => (
                        <Link to={`./${word._id}`}>{english}</Link>
                    )}
                />
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
        </Spin>
    );
};

export default WordTable;
