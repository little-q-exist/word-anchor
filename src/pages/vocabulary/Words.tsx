import { Flex } from 'antd';

import SearchWord from '@/modules/vocabulary/components/SearchWord';
import WordTable from '@/modules/vocabulary/components/WordTable';
import useSearchWord from '@/modules/vocabulary/hooks/useSearchWord';

const Words = () => {
    const {
        page,
        setPage,
        selectedTags,
        searchValue,
        searchType,
        onSearch,
        handleAutoSearch,
        handleTagChange,
        setSearchType,
    } = useSearchWord();
    return (
        <Flex style={{ margin: '1rem 0' }} vertical gap="small">
            <SearchWord
                searchType={searchType}
                setSearchType={setSearchType}
                onSearch={onSearch}
                handleAutoSearch={handleAutoSearch}
                handleTagChange={handleTagChange}
            />
            <WordTable
                page={page}
                setPage={setPage}
                selectedTags={selectedTags}
                searchType={searchType}
                searchValue={searchValue}
            />
        </Flex>
    );
};

export default Words;
