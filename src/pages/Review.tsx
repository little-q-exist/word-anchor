import LearnWord from '../modules/word-learning/components/LearnWord/LearnWord';
import wordServices from '../shared/services/words';
import { useQuery } from '@tanstack/react-query';
import { Flex } from 'antd';

const Review = () => {
    const { data, isError, isPending } = useQuery({
        queryKey: ['reviewWords'],
        queryFn: () => wordServices.getWordToReview(),
        refetchOnWindowFocus: false,
    });

    if (isError) {
        return <div style={{ padding: '24px' }}>some error occurred</div>;
    }

    return (
        <Flex vertical justify="center" style={{ height: '100%' }}>
            {!isPending ? (
                <LearnWord
                    key={data.words.map((i) => i._id).join(',')}
                    loadedWords={data.words}
                    mode={data.mode}
                    isBriefWordLoading={isPending}
                />
            ) : (
                <LearnWord isBriefWordLoading={isPending} />
            )}
        </Flex>
    );
};

export default Review;
