// 원래는 빈 파일이었는데 trainApi.ts 깨져서 인증 헤더 로직만 빼고 작성해둠
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const baseQuery = fetchBaseQuery({
    baseUrl: '/api'
})