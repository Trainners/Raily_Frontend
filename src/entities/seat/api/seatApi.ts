import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../../shared/api/client";
import type { SeatMatrixData, SeatSearchParams, SeatsApiResponse } from "../model/types";
import { resolveStops, toSeats } from "../model/transformSeats";

// 열차 한 편의 구간별 좌석 현황 조회
// 전체 여정의 출발역/도착역으로 한 번만 호출하면 중간 구간이 모두 한 응답에 담겨 옴
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

            // 백엔드 응답은 구간 -> 호차 -> 좌석으로 중첩된 형태라
            // 여기서 화면이 쓰는 stops/seats로 변환해두면 이 밖의 코드는 응답 모양을 몰라도 됨
            transformResponse: (
                response: SeatsApiResponse,
                _meta,
                arg: SeatSearchParams,
            ): SeatMatrixData => {
                const segmentKeys = Object.keys(response)

                // 응답에는 구간 키만 있고 어디가 출발역인지 없어서
                // 요청에 쓴 파라미터(arg)에서 가져옴
                const stops = resolveStops(
                    segmentKeys,
                    arg.departureStation,
                )

                const seats = toSeats(response, stops)

                return {
                    stops,
                    seats,
                }
            }
        })
    })
})

export const { useGetSeatsQuery } = seatApi;