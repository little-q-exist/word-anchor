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
