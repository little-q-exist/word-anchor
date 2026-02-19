import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { User } from '../types';

type SliceStateType = User | null;

export const userSlice = createSlice({
    name: 'user',
    initialState: null satisfies SliceStateType as SliceStateType,
    reducers: {
        login: (_state, action: PayloadAction<User | undefined>) => {
            if (action.payload) {
                return action.payload;
            } else {
                const loggedUserJSON = localStorage.getItem('reciteWordAppUser');
                if (loggedUserJSON) {
                    return JSON.parse(loggedUserJSON);
                }
            }
        },
        logout: () => {
            localStorage.removeItem('reciteWordAppUser');
            return null;
        },
    },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
