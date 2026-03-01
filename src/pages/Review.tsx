import LearnWord from '../components/Words/LearnWord';
import wordServices from '../services/words';
import type { WordWithLearnStatus } from '../types';
import type { Route } from './+types/Review';

// eslint-disable-next-line react-refresh/only-export-components
export async function clientLoader() {
    const words = await wordServices.getWordToReview();
    const wordsWithStatus: WordWithLearnStatus[] = words.map((word) => {
        return { ...word, status: 'idle' };
    });
    return { words: wordsWithStatus };
}

const Review = ({ loaderData }: Route.ComponentProps) => {
    return (
        <>
            <LearnWord loadedWords={loaderData.words} />
        </>
    );
};

export default Review;
