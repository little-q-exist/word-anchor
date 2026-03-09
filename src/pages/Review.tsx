import LearnWord from '../components/Words/LearnWord';
import wordServices from '../services/words';
import type { WordWithLearnStatus } from '../types';
import { useQuery } from '@tanstack/react-query';
import { Flex, Spin } from 'antd';

const Review = () => {
    const { data, isError } = useQuery({
        queryKey: ['reviewWords'],
        queryFn: () => wordServices.getWordToReview(),
        refetchOnWindowFocus: false,
    });

    console.log('data', data);

    const wordsWithStatus: WordWithLearnStatus[] =
        data?.map((word) => {
            return { ...word, status: 'idle' };
        }) || [];

    if (isError) {
        return <div style={{ padding: '24px' }}>some error occurred</div>;
    }

    return (
        <Flex vertical justify="center" style={{ height: '100%' }}>
            {data && <LearnWord loadedWords={wordsWithStatus} />}
            {!data && <Spin size="large" />}
        </Flex>
    );
};

export default Review;
