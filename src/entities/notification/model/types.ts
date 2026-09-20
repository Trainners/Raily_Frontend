// 백엔드 DTO 와 같은 스키마로
export type SeatWatchStatus = 'ACTIVE' | 'NOTIFIED' | 'EXPIRED' | 'CANCELED';

// POST /api/notifications/seat-watch 요청
export interface SeatWatchRequest {
    trainNumber: string;   // "1122" — 열차 목록 응답의 trainNum 그대로
    carNumber: string;     // "0003" — 좌석 조회 응답의 호차 키 그대로
    seatNumber: string;    // "7A"
    runDate: string;       // "20260929" (yyyyMMdd, 숫자 8자리)
    fromStation: string;   // 착석한 역 (한글 역명)
    toStation: string;     // 하차역
    departureTime: string; // "070100" (HHmmss, 숫자 6자리)
    arrivalTime: string;   // "080300"
}

// 백엔드 SeatWatchCreateResponse
export interface SeatWatchCreateResponse {
    id: number;
    status: SeatWatchStatus;
}

// GET /api/notifications/seat-watch/{id} 응답
export interface SeatWatchStatusResponse {
    id: number;
    trainNumber: string;
    carNumber: string;
    seatNumber: string;
    fromStation: string;
    toStation: string;
    status: SeatWatchStatus;
    soldFromStation: string | null; // 판매가 감지된 역 (미감지 시 null)
    notifiedAt: string | null;      // "2026-09-29T07:20:11" (미감지 시 null)
}

// 백엔드 PushSubscribeRequest / PushUnsubscribeRequest / VapidKeyResponse
export interface PushSubscribeRequest {
    endpoint: string;
    keys: { p256dh: string; auth: string };
}
export interface PushUnsubscribeRequest {
    endpoint: string;
}
export interface VapidKeyResponse {
    publicKey: string;
}

// 백엔드 NotificationResponse
export type NotificationType = 'SEAT_SOLD';
export interface NotificationItem {
    id: number;
    type: NotificationType;
    title: string;
    body: string;
    linkUrl: string;
    read: boolean;
    createdAt: string;     // "2026-09-29T07:20:11" (LocalDateTime 직렬화 결과)
}

// 백엔드 UnreadCountResponse
export interface UnreadCountResponse {
    count: number;
}