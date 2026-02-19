import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { User } from '../types';

const initialState: User = {
    token: '',
    username: '',
    _id: '',
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state._id = action.payload._id;
            state.token = action.payload.token;
            state.username = action.payload.username;
        },
    },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
