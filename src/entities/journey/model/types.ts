import type {Train} from '../../train';

// 여정 검색 조건 (JourneyFrom이랑 동일)
export type JourneySearch = {
    from: string;
    to: string;
    // 화면 표시용 문자열
    date: string;
    // 'HH:mm'
    afterTime: string
};

// 탑승 이후 상태 (journeySlice에서 옮겨옴)
export type JourneyStatus = 'IDLE' | 'BOARDED' | 'SEATED' | 'EVICTED';

export type SeatedInfo = {
    // 서버 감시건 id. 폴링·취소에 필요. optional 로 두지 않는다(착석 = 감시 등록)
    seatWatchId: number;
    // 어느 열차에서 앉았는지. 다른 열차 화면에서 "내 자리"로 잘못 칠해지는 것을 막는다
    trainNo: string;
    carNo: number;
    seatNo: string;          // 기존 오타 seatNO → seatNo
    fromStation: string;
    // 다음 예약자가 타기 전까지 앉을 수 있는 역
    toStation: string;
}

export type {Train};