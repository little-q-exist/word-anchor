import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { User } from '@modules/auth/types';
import { removeAccessToken, setAccessToken } from '@/shared/services/tokenStore';

type SliceStateType = User | null;

export const userSlice = createSlice({
    name: 'user',
    initialState: null satisfies SliceStateType as SliceStateType,
    reducers: {
        login: (_state, action: PayloadAction<User>) => {
            setAccessToken(action.payload.accessToken);
            return action.payload;
        },
        logout: () => {
            removeAccessToken();
            return null;
        },
    },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
