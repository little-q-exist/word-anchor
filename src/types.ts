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

export interface BriefWord {
    _id: string;
    english: string;
}

export interface BriefWordWithLearnStatus extends BriefWord {
    status: 'idle' | 'passed' | 'failed';
}

export interface BriefWordListWithMode {
    /**
     * List of brief word objects in the selected mode.
     */
    words: BriefWord[];
    /**
     * @deprecated Use `words` instead. This field contains full `BriefWord` objects,
     * not IDs. It is kept only for backward compatibility.
     */
    wordIds?: BriefWord[];
    mode: 'learn' | 'review';
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
