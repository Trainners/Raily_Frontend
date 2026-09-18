import type { LoginResponse, User } from "./types.ts";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {sessionExpired, tokenReissued} from "../../../shared/api/authEvents.ts";

// restoring: 앱 시작 직후 reissue 응답을 기다리는 상태
export type AuthStatus = 'restoring' | 'authenticated' | 'anonymous';

export interface UserState {
    status: AuthStatus;
    accessToken: string | null;
    currentUser: User | null;
}

// 앱 시작 직후에 reissue 결과를 기다리는 상태로 초기화
const initialState: UserState = {
    status: 'restoring',
    accessToken: null,
    currentUser: null,
};

// 로그아웃/세션 만료 결과 상태. initialState가 나중에 'restoring'이 되므로 따로 설정
const anonymousState: UserState = {
    ...initialState,
    status: 'anonymous',
};
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // 로그인 성공시 토큰, 유저정보 저장
        setCredentials: (state, action: PayloadAction<LoginResponse>) => {
            const { accessToken, email, name } = action.payload;
            state.status = 'authenticated';
            state.accessToken = accessToken;
            state.currentUser = { email, name };
        },
        // 로그아웃 (인증 정보 초기화) — 사용자가 직접 로그아웃한 경우
        clearCredentials: () => anonymousState,
    },
    // shared에서 발행한 인증 이벤트에 반응
    extraReducers: (builder) => {
        builder
            .addCase(tokenReissued, (state, action) => {
                state.status = 'authenticated';
                state.accessToken = action.payload;
                // reissue 응답에 email/name이 없어 currentUser는 복원되지 않음 => 추후 백엔드에서 응답으로 내려주도록 해야함
            })
            .addCase(sessionExpired, () => anonymousState);
    },
});

export const { setCredentials, clearCredentials } = userSlice.actions;

type UserRootState = { user: UserState };

export const selectAccessToken = (state: UserRootState) => state.user.accessToken;
export const selectCurrentUser = (state: UserRootState) => state.user.currentUser;
export const selectAuthStatus = (state: UserRootState) => state.user.status;
// 인증 여부를 토큰 유무로 파싱하는 방식에서 status로 판단 하는 방법으로 변경 (restoring은 인증된 상태가 아니라 재인증을 받는 과정을 의미)
export const selectIsAuthenticated = (state: UserRootState) => state.user.status === 'authenticated';
