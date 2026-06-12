import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { User } from '@modules/auth/types';
import { removeAccessTokenUser, setAccessTokenUser } from '@/shared/services/tokenStore';

type SliceStateType = User | null;

export const userSlice = createSlice({
    name: 'user',
    initialState: null satisfies SliceStateType as SliceStateType,
    reducers: {
        initialize: (_state, action: PayloadAction<User | null>) => {
            if (action.payload === null) {
                return null;
            }
            return action.payload;
        },
        login: (_state, action: PayloadAction<User>) => {
            setAccessTokenUser(JSON.stringify(action.payload));
            return action.payload;
        },
        logout: () => {
            removeAccessTokenUser();
            return null;
        },
    },
});

export const { login, logout, initialize } = userSlice.actions;

export default userSlice.reducer;
