import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../../../shared/api/client';
import type {
    NotificationItem,
    PushSubscribeRequest,
    PushUnsubscribeRequest,
    SeatWatchCreateResponse,
    SeatWatchRequest,
    SeatWatchStatusResponse,
    UnreadCountResponse,
    VapidKeyResponse,
} from '../model/types';

export const notificationApi = createApi({
    reducerPath: 'notificationApi',
    // 토큰 첨부 (우리 프로젝트 로그인 전략)
    baseQuery,
    tagTypes: ['Notifications', 'UnreadCount', 'SeatWatch'],
    endpoints: (builder) => ({
        // 푸시 구독
        getVapidPublicKey: builder.query<VapidKeyResponse, void>({
            query: () => '/push/vapid-public-key',
            // 공개키는 사실상 바뀌지 않으므로 1시간 캐시
            keepUnusedDataFor: 60 * 60,
        }),
        subscribePush: builder.mutation<void, PushSubscribeRequest>({
            query: (body) => ({ url: '/push/subscriptions', method: 'POST', body }),
        }),
        unsubscribePush: builder.mutation<void, PushUnsubscribeRequest>({
            query: (body) => ({ url: '/push/subscriptions', method: 'DELETE', body }),
        }),
        sendTestPush: builder.mutation<void, void>({
            query: () => ({ url: '/push/test', method: 'POST' }),
        }),

        // 좌석 감시
        createSeatWatch: builder.mutation<SeatWatchCreateResponse, SeatWatchRequest>({
            query: (body) => ({ url: '/notifications/seat-watch', method: 'POST', body }),
        }),
        getSeatWatch: builder.query<SeatWatchStatusResponse, number>({
            query: (id) => `/notifications/seat-watch/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'SeatWatch', id }],
        }),
        cancelSeatWatch: builder.mutation<void, number>({
            query: (id) => ({ url: `/notifications/seat-watch/${id}`, method: 'DELETE' }),
            invalidatesTags: (_result, _error, id) => [{ type: 'SeatWatch', id }],
        }),

        // 알림함
        getNotifications: builder.query<NotificationItem[], void>({
            query: () => '/notifications',
            providesTags: ['Notifications'],
        }),
        getUnreadCount: builder.query<UnreadCountResponse, void>({
            query: () => '/notifications/unread-count',
            providesTags: ['UnreadCount'],
        }),
        markAsRead: builder.mutation<void, number>({
            query: (id) => ({ url: `/notifications/${id}/read`, method: 'PATCH' }),
            // 읽음 처리하면 목록의 read 플래그와 배지 숫자가 모두 바뀌므로 둘 다 무효화
            invalidatesTags: ['Notifications', 'UnreadCount'],
        }),
    }),
});

export const {
    useGetVapidPublicKeyQuery,
    useLazyGetVapidPublicKeyQuery,
    useSubscribePushMutation,
    useUnsubscribePushMutation,
    useSendTestPushMutation,
    useCreateSeatWatchMutation,
    useGetSeatWatchQuery,
    useCancelSeatWatchMutation,
    useGetNotificationsQuery,
    useGetUnreadCountQuery,
    useMarkAsReadMutation,
} = notificationApi;