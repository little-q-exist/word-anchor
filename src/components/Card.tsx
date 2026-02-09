import WordInfo from './WordInfo';

import type { Word } from '../types';

interface CardProps {
    word: Word;
    visible: boolean;
}

const Card = ({ word, visible }: CardProps) => {
    if (!word) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div>{word.english}</div>
            <div>{word.phonetic}</div>
            <WordInfo word={word} visible={visible} />
        </div>
    );
};

export default Card;
