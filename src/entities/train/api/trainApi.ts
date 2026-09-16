import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../../../shared/api/client';
import type { Train, TrainApiResponse, TrainSearchParams } from '../model/types';

export const trainApi = createApi({
    reducerPath: 'trainApi',
    // 요청 base 엔드포인트
    baseQuery,
    endpoints: (builder) => ({
        getTrains: builder.query<Train[], TrainSearchParams>({
            query: (params) => ({
                url: '/trains',
                params
            }),
            // 백엔드 필드명이 프론트 Train 타입하고 달라서
            // 여기서 미리 변환해두면 이 밖의 코드는 백엔드 응답 모양을 몰라도 됨
            transformResponse: (response: TrainApiResponse[]): Train[] =>
                response.map((train) => ({
                    trainNo: train.trainNum,
                    trainName: train.trainTypeName,
                    departureTime: train.departureTime,
                    arrivalTime: train.arrivalTime
                }))
        })
    })
})

export const { useGetTrainsQuery } = trainApi;