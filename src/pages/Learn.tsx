import wordServices from '../services/words';

import LearnWord from '../components/Words/LearnWord';
import { useQuery } from '@tanstack/react-query';
import { Flex, Spin } from 'antd';

const Learn = () => {
    const { data, isError, isFetching } = useQuery({
        queryKey: ['learnWords'],
        queryFn: () => wordServices.getWordToLearn(),
        refetchOnWindowFocus: false,
    });

    if (isError) {
        return <div style={{ padding: '24px' }}>some error occurred</div>;
    }

    return (
        <Flex vertical justify="center" style={{ height: '100%' }}>
            {isFetching ? (
                <Spin size="large" />
            ) : data ? (
                <LearnWord key={data.map((w) => w._id).join(',')} loadedWords={data} />
            ) : null}
        </Flex>
    );
};

export default Learn;
