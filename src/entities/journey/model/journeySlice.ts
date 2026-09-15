import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// 탑승 이후 상태관리 탑승전/탑승/착석/앉아 있는데 판매 알림 온경우
export type JourneyStatus = 'IDLE' | 'BOARDED' | 'SEATED' | 'EVICTED';

interface SeatedInfo {
    carNo: number;
    seatNo: string;
    fromStation: string;
    // 다음 예약자가 타기 전까지 앉을 수 있는 역
    toStation: string;
}

interface JourneyState {
    status: JourneyStatus;
    trainNo: string | null;
    seatInfo: SeatedInfo | null;
    alertMessage: string | null;
}

const initialState: JourneyState = {
    status: 'IDLE',
    trainNo: null,
    seatInfo: null,
    alertMessage: null,
};

export const journeySlice = createSlice({
    name: 'journey',
    initialState,
    reducers: {
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
    boardTrain,
    takeSeat,
    notifySeatEviction,
    releaseSeat,
    finishJourney,
} = journeySlice.actions;