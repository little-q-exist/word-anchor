import { useEffect, useState } from 'react';

import wordServices from '../services/words';
import userServices from '../services/users';

import WordInfo from '../components/WordInfo';
import { Button } from 'antd';

import type { User, Word } from '../types';

const Learn = () => {
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
            const loggedInUser = JSON.parse(loggedUserJSON);
            setUser(loggedInUser);
        }
    }, []);

    const navigateToNextWord = () => {
        const nextIndex = (index + 1) % words.length;
        setIndex(nextIndex);
        setShouldShowInfo(false);
    };

    // TODO: update the familiarity of the word
    const handleLearn = (familiarity: number) => {
        if (!user) {
            console.error('user not logged in');
            return;
        }
        // get learn data.
        userServices.updateFamiliarity(user._id, wordToShow._id, familiarity);
        setShouldShowInfo(true);
    };

    if (words.length === 0) {
        return <div>No Words Avaliable!</div>;
    }
    return (
        <div style={{ height: '100%' }}>
            <WordInfo word={wordToShow} visible={shouldShowInfo} />

            {!shouldShowInfo && (
                <div>
                    <Button type="primary" onClick={() => handleLearn(5)}>
                        Known
                    </Button>
                    <Button type="primary" onClick={() => handleLearn(0)}>
                        Unknown
                    </Button>
                </div>
            )}
            {shouldShowInfo && <Button type="primary" onClick={navigateToNextWord} />}
        </div>
    );
};

export default Learn;
