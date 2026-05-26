import { Flex, Skeleton } from 'antd';

const CenteredSkeleton = () => (
    <Flex style={{ height: '100%' }} align="center" justify="center">
        <Skeleton active paragraph={{ rows: 4 }} />
    </Flex>
);

export default CenteredSkeleton;
