import {createApi} from "@reduxjs/toolkit/query/react";
import type { SignUpRequest,LoginRequest, LoginResponse} from "../model/types.ts";
import {baseQuery} from "../../../shared/api/client.ts";

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
        })
    })
});
// endpoint로부터 자동 생성된 훅 export
export const { useLoginMutation, useSignupMutation } = userApi;