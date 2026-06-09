import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: { initialized: false },
    reducers: {
        setInitialized: () => {
            return { initialized: true };
        },
    },
});
