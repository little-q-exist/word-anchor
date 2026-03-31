import LearnWord from '../modules/word-learning/components/LearnWord/LearnWord';
import { Flex } from 'antd';

const Learn = () => {
    return (
        <Flex vertical justify="center" style={{ height: '100%' }}>
            <LearnWord mode={'learn'} />
        </Flex>
    );
};

export default Learn;
