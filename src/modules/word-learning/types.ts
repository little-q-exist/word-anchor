export interface BriefWord {
    _id: string;
    english: string;
}

export interface BriefWordWithLearnStatus extends BriefWord {
    status: 'idle' | 'passed' | 'failed';
}

export interface QueueSnapshot {
    index: number;
    isRepeating: boolean;
    repeatQueue: number[];
    version: string;
}

export type LearningMode = 'learn' | 'review';

export interface LearningSession {
    _id: string;
    userId: string;
    mode: LearningMode;
    words: BriefWordWithLearnStatus[];
    queueSnapshot: QueueSnapshot;
    version: number;
    updatedByDevice?: string;
    createdAt: string;
    updatedAt: string;
}

export interface BriefWordListWithMode {
    words: BriefWord[];
    mode: 'learn' | 'review';
    count: number;
}
