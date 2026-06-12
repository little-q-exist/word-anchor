import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { User } from '@modules/auth/types';

type SliceStateType = User | null;

export const userSlice = createSlice({
    name: 'user',
    initialState: null satisfies SliceStateType as SliceStateType,
    reducers: {
        login: (_state, action: PayloadAction<User | null>) => {
            return action.payload;
        },
        logout: () => {
            return null;
        },
    },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
