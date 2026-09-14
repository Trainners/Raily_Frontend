import type { Seat } from "../../../entities/seat";

export type SeatMatrix = {
    trainNo: string;    // 좌석 매트릭스를 보여줄 열차 번호
    stops: string[];    // 정차역 목록
    seats: Seat[];      // 해당 열차의 전체 좌석 목록
}