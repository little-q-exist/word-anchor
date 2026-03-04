import { Button, Card, Col, Flex, Row, Space, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import type { RootState } from '../store';
import {
    BookOutlined,
    RocketOutlined,
    SafetyCertificateOutlined,
    ThunderboltOutlined,
} from '@ant-design/icons';
import { useRef } from 'react';

const { Title, Paragraph } = Typography;

const HOME_TITLE = [
    'Dive Deep, Remember Forever.',
    'Where Words Become Memories.',
    'Beyond Memorization, True Mastery.',
    'Your Journey to Fluent English Starts Here.',
];

const Home = () => {
    const user = useSelector((state: RootState) => state.user);
    // Use a fixed index or memoize if you don't want it to change on every render,
    // but for now keeping random logic is fine preferably inside useEffect or assumed acceptable.
    // To avoid hydration mismatch if SSR involved, usually we'd use useEffect, but client-side is fine.
    const titleIndex = useRef(0);
    titleIndex.current = Math.floor((Math.random() * 10) % HOME_TITLE.length);

    return (
        <Flex vertical gap={'large'} style={{ minHeight: '100%', background: '#f0f2f5' }}>
            {/* Hero Section */}
            <Flex
                align="center"
                justify="center"
                style={{
                    background: 'linear-gradient(135deg, #1677ff 0%, #80bfff 100%)',
                    color: 'white',
                    textAlign: 'center',
                    flex: 9,
                }}
            >
                <Space orientation="vertical" size="large">
                    <Title level={1} style={{ color: 'white', fontSize: '3.5rem', margin: 0 }}>
                        {HOME_TITLE[titleIndex.current]}
                    </Title>
                    <Paragraph
                        style={{
                            color: 'rgba(255, 255, 255, 0.85)',
                            fontSize: '1.25rem',
                            maxWidth: '85%',
                            margin: '0 auto',
                        }}
                    >
                        Unlock your potential with our scientific approach to vocabulary retention.
                        Master English words efficiently and effectively.
                    </Paragraph>

                    <Space size="large" style={{ marginTop: '2rem' }}>
                        {!user ? (
                            <>
                                <Link to="/login">
                                    <Button
                                        type="default"
                                        size="large"
                                        style={{
                                            height: '3.5rem',
                                            padding: '0 3rem',
                                            fontSize: '1.2rem',
                                            color: '#1677ff',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Log In
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button
                                        ghost
                                        size="large"
                                        style={{
                                            height: '3.5rem',
                                            padding: '0 3rem',
                                            fontSize: '1.2rem',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/learn">
                                    <Button
                                        type="default"
                                        size="large"
                                        icon={<ThunderboltOutlined />}
                                        style={{
                                            height: '3.5rem',
                                            padding: '0 3rem',
                                            fontSize: '1.2rem',
                                            color: '#1677ff',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Start Learning
                                    </Button>
                                </Link>
                                <Link to="/review">
                                    <Button
                                        ghost
                                        size="large"
                                        icon={<BookOutlined />}
                                        style={{
                                            height: '3.5rem',
                                            padding: '0 3rem',
                                            fontSize: '1.2rem',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Review Now
                                    </Button>
                                </Link>
                            </>
                        )}
                    </Space>
                </Space>
            </Flex>

            {/* Features Section */}
            {!user && (
                <div style={{ margin: '0 auto', flex: 1 }}>
                    <Row gutter={[32, 32]}>
                        <Col xs={24} md={8}>
                            <Card
                                variant={'borderless'}
                                hoverable
                                style={{ height: '100%', textAlign: 'center' }}
                            >
                                <RocketOutlined
                                    style={{
                                        fontSize: '3rem',
                                        color: '#1677ff',
                                        marginBottom: '1.5rem',
                                    }}
                                />
                                <Title level={3}>Efficient Learning</Title>
                                <Paragraph type="secondary">
                                    Our spaced repetition algorithm ensures you learn words at the
                                    optimal time for long-term retention.
                                </Paragraph>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card
                                variant={'borderless'}
                                hoverable
                                style={{ height: '100%', textAlign: 'center' }}
                            >
                                <SafetyCertificateOutlined
                                    style={{
                                        fontSize: '3rem',
                                        color: '#52c41a',
                                        marginBottom: '1.5rem',
                                    }}
                                />
                                <Title level={3}>Track Progress</Title>
                                <Paragraph type="secondary">
                                    Visualize your improvement with detailed statistics. Watch your
                                    vocabulary grow day by day.
                                </Paragraph>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card
                                variant={'borderless'}
                                hoverable
                                style={{ height: '100%', textAlign: 'center' }}
                            >
                                <BookOutlined
                                    style={{
                                        fontSize: '3rem',
                                        color: '#722ed1',
                                        marginBottom: '1.5rem',
                                    }}
                                />
                                <Title level={3}>Huge Database</Title>
                                <Paragraph type="secondary">
                                    Access thousands of words across various categories including
                                    GRE, TOEFL, IELTS, and more.
                                </Paragraph>
                            </Card>
                        </Col>
                    </Row>
                </div>
            )}
        </Flex>
    );
};

export default Home;
