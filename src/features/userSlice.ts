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
        login: (state, action: PayloadAction<User | undefined>) => {
            if (action.payload) {
                state = action.payload;
            } else {
                const loggedUserJSON = localStorage.getItem('reciteWordAppUser');
                if (loggedUserJSON) {
                    state = JSON.parse(loggedUserJSON);
                }
            }
        },
        logout: (state) => {
            state._id = '';
            state.token = '';
            state.username = '';
        },
    },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
