import { Button, Flex, Space, Typography } from 'antd';
import { CalendarOutlined, ThunderboltOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Link } from 'react-router';

const { Title } = Typography;

export interface HomeTitle {
    main: string;
    accent: string;
    sub: string;
}

interface HeroProps {
    title: HomeTitle;
    isLoggedIn: boolean;
}

const Hero = ({ title, isLoggedIn }: HeroProps) => {
    return (
        <Flex
            vertical
            align="center"
            justify="center"
            style={{
                flex: 1,
                zIndex: 1,
                padding: '0 2rem',
            }}
        >
            <div style={{ textAlign: 'center', maxWidth: 800 }}>
                <Space orientation="vertical" size={24} style={{ width: '100%' }}>
                    <div style={{ marginBottom: 8 }}>
                        <Title
                            level={1}
                            style={{
                                fontSize: 'clamp(3rem, 10vw, 5rem)',
                                margin: 0,
                                fontWeight: 800,
                                letterSpacing: '-0.02em',
                                lineHeight: 1.1,
                            }}
                        >
                            {title.main} <span style={{ color: '#1677ff' }}>{title.accent}</span>
                        </Title>
                        <Title
                            level={2}
                            style={{
                                margin: '1.5rem 0 0',
                                fontWeight: 400,
                                color: '#8c8c8c',
                                fontSize: '1.5rem',
                                letterSpacing: '0.05em',
                            }}
                        >
                            {title.sub}
                        </Title>
                    </div>

                    <Space size="middle" style={{ marginTop: '2rem' }}>
                        {!isLoggedIn ? (
                            <>
                                <Link to="/login">
                                    <Button
                                        type="primary"
                                        size="large"
                                        icon={<ArrowRightOutlined />}
                                        style={{
                                            padding: '0 3rem',
                                            boxShadow: '0 8px 24px rgba(22, 119, 255, 0.15)',
                                        }}
                                    >
                                        Get Started
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button size="large" style={{ padding: '0 3rem' }}>
                                        Register
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/learn">
                                    <Button
                                        type="primary"
                                        size="large"
                                        icon={<ThunderboltOutlined />}
                                        style={{
                                            padding: '0 3rem',
                                            boxShadow: '0 8px 24px rgba(22, 119, 255, 0.15)',
                                        }}
                                    >
                                        Learn Units
                                    </Button>
                                </Link>
                                <Link to="/review">
                                    <Button
                                        size="large"
                                        icon={<CalendarOutlined />}
                                        style={{ padding: '0 3rem' }}
                                    >
                                        Review
                                    </Button>
                                </Link>
                            </>
                        )}
                    </Space>
                </Space>
            </div>
        </Flex>
    );
};

export default Hero;
