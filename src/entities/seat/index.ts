export type { Seat, SeatState } from './model/types';
export { verdictOf, verdictText } from './model/verdict';
export type { Verdict } from './model/verdict';

export { default as SeatCell } from './ui/SeatCell';
export type { SeatCellProps } from './ui/SeatCell';

export { seatApi, useGetSeatsQuery } from './api';
export type { SeatMatrixData, SeatSearchParams } from './model/types';