import type { Word } from '../types';

interface CardInfoProps {
    word: Word;
    visible: boolean;
}

const CardInfo = ({ word, visible }: CardInfoProps) => {
    const showWhenVisible = { display: visible ? '' : 'none' };

    return (
        <div style={showWhenVisible}>
            {word.definitions.map((definition, index) => (
                <div key={index}>
                    <div>{definition.partOfSpeech}</div>
                    <div>{definition.meaning}</div>
                </div>
            ))}
        </div>
    );
};

export default CardInfo;
