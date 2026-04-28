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
                        state = 'fetchingDetailedWord';
                    } else if (action.payload?.hasSession === false) {
                        state = 'fetchingBriefWords';
                    } else {
                        state = 'error';
                    }
                    break;
                }
                case 'fetchingBriefWords': {
                    state = 'initLearnQueue';
                    break;
                }
                case 'initLearnQueue': {
                    state = 'fetchingDetailedWord';
                    break;
                }
                case 'fetchingDetailedWord': {
                    state = 'ready';
                    break;
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
