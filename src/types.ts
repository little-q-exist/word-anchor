interface Definition {
    meaning: string;
    partOfSpeech: string;
}

export interface NewWord {
    definitions: Definition[];
    english: string;
    exampleSentence: string[];
    phonetic: string;
    related: string[];
    tags: string[];
}

export interface Word {
    definitions: Definition[];
    english: string;
    exampleSentence: string[];
    phonetic: string;
    related: string[];
    tags: string[];
    _id: string;
    createdBy: string;
}

export interface WordWithLearnStatus extends Word {
    status: 'idle' | 'passed' | 'failed';
}

export interface UserLearningData {
    userId: string;
    wordId: string;
    easeFactor: number;
    lastLearned: string;
    interval: number;
    dueDate: string;
    repetition: number;
    favorited: boolean;
}
export interface NewUser {
    username: string;
    email?: string;
    password: string;
}

export interface User {
    token: string;
    username: string;
    _id: string;
}

export interface UserStats {
    todayCount: number;
    totalCount: number;
}
