import { Flex, Table, Input, type GetProps, Select, Space, Spin } from 'antd';

import wordServices from '../../services/words';

import type { Word } from '../../types';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { Route } from './+types/Words';
import { useDebounce } from '../../hook/useDebounce';

const { Column, ColumnGroup } = Table;

// eslint-disable-next-line react-refresh/only-export-components
export async function clientLoader() {
    const [count, tags] = await Promise.all([wordServices.getCount(), wordServices.getTags()]);
    return { count, tags };
}

type SearchProps = GetProps<typeof Input.Search>;
type SearchStateType =
    | {
          english: string | undefined;
          type: 'Eng';
      }
    | {
          meaning: string | undefined;
          type: 'Zh';
      };

const Words = ({ loaderData }: Route.ComponentProps) => {
    const wordCount = loaderData.count;
    const allTags = loaderData.tags;

    const [page, setPage] = useState(1);
    const [words, setWords] = useState<Word[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [searchValue, setSearchValue] = useState<SearchStateType>({
        english: undefined,
        type: 'Eng',
    });

    const fetchWords = useCallback(() => {
        const tags = selectedTags.length > 0 ? selectedTags.join(',') : undefined;
        setLoadingStatus(true);

        const searchParams: { page: number; tags?: string; english?: string; meaning?: string } = {
            page,
            tags,
        };
        if (searchValue.type === 'Eng') {
            searchParams.english = searchValue.english;
        } else {
            searchParams.meaning = searchValue.meaning;
        }

        wordServices.getBy(searchParams).then((words) => {
            setWords(words);
            setLoadingStatus(false);
        });
    }, [page, searchValue, selectedTags]);

    useEffect(() => {
        fetchWords();
    }, [fetchWords]);

    const wordsToShow = words.map((word) => {
        return { ...word, key: word._id };
    });

    const onSearch: SearchProps['onSearch'] = async (value) => {
        if (searchValue.type === 'Eng') {
            setSearchValue({ english: value || undefined, type: 'Eng' });
        } else {
            setSearchValue({ meaning: value || undefined, type: 'Zh' });
        }
        setPage(1);
    };

    const handleAutoSearch = useDebounce((e: React.ChangeEvent<HTMLInputElement>) => {
        if (searchValue.type === 'Eng') {
            setSearchValue({ english: e.target.value || undefined, type: 'Eng' });
        } else {
            setSearchValue({ meaning: e.target.value || undefined, type: 'Zh' });
        }
        setPage(1);
    }, 500);

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
                                let searchVal: SearchStateType = {
                                    type: 'Eng',
                                    english: undefined,
                                };
                                if (value === 'Zh') {
                                    searchVal = { type: 'Zh', meaning: undefined };
                                }
                                setSearchValue(searchVal);
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
                        options={allTags.map((tag) => ({ label: tag, value: tag }))}
                        onChange={(values) => {
                            setSelectedTags(values);
                            setPage(1);
                        }}
                        allowClear
                    />
                </Space>
            </Flex>
            <Spin spinning={loadingStatus}>
                <Table<Word>
                    dataSource={wordsToShow}
                    pagination={{
                        total: wordCount,
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
                        render={(english: Word['english']) => (
                            <Link to={`./${english}`}>{english}</Link>
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
