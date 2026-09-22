import type { Seat, SeatApiResponse } from './types';

// 백엔드 좌석 하나를 화면용 Seat으로 변환
// 좌석 매트릭스 응답에는 착석 정보가 없다 — 착석은 seat-watch 엔드포인트가 따로 관리한다
// 그래서 여기서는 free/sold만 만들고, mine은 화면에서 덧씌운다
export function toSeat(
    seat: SeatApiResponse,
): Seat {
    return {
        // 백엔드의 '0001' 같은 호차 번호를 화면 도메인의 number 타입으로 변환
        carNo: Number(seat.carNumber),
        seatNo: seat.seatNumber,
        states: seat.availabilityBySegment.map(
            (available) =>
                available ? 'free' : 'sold',
        ),
    };
}