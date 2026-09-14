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