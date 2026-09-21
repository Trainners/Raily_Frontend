import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {JourneySearch, JourneyStatus, SeatedInfo, Train} from "./types.ts";

interface JourneyState {
    // 탑승 이전: 검색 조건 -> 선택 열차 순으로 채워짐
    search: JourneySearch | null;
    selectedTrain: Train | null;
    // 탑승 이후
    status: JourneyStatus;
    trainNo: string | null;
    seatInfo: SeatedInfo | null;
    alertMessage: string | null;
}

const initialState: JourneyState = {
    search: null,
    selectedTrain: null,
    status: 'IDLE',
    trainNo: null,
    seatInfo: null,
    alertMessage: null,
};

export const journeySlice = createSlice({
    name: 'journey',
    initialState,
    reducers: {
        // 여정 검색 폼 제출
        // 새 검색이면 이전에 고른 열차는 무효처리
        setSearch: (state, action: PayloadAction<JourneySearch>) => {
            state.search = action.payload;
            state.selectedTrain = null;
        },
        // 열차 목록에서 하나 선택
        selectTrain: (state, action: PayloadAction<Train>) => {
            state.selectedTrain = action.payload;
        },
        // 열차 탑승 (입석 시작)
        boardTrain: (state, action: PayloadAction<{ trainNo: string }>) => {
            state.status = 'BOARDED';
            state.trainNo = action.payload.trainNo;
        },
        // 좌석 착석
        takeSeat: (state, action: PayloadAction<SeatedInfo>) => {
            state.status = 'SEATED';
            state.seatInfo = action.payload;
            state.alertMessage = null;
        },
        // 다음 역에서 좌석 판매 감지 (자리 비움 경고)
        notifySeatEviction: (state, action: PayloadAction<{ station: string }>) => {
            state.status = 'EVICTED';
            state.alertMessage = `${action.payload.station}역부터 좌석이 판매되었습니다. 이동해 주세요.`;
        },
        // 좌석에서 일어남
        releaseSeat: (state) => {
            state.status = 'BOARDED';
            state.seatInfo = null;
            state.alertMessage = null;
        },
        // 여정 종료 (하차)
        finishJourney: () => initialState,
    },
});

export const {
    setSearch,
    selectTrain,
    boardTrain,
    takeSeat,
    notifySeatEviction,
    releaseSeat,
    finishJourney,
} = journeySlice.actions;

// selector 필요한 state 모양만 선언
type JourneyRootState = { journey: JourneyState };

export const selectJourneySearch = (state: JourneyRootState) => state.journey.search;
export const selectSelectedTrain = (state: JourneyRootState) => state.journey.selectedTrain;
export const selectJourneyStatus = (state: JourneyRootState) => state.journey.status;
// "내 여정" 탭 활성 조건: 열차까지 골라야 여정이 있는 것으로 본다
export const selectHasJourney = (state: JourneyRootState) => state.journey.selectedTrain !== null;
// 착석 정보 / 서버 감시건 id / 판매 감지 문구
export const selectSeatInfo = (state: JourneyRootState) => state.journey.seatInfo;
export const selectSeatWatchId = (state: JourneyRootState) => state.journey.seatInfo?.seatWatchId ?? null;
export const selectAlertMessage = (state: JourneyRootState) => state.journey.alertMessage;