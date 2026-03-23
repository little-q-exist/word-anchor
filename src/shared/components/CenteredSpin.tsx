import { Flex, Spin } from 'antd';

const CenteredSpin = () => (
    <Flex style={{ height: '100%' }} align="center" justify="center">
        <Spin spinning />
    </Flex>
);

export default CenteredSpin;
