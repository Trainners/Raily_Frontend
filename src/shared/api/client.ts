import { fetchBaseQuery } from "@reduxjs/toolkit/query";

// type로 필요한 state모양만 구조적으로 선언하여 사용
// userSlice에 accessToken이 있다는 모양만 선언하는 것
type StateWithAuth = {user : {accessToken: string | null}};

const rawBaseQuery = fetchBaseQuery({
    baseUrl: '/api',
    // refresh 토큰 쿠키를 요청에 자동 첨부하기 위한 옵션.
    // 지금은 프록시(vite / vercel rewrite) 덕분에 같은 출처라 기본값(same-origin)과 동작이 같지만,
    // 나중에 백엔드를 직접 호출(다른 출처)하게 돼도 쿠키가 빠지지 않도록 명시함.
    credentials: 'include',

    prepareHeaders: (headers, {getState}) => {
        const token = (getState() as StateWithAuth).user.accessToken;
        if (token) headers.set('Authorization', `Bearer ${token}`);
        return headers;
    },
})

export const baseQuery = rawBaseQuery;