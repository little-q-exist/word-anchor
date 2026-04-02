import ProtectedRoute from '@/layout/ProtectedRoute/ProtectedRoute';
import LearnWord from '../modules/word-learning/components/LearnWord/LearnWord';
import { Flex } from 'antd';

const Review = () => {
    return (
        <ProtectedRoute>
            <Flex vertical justify="center" style={{ height: '100%' }}>
                <LearnWord mode={'review'} />
            </Flex>
        </ProtectedRoute>
    );
};

export default Review;
