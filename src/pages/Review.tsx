import LearnWord from '../modules/word-learning/components/LearnWord/LearnWord';
import { Flex } from 'antd';

const Review = () => {
    return (
        <Flex vertical justify="center" style={{ height: '100%' }}>
            <LearnWord mode={'review'} />
        </Flex>
    );
};

export default Review;
