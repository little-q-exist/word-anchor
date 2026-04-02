import ProtectedRoute from '@/layout/ProtectedRoute/ProtectedRoute';
import LearnWord from '../modules/word-learning/components/LearnWord/LearnWord';
import { Flex } from 'antd';

const Learn = () => {
    return (
        <ProtectedRoute>
            <Flex vertical justify="center" style={{ height: '100%' }}>
                <LearnWord mode={'learn'} />
            </Flex>
        </ProtectedRoute>
    );
};

export default Learn;
