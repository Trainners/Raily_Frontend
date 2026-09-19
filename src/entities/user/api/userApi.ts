import {createApi} from "@reduxjs/toolkit/query/react";
import type { SignUpRequest, LoginRequest, LoginResponse, TokenReissueResponse } from "../model/types.ts";
import {baseQuery} from "../../../shared/api/client.ts";
import {sessionExpired, tokenReissued} from "../../../shared/api/authEvents.ts";
import {clearCredentials} from "../model/userSlice.ts";

//user api
export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery,
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            })
        }),
        // 회원가입
        signup: builder.mutation<number, SignUpRequest>({
            query: (body) => ({
                url: '/users/signup',
                method:'POST',
                body,
            })
        }),
        // 앱 새로고침 및 시작시 세션 복원을 위한 엔드포인트
        // 쿠키의 refreshToken으로 accessToken 재발급
        // 한번 찔러보고 실패시 (400/500 응답시) 비로그인으로 처리
        reissue: builder.mutation<TokenReissueResponse, void>({
            query: () => ({
                url: '/auth/reissue',
                method: 'POST',
            }),
            async onQueryStarted(_arg, {dispatch, queryFulfilled}){
                try {
                    const {data} = await queryFulfilled;
                    dispatch(tokenReissued(data.accessToken));
                } catch {
                    dispatch(sessionExpired());
                }
            },
        }),
        // 로그아웃 => 서버가 거부하더라도 로컬인증 상태는 반드시 비운다
        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            async onQueryStarted(_arg, {dispatch, queryFulfilled}){
                try {
                    await queryFulfilled;
                } catch {
                    // 무시: 쿠키/토큰이 이미 무효라도 로컬은 로그아웃 처리
                } finally {
                    dispatch(clearCredentials());
                }
            },
        }),
    })
});
// endpoint로부터 자동 생성된 훅 export
export const { useLoginMutation, useSignupMutation, useReissueMutation, useLogoutMutation } = userApi;