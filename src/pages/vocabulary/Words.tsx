import { Flex, theme } from 'antd';

import SearchWord from '@/modules/vocabulary/components/SearchWord';
import WordTable from '@/modules/vocabulary/components/WordTable';
import useSearchWord from '@/modules/vocabulary/hooks/useSearchWord';

const Words = () => {
    const { token } = theme.useToken();
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
        <Flex style={{ padding: `${token.paddingXXL}px 0`, height: '100%' }} vertical gap="small">
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
