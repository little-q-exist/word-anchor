import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type LearnWordStatus =
    | 'fetchingSession'
    | 'fetchingBriefWords'
    | 'initLearnQueue'
    | 'fetchingDetailedWord'
    | 'ready'
    | 'error';

interface ToNextStepPayload {
    hasSession?: boolean;
}

const initialState: LearnWordStatus = 'fetchingSession' as LearnWordStatus;

export const LearnWordSlice = createSlice({
    name: 'learnWord',
    initialState,
    reducers: {
        toNextStep: (state, action: PayloadAction<ToNextStepPayload | undefined>) => {
            switch (state) {
                case 'fetchingSession': {
                    if (action.payload?.hasSession === true) {
                        return 'fetchingDetailedWord';
                    } else if (action.payload?.hasSession === false) {
                        return 'fetchingBriefWords';
                    } else {
                        return 'error';
                    }
                }
                case 'fetchingBriefWords': {
                    return 'initLearnQueue';
                }
                case 'initLearnQueue': {
                    return 'fetchingDetailedWord';
                }
                case 'fetchingDetailedWord': {
                    return 'ready';
                }
                case 'ready':
                case 'error': {
                    break;
                }
            }
        },
    },
});

export const { toNextStep } = LearnWordSlice.actions;

export default LearnWordSlice.reducer;
