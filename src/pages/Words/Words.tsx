import { Flex, Table, Input, type GetProps, Select, Space, Spin } from 'antd';

import wordServices from '../../services/words';

import type { Word } from '../../types';
import { useCallback, useState } from 'react';
import { Link } from 'react-router';
import { useDebounce } from '../../hook/useDebounce';
import { useQuery } from '@tanstack/react-query';

const { Column, ColumnGroup } = Table;

type SearchProps = GetProps<typeof Input.Search>;
type SearchStateType = { type: 'Eng' | 'Zh'; value: string | undefined };

const Words = () => {
    const [page, setPage] = useState(1);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchValue, setSearchValue] = useState<SearchStateType>({
        value: undefined,
        type: 'Eng',
    });

    const fetchWords = useCallback(() => {
        const tags = selectedTags.length > 0 ? selectedTags.join(',') : undefined;

        return wordServices.getBy({
            page,
            tags,
            [searchValue.type === 'Eng' ? 'english' : 'meaning']: searchValue.value,
        });
    }, [page, searchValue, selectedTags]);

    const tagQuery = useQuery({
        queryKey: ['tags'],
        queryFn: () => wordServices.getTags(),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const wordQuery = useQuery({
        queryKey: ['words', { page, searchValue, selectedTags }],
        queryFn: fetchWords,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const wordsToShow =
        wordQuery.data?.words.map((word) => {
            return { ...word, key: word._id };
        }) || [];

    const onSearch: SearchProps['onSearch'] = async (value) => {
        setSearchValue((prev) => ({ ...prev, value: value || undefined }));
        setPage(1);
    };

    const handleAutoSearch = useDebounce((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue((prev) => ({ ...prev, value: e.target.value || undefined }));
        setPage(1);
    }, 500);

    const handleTagChange = useDebounce((values: string[]) => {
        setSelectedTags(values);
        setPage(1);
    }, 500);

    if (wordQuery.isError) {
        console.error(wordQuery.error);
        return <div>Error loading words. Please try again later.</div>;
    }

    return (
        <Flex style={{ margin: '1rem 0' }} vertical gap="small">
            <Flex justify="center">
                <Space style={{ width: '95%' }}>
                    <Space.Compact>
                        <Select
                            defaultValue={searchValue.type}
                            options={[
                                { value: 'Eng', label: 'Eng' },
                                { value: 'Zh', label: 'Zh' },
                            ]}
                            onChange={(value: 'Eng' | 'Zh') => {
                                setSearchValue({
                                    type: value,
                                    value: undefined,
                                });
                            }}
                        />
                        <Input.Search
                            placeholder={`Search ${searchValue.type === 'Eng' ? 'English' : 'Chinese'}...`}
                            onSearch={onSearch}
                            allowClear
                            onChange={handleAutoSearch}
                            style={{ width: 500 }}
                            enterButton
                            key={searchValue.type}
                        />
                    </Space.Compact>
                    <Select
                        mode="multiple"
                        placeholder="Filter by tags"
                        style={{ minWidth: 200 }}
                        options={tagQuery.data?.map((tag) => ({ label: tag, value: tag }))}
                        onChange={handleTagChange}
                        allowClear
                    />
                </Space>
            </Flex>
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
        </Flex>
    );
};

export default Words;
