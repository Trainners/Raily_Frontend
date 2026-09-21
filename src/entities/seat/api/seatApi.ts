import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../../shared/api/client";
import type { SeatMatrixData, SeatSearchParams, SeatsApiResponse } from "../model/types";
import { toSeat } from "../model/transformSeats";

// 열차 한 편의 구간별 좌석 현황 조회
// 전체 여정의 출발역/도착역으로 한 번만 호출하면 백엔드가 정차역과 전체 구간의 좌석 정보를 함께 반환
export const seatApi = createApi({
    reducerPath: 'seatApi',
    baseQuery,

    endpoints: (builder) => ({
        getSeats: builder.query<
            SeatMatrixData,
            SeatSearchParams
        >({
            query: (params) => ({
                url: '/trains/seats',
                params,
            }),

            // 백엔드 응답을 화면에서 사용하는 SeatMatrixData로 변환
            transformResponse: (
                response: SeatsApiResponse,
            ): SeatMatrixData => {
                const seats = response.seats.map(toSeat)

                return {
                    stops: response.stops,
                    seats,
                }
            }
        })
    })
})

export const { useGetSeatsQuery } = seatApi;