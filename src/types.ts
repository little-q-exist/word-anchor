interface Definition {
    meaning: string;
    partOfSpeech: string;
}

export interface Word {
    definitions: Definition[];
    english: string;
    exampleSentence: string[];
    phonetic: string;
    related: string[];
    tags: string[];
    _id: string;
}

export interface UserLearningData {
    familiarity: 0 | 1 | 2 | 3;
    mastered: boolean;

    favorited: boolean;

    wordId: string;
}

export interface NewUser {
    username: string;
    email?: string;
    password: string;
}

export interface User {
    username: string;
    email?: string;
    passwordHash: string;
    userLearningData: UserLearningData[];
    isAdmin: boolean;
}
