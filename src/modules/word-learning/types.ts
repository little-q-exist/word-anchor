export interface BriefWord {
    _id: string;
    english: string;
}

export interface BriefWordWithLearnStatus extends BriefWord {
    status: 'idle' | 'passed' | 'failed';
}

export interface LearnQueueSnapshot {
    index: number;
    isRepeating: boolean;
    repeatQueue: number[];
    updatedAt: number;
}

export type LearningMode = 'learn' | 'review';

export interface LearningSession {
    _id: string;
    userId: string;
    mode: LearningMode;
    words: BriefWordWithLearnStatus[];
    queueSnapshot: LearnQueueSnapshot;
    version: number;
    updatedByDevice?: string;
    createdAt: string;
    updatedAt: string;
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
