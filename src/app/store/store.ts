import { configureStore } from "@reduxjs/toolkit";
import {setupListeners} from "@reduxjs/toolkit/query";
import { userApi, userSlice } from "../../entities/user";
import { journeySlice } from "../../entities/journey";
import { trainApi } from "../../entities/train";
import { seatApi } from "../../entities/seat";
import { notificationApi } from "../../entities/notification";

export const store = configureStore({
    // 리듀서
    reducer: {
        // 로그인 토큰, 유저 정보
        // prepareHeaders가 이 'user' 키 이름에 의존
        user: userSlice.reducer,
        // 열차 탑승 상태, 착석 상태 및 착석 좌석 정보
        journey: journeySlice.reducer,
        // RTK Query 전용 캐시/로딩 저장소 등록
        [userApi.reducerPath]: userApi.reducer,
        [trainApi.reducerPath]: trainApi.reducer,
        [seatApi.reducerPath]: seatApi.reducer,
        [notificationApi.reducerPath]: notificationApi.reducer,
    },

    //RTK Query 백그라운드 미들웨어 추가
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            userApi.middleware,
            trainApi.middleware,
            seatApi.middleware,
            notificationApi.middleware
        ),
    //운영 환경에서는 Redux DevTool를 통해 store에 접근할 수 없도록 연결을 끊음(보안상 토큰 탈취를 막기 위함)
    devTools: import.meta.env.DEV,
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
