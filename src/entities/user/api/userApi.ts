import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import type { SignUpRequest,LoginRequest, LoginResponse} from "../model/types.ts";

//user api
export const userApi = createApi({
    reducerPath: 'userApi',
    // 요청 base 엔드포인트
    baseQuery: fetchBaseQuery({ baseUrl: '/api'}),
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
                url: '/users/sigup',
                method:'POST',
                body,
            })
        })
    })
});
// endpoint로부터 자동 생성된 훅 export
export const { useLoginMutation } = userApi;