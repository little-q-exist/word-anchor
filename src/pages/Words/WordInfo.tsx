import WordCard from '../../components/WordCard';
import type { Route } from './+types/WordInfo';

import wordService from '../../services/words';
import { FloatButton } from 'antd';
import { useNavigate } from 'react-router';

// eslint-disable-next-line react-refresh/only-export-components
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    const english = params.english;
    const words = await wordService.getBy({ english });
    const word = words[0];
    return { word };
}

const WordInfo = ({ loaderData }: Route.ComponentProps) => {
    const word = loaderData.word;
    const navigate = useNavigate();

    return (
        <div style={{ height: '100%' }}>
            <WordCard word={word} visible={true} />
            <FloatButton onClick={() => navigate('..', { relative: 'path' })} />
        </div>
    );
};

export default WordInfo;
