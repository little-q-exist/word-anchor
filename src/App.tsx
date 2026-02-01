import { useEffect, useState } from 'react';

import wordServices from './services/words';

import Card from './components/Card';
import Button from './components/Button';

import type { User, Word } from './types';

const App = () => {
    const [index, setIndex] = useState(0);
    const [words, setWords] = useState<Word[]>([]);
    const [shouldShowInfo, setShouldShowInfo] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const wordToShow = words[index];

    useEffect(() => {
        wordServices.getALL().then((words) => {
            setWords(words);
        });
    }, []);

    useEffect(() => {
        const loggedUserJSON = localStorage.getItem('loggedReciteAppUser');
        if (loggedUserJSON) {
            const loggedInUser = JSON.parse(loggedUserJSON)
            setUser(loggedInUser)
        }
    }, [])

    const navigateToNextWord = () => {
        const nextIndex = (index + 1) % words.length;
        setIndex(nextIndex);
        setShouldShowInfo(false);
    };

    const handleKnown = async () => {
        // TODO: update the familiarity of the word, find familiarity in userLearningData
        const learningData = user?.userLearningData.find(data => data.wordId === wordToShow._id)


        setShouldShowInfo(true);
    };

    const handleUnknown = async () => {
        const word = words[index];
        const mastered = false;
        const updatedWord = { ...word, familiarity: 0, mastered };
        const newWord = await wordServices.update(updatedWord);
        setWords(words.map((word) => (word.english === newWord.english ? newWord : word)));
        setShouldShowInfo(true);
    };

    return (
        <div>
            <div>Recite Word App</div>

            <Card word={words[index]} visible={shouldShowInfo} />

            {!shouldShowInfo && (
                <div>
                    <Button label={'Known'} onClick={handleKnown} />
                    <Button label={'Unknown'} onClick={handleUnknown} />
                </div>
            )}
            {shouldShowInfo && <Button label={'Next'} onClick={navigateToNextWord} />}
        </div>
    );
};

export default App;
