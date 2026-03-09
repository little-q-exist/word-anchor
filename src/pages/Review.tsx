import LearnWord from '../components/Words/LearnWord';
import wordServices from '../services/words';
import { useQuery } from '@tanstack/react-query';
import { Flex, Spin } from 'antd';

const Review = () => {
    const { data, isError, isFetching } = useQuery({
        queryKey: ['reviewWords'],
        queryFn: () => wordServices.getWordToReview(),
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

export default Review;
