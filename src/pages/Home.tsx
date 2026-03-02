import { Button, Flex, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import type { RootState } from '../store';

const { Title } = Typography;

const HOME_TITLE = [
    'Dive Deep, Remember Forever.',
    'Where Words Become Memories.',
    'Beyond Memorization, True Mastery.',
    'Your Journey to Fluent English Starts Here.',
];

const Home = () => {
    const user = useSelector((state: RootState) => state.user);
    const titleIndex = Math.floor((Math.random() * 10) % HOME_TITLE.length);
    return (
        <Flex style={{ height: '100%' }} align="center" justify="center">
            {!user && (
                <>
                    <Flex flex={3} justify="center" style={{ padding: '0 2rem' }}>
                        <Title level={1} style={{ margin: 0, textAlign: 'center' }}>
                            {HOME_TITLE[titleIndex]}
                        </Title>
                    </Flex>
                    <Flex flex={2} align="center" justify="center" gap={'large'} vertical>
                        <Link to="/login">
                            <Button type="primary" size="large">
                                Log In
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button type="default" size="large">
                                Sign Up
                            </Button>
                        </Link>
                    </Flex>
                </>
            )}
            {user && (
                <>
                    <Flex flex={3} justify="center" style={{ padding: '0 2rem' }}>
                        <Title level={1} style={{ margin: 0, textAlign: 'center' }}>
                            {HOME_TITLE[titleIndex]}
                        </Title>
                    </Flex>
                    <Flex flex={2} align="center" justify="center" gap={'large'} vertical>
                        <Link to="/learn">
                            <Button type="primary" size="large">
                                Learn
                            </Button>
                        </Link>
                        <Link to="/review">
                            <Button type="default" size="large">
                                Review
                            </Button>
                        </Link>
                    </Flex>
                </>
            )}
        </Flex>
    );
};

export default Home;
