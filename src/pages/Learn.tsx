import wordServices from '../services/words';

import type { Route } from './+types/Learn';

import type { WordWithLearnStatus } from '../types';
import LearnWord from '../components/LearnWord';

// eslint-disable-next-line react-refresh/only-export-components
export async function clientLoader() {
    const words = await wordServices.getWordToLearn();
    const wordsWithStatus: WordWithLearnStatus[] = words.map((word) => {
        return { ...word, status: 'idle' };
    });
    return { words: wordsWithStatus };
}

const Learn = ({ loaderData }: Route.ComponentProps) => {
    return (
        <>
            <LearnWord loadedWords={loaderData.words} />
        </>
    );
};

export default Learn;
