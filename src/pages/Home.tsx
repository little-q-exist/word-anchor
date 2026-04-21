import { Flex, ConfigProvider } from 'antd';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { useMemo } from 'react';
import Hero, { type HomeTitle } from '../modules/home/components/Hero';
import Feature from '../modules/home/components/Feature';

const HOME_TITLES: HomeTitle[] = [
    { main: 'Words', accent: 'Anchor', sub: 'Deep Roots, Stronger Memory.' },
    { main: 'Master', accent: 'English', sub: 'Your Journey to Fluency Starts with One Word.' },
    { main: 'Pure', accent: 'Learning', sub: 'Minimalist Approach to Vocabulary Mastery.' },
];

const Home = () => {
    const user = useSelector((state: RootState) => state.user);

    const title = useMemo(() => {
        return HOME_TITLES[Math.floor(Math.random() * HOME_TITLES.length)];
    }, []);

    return (
        <ConfigProvider
            theme={{
                token: {
                    borderRadius: 12,
                },
                components: {
                    Button: {
                        controlHeightLG: 56,
                        fontSizeLG: 18,
                    },
                },
            }}
        >
            <Flex
                vertical
                style={{
                    height: 'calc(100vh - 64px)',
                    background: '#ffffff',
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                {/* Background Decoration */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-10%',
                        right: '-5%',
                        width: '40vw',
                        height: '40vw',
                        background:
                            'radial-gradient(circle, rgba(22, 119, 255, 0.03) 0%, rgba(255, 255, 255, 0) 70%)',
                        borderRadius: '50%',
                        zIndex: 0,
                    }}
                />

                <Hero title={title} isLoggedIn={Boolean(user)} />
                <Feature isLoggedIn={Boolean(user)} />
            </Flex>
        </ConfigProvider>
    );
};

export default Home;
