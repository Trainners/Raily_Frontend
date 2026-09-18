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
    carNo: number;
    seatNO: string;
    fromStation: string;
    toStation: string;
}

export type {Train};