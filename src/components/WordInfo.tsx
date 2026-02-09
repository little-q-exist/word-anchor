import type { Word } from '../types';

interface WordInfoProps {
    word: Word;
    visible: boolean;
}

const WordInfo = ({ word, visible }: WordInfoProps) => {
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

export default WordInfo;
