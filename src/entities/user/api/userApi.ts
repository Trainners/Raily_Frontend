import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import type {LoginRequest, LoginResponse} from "../model/types.ts";

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
        })
    })
})