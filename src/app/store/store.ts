import {configureStore} from "@reduxjs/toolkit";
import {userSlice} from "../../entities/user/model/userSlice.ts";
import {journeySlice} from "../../entities/journey/model/journeySlice.ts";

export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        journey: journeySlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;