/*
좌석 상태
- free: 빈 좌석
- sold: 이미 판매된 좌석
- mine: 내가 착석한 좌석
*/
export type SeatState = 'free' | 'sold' | 'mine';

export type Seat = {
    carNo: number;
    seatNo: string;
    states: SeatState[];    // 정차역 구간별 상태, 좌석 하나의 상태가 구간마다 다를 수 있어서 배열로 관리
}

/*
백엔드 좌석 하나 응답

입력 예시:
{
    carNumber: '0001',
    seatNumber: '1A',
    availabilityBySegment: [true, false, true]
}
*/
export type SeatApiResponse = {
    carNumber: string;
    seatNumber: string;
    availabilityBySegment: boolean[];
}

/*
백엔드 전체 좌석 응답

입력 예시:
{
    stops: ['천안', '평택', '수원', '영등포'],
    seats: [...]
}
*/
export type SeatsApiResponse = {
    stops: string[];
    seats: SeatApiResponse[];
}

/*
좌석 조회 요청 파라미터
*/
export type SeatSearchParams = {
    departureStation: string;
    arrivalStation: string;
    date: string;
    time: string;
    trainNum: string;
}

/*
SeatsApiResponse를 변환한 결과로 화면(useGetSeatsQuery)이 받는 데이터
*/
export type SeatMatrixData = {
    stops: string[];
    seats: Seat[];
}