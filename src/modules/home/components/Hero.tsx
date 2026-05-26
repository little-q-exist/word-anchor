import { Button, Flex, Space, Typography, theme } from 'antd';
import { CalendarOutlined, ThunderboltOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Link } from 'react-router';
import { shadows } from '@/shared/styles/shadowStyle';

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
    const { token } = theme.useToken();
    return (
        <Flex
            vertical
            align="center"
            justify="center"
            style={{
                flex: 1,
                zIndex: 1,
                padding: `0 ${token.paddingXXL}px`,
            }}
        >
            <div style={{ textAlign: 'center', maxWidth: 960 }}>
                <Space orientation="vertical" size={24} style={{ width: '100%' }}>
                    <div style={{ marginBottom: 8 }}>
                        <Title
                            level={1}
                            style={{
                                fontSize: 'clamp(3rem, 10vw, 5rem)',
                                margin: 0,
                                fontWeight: 700,
                                letterSpacing: '-0.02em',
                                lineHeight: 1.1,
                            }}
                        >
                            {title.main} <span style={{ color: token.colorPrimary }}>{title.accent}</span>
                        </Title>
                        <Title
                            level={2}
                            style={{
                                margin: '1.5rem 0 0',
                                fontWeight: 400,
                                color: token.colorTextSecondary,
                                fontSize: '1.5rem',
                                letterSpacing: '0.05em',
                            }}
                        >
                            {title.sub}
                        </Title>
                    </div>

                    <Space size="middle" style={{ marginTop: token.paddingXXL }}>
                        {!isLoggedIn ? (
                            <>
                                <Link to="/login">
                                    <Button
                                        type="primary"
                                        size="large"
                                        icon={<ArrowRightOutlined />}
                                        style={{
                                            padding: `0 ${token.paddingXXL}px`,
                                            boxShadow: shadows.primaryButton,
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
                                            padding: `0 ${token.paddingXXL}px`,
                                            boxShadow: shadows.primaryButton,
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
