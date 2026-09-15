import {configureStore} from "@reduxjs/toolkit";
import {userApi, userSlice} from "../../entities/user";
import {journeySlice} from "../../entities/journey/model/journeySlice.ts";

export const store = configureStore({
    // 리듀서
    reducer: {
        // 로그인 토큰, 유저 정보
        user: userSlice.reducer,
        // 열차 탑승 상태, 착석 상태 및 착석 좌석 정보
        journey: journeySlice.reducer,
        // RTK Query 전용 캐시/로딩 저장소 등록
        [userApi.reducerPath]: userApi.reducer,
    },

    //RTK Query 백그라운드 미들웨어 추가
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(userApi.middleware),
});

//
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;