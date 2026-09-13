export type SeatState = 'free' | 'sold' | 'mine';

export type Seat = {
    carNo: number;
    seatNo: string;
    states: SeatState[];
}