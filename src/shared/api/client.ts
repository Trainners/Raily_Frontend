import { fetchBaseQuery } from "@reduxjs/toolkit/query";

// 모든 API 슬라이스(userApi, trainApi 등)가 공유하는 base query
// entities/user의 Redux 상태를 직접 참조하면 FSD 레이어 규칙(하위 레이어가 상위/동위 레이어를 모름)을 어기게 되므로
// Redux를 거치지 않고 localStorage에서 토큰을 직접 읽어서 헤더에 붙임
export const baseQuery = fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers) => {
        const accessToken = localStorage.getItem('accessToken')

        if (accessToken) {
            headers.set('Authorization', `Bearer ${accessToken}`)
        }

        return headers
    }
})