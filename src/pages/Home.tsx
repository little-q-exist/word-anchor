import { Flex } from 'antd';
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
        <Flex
            vertical
            style={{
                height: '100%',
                background: 'transparent',
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: '-10%',
                    right: '-5%',
                    width: '40vw',
                    height: '40vw',
                    background:
                        'radial-gradient(circle, rgba(22, 119, 255, 0.05) 0%, rgba(255, 255, 255, 0) 70%)',
                    borderRadius: '50%',
                    zIndex: 0,
                }}
            />

            <Hero title={title} isLoggedIn={Boolean(user)} />
            <Feature isLoggedIn={Boolean(user)} />
        </Flex>
    );
};

export default Home;
