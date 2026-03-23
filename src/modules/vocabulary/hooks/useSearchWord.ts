import type { Input } from 'antd';
import type { GetProps } from 'react-redux';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { useState } from 'react';

type SearchProps = GetProps<typeof Input.Search>;
type SearchType = { type: 'Eng' | 'Zh'; value: string | undefined };

const useSearchWord = () => {
    const [page, setPage] = useState(1);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [search, setSearch] = useState<SearchType>({
        value: undefined,
        type: 'Eng',
    });

    const resetPage = () => setPage(1);

    const setSearchValue = (value: SearchType['value']) => {
        setSearch((prev) => ({ ...prev, value: value || undefined }));
    };

    const setSearchType = (type: SearchType['type']) => {
        setSearch({ value: undefined, type });
    };

    const onSearch: SearchProps['onSearch'] = async (value) => {
        setSearchValue(value);
        resetPage();
    };

    const handleAutoSearch = useDebounce((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
        resetPage();
    }, 500);

    const handleTagChange = useDebounce((values: string[]) => {
        setSelectedTags(values);
        resetPage();
    }, 500);

    return {
        page,
        setPage,
        selectedTags,
        searchValue: search.value,
        searchType: search.type,
        onSearch,
        handleAutoSearch,
        handleTagChange,
        setSearchType,
    };
};

export default useSearchWord;

export type UseSearchWordReturnType = ReturnType<typeof useSearchWord>;
