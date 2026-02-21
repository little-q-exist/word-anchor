import { Table } from 'antd';

import wordServices from '../../services/words';

import type { Word } from '../../types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { Route } from './+types/Words';

const { Column, ColumnGroup } = Table;

// eslint-disable-next-line react-refresh/only-export-components
export async function clientLoader() {
    const count = await wordServices.getCount();
    return { count };
}

const Words = ({ loaderData }: Route.ComponentProps) => {
    const wordCount = loaderData.count;

    const [page, setPage] = useState(1);
    const [words, setWords] = useState<Word[]>([]);

    useEffect(() => {
        wordServices.getBy({ page }).then((words) => setWords(words));
    }, [page]);

    const wordsToShow = words.map((word) => {
        return { ...word, key: word._id };
    });

    return (
        <div style={{ height: '100%' }}>
            <Table<Word>
                dataSource={wordsToShow}
                pagination={{
                    total: wordCount,
                    current: page,
                    onChange(page) {
                        setPage(page);
                    },
                }}
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
        </div>
    );
};

export default Words;
