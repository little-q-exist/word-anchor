import { useQuery } from '@tanstack/react-query';
import { Flex, Space, Select, Input } from 'antd';
import wordServices from '@/shared/services/words';
import type { UseSearchWordReturnType } from '../hooks/useSearchWord';

interface SearchWordProps {
    searchType: UseSearchWordReturnType['searchType'];
    setSearchType: UseSearchWordReturnType['setSearchType'];
    onSearch: UseSearchWordReturnType['onSearch'];
    handleAutoSearch: UseSearchWordReturnType['handleAutoSearch'];
    handleTagChange: UseSearchWordReturnType['handleTagChange'];
}

const SearchWord = ({
    searchType,
    setSearchType,
    onSearch,
    handleAutoSearch,
    handleTagChange,
}: SearchWordProps) => {
    const tagQuery = useQuery({
        queryKey: ['tags'],
        queryFn: () => wordServices.getTags(),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    return (
        <Flex justify="center">
            <Space style={{ width: '95%' }}>
                <Space.Compact>
                    <Select
                        defaultValue={searchType}
                        options={[
                            { value: 'Eng', label: 'Eng' },
                            { value: 'Zh', label: 'Zh' },
                        ]}
                        onChange={(value: 'Eng' | 'Zh') => {
                            setSearchType(value);
                        }}
                    />
                    <Input.Search
                        placeholder={`Search ${searchType === 'Eng' ? 'English' : 'Chinese'}...`}
                        onSearch={onSearch}
                        allowClear
                        onChange={handleAutoSearch}
                        style={{ width: 500 }}
                        enterButton
                        key={searchType}
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
    );
};

export default SearchWord;
