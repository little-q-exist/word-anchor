import { useQuery } from '@tanstack/react-query';
import { Flex, Space, Select, Input, theme } from 'antd';
import wordServices from '@modules/vocabulary/services/words';
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
    const { token } = theme.useToken();

    const tagQuery = useQuery({
        queryKey: ['tags'],
        queryFn: () => wordServices.getTags(),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    return (
        <Flex justify="center" style={{ padding: `0 ${token.paddingXXL}px` }}>
            <Space style={{ width: '100%', maxWidth: 960 }} wrap>
                <Space.Compact style={{ flex: 1, minWidth: 280 }}>
                    <Select
                        defaultValue={searchType}
                        options={[
                            { value: 'Eng', label: 'Eng' },
                            { value: 'Zh', label: 'Zh' },
                        ]}
                        onChange={(value: 'Eng' | 'Zh') => {
                            setSearchType(value);
                        }}
                        style={{ width: 80 }}
                    />
                    <Input.Search
                        placeholder={`Search ${searchType === 'Eng' ? 'English' : 'Chinese'}...`}
                        onSearch={onSearch}
                        allowClear
                        onChange={handleAutoSearch}
                        style={{ flex: 1 }}
                        enterButton
                        key={searchType}
                    />
                </Space.Compact>
                <Select
                    mode="multiple"
                    placeholder="Filter by tags"
                    style={{ minWidth: 200, flex: 1 }}
                    options={tagQuery.data?.map((tag) => ({ label: tag, value: tag }))}
                    onChange={handleTagChange}
                    allowClear
                />
            </Space>
        </Flex>
    );
};

export default SearchWord;
