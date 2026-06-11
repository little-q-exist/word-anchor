import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { decode } from 'jsonwebtoken';

import type { User } from '@modules/auth/types';
import { removeAccessToken, setAccessToken } from '@/shared/services/tokenStore';

type SliceStateType = User | null;

export const userSlice = createSlice({
    name: 'user',
    initialState: null satisfies SliceStateType as SliceStateType,
    reducers: {
        initialize: (_state, action: PayloadAction<string | null>) => {
            if (action.payload === null) {
                return null;
            }
            const decodedUser = decode(action.payload);
            return decodedUser as User;
        },
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

export const { login, logout, initialize } = userSlice.actions;

export default userSlice.reducer;
