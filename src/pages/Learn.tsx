import ProtectedRoute from '@/layout/ProtectedRoute/ProtectedRoute';
import LearnWord from '../modules/word-learning/components/LearnWord/LearnWord';
import { Flex, theme } from 'antd';

const Learn = () => {
    const { token } = theme.useToken();
    return (
        <ProtectedRoute>
            <Flex vertical justify="center" style={{ height: '100%', padding: token.paddingXXL }}>
                <LearnWord mode={'learn'} />
            </Flex>
        </ProtectedRoute>
    );
};

export default Learn;
