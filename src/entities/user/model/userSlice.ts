import type { LoginResponse, User } from "./types.ts";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

export interface UserState {
    accessToken: string | null;
    currentUser: User | null;
}

const initialState: UserState = {
    accessToken: null,
    currentUser: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // 로그인 성공시 토큰, 유저정보 저장
        setCredentials: (state, action: PayloadAction<LoginResponse>) => {
            const { accessToken, email, name } = action.payload;
            state.accessToken = accessToken;
            state.currentUser = { email, name };

            // shared/api/client.ts가 요청 헤더 붙일 때 여기서 읽어감
            localStorage.setItem('accessToken', accessToken);
        },
        // 로그아웃 (인증 정보 초기화)
        clearCredentials: () => {
            // 로그아웃 후에도 요청에 이전 토큰이 계속 붙지 않도록 같이 제거
            localStorage.removeItem('accessToken');

            return initialState;
        }
    },
});

export const { setCredentials, clearCredentials } = userSlice.actions;

type UserRootState = { user: UserState };

export const selectAccessToken = (state: UserRootState) => state.user.accessToken;
export const selectCurrentUser = (state: UserRootState) => state.user.currentUser;
// 인증 여부 상태는 토큰 유무로 파생
export const selectIsAuthenticated = (state: UserRootState) => state.user.accessToken !== null;
