import wordServices from '../services/words';

import LearnWord from '../components/Words/LearnWord';
import { useQuery } from '@tanstack/react-query';
import { Flex } from 'antd';

const Learn = () => {
    const { data, isError, isPending } = useQuery({
        queryKey: ['learnWords'],
        queryFn: () => wordServices.getWordToLearn(),
        refetchOnWindowFocus: false,
    });

    if (isError) {
        return <div style={{ padding: '24px' }}>some error occurred</div>;
    }

    return (
        <Flex vertical justify="center" style={{ height: '100%' }}>
            {!isPending ? (
                <LearnWord
                    key={data.wordIds.map((i) => i.english).join(',')}
                    loadedWords={data.wordIds}
                    mode={data.mode}
                    isLoading={isPending}
                />
            ) : (
                <LearnWord isLoading={isPending} />
            )}
        </Flex>
    );
};

export default Learn;
