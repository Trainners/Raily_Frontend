import type {User} from "./types.ts";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

interface UserState {
    isAuthenticated: boolean;
    accessToken: string | null;
    currentUser: User | null;
}

const initialState: UserState = {
    isAuthenticated: false,
    accessToken: null,
    currentUser: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCredentials: (
            state,
                action: PayloadAction<{user: User; token: string }>
        )=> {
            state.isAuthenticated = true;
            state.currentUser = action.payload.user;
            state.accessToken = action.payload.token;
        },
        clearCredentials: (state) => {
            state.insAuthenticated = false;
            state.currentUser = null;
            state.accessToken = null;
        },
    },
});

export const { setCredentials, clearCredentials } = userSlice.actions;