import ProtectedRoute from '@/layout/ProtectedRoute/ProtectedRoute';
import LearnWord from '../modules/word-learning/components/LearnWord/LearnWord';
import { Flex, theme } from 'antd';

const Review = () => {
    const { token } = theme.useToken();
    return (
        <ProtectedRoute>
            <Flex vertical justify="center" style={{ height: '100%', padding: token.paddingXXL }}>
                <LearnWord mode={'review'} />
            </Flex>
        </ProtectedRoute>
    );
};

export default Review;
