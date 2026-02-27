import WordCard from '../../components/WordCard';
import type { Route } from './+types/WordInfo';

import wordService from '../../services/words';

import WordSideButtonGroup from '../../components/WordSideButtonGroup';

// eslint-disable-next-line react-refresh/only-export-components
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    const english = params.english;
    const words = await wordService.getBy({ english });
    const word = words[0];
    return { word };
}

const WordInfo = ({ loaderData }: Route.ComponentProps) => {
    const word = loaderData.word;

    return (
        <>
            <div style={{ height: '100%' }}>
                <WordCard word={word} visible={true} />
                <WordSideButtonGroup wordId={word._id} />
            </div>
        </>
    );
};

export default WordInfo;
