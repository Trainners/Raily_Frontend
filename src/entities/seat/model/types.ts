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
    h_con_seat_no: '1A',
    h_sale_psb_flg: 'Y',
}
*/
export type SeatInfoApiResponse = {
    h_con_seat_no: string;
    h_sale_psb_flg: 'Y' | 'N';
}

/*
백엔드 호차 하나 응답

입력 예시:
{
    strResult: 'SUCC',
    seat_infos: {
        seat_info: [...]
    }
}
*/
export type CarSeatsApiResponse = {
    strResult: string;
    seat_infos: {
        seat_info: SeatInfoApiResponse[];
    }
}

/*
 백엔드 전체 좌석 응답

구간 -> 호차 -> 호차 응답
예: '천안-평택' -> '0001' -> CarSeatsApiResponse
*/
export type SeatsApiResponse = Record<
    string,
    Record<string, CarSeatsApiResponse>
>

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