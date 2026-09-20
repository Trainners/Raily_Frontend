const SW_URL = '/sw.js';

// Push 를 쓸 수 있는 브라우저인지확인 (구형 브라우저, http 환경, iOS Safari 탭 등에서 false)
export function isPushSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

export function isIos(): boolean {
    const ua = navigator.userAgent;
    return /iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
}

// 홈 화면에 추가된 앱(주소창 없는 단독 창)으로 실행 중인지
export function isStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches
        || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

// iOS 인데 아직 홈 화면에 추가하지 않은 상태확인(구독이 불가능하므로 안내문구를 추후에 보여주기 위함)
export function isIosNotInstalled(): boolean {
    return isIos() && !isStandalone();
}

// SW 등록. 이미 등록돼 있으면 브라우저가 같은 registration 을 반환
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) return null;
    try {
        return await navigator.serviceWorker.register(SW_URL, { scope: '/' });
    } catch (error) {
        console.error('Service Worker 등록 실패', error);
        return null;
    }
}

export function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const raw = window.atob(base64);
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i += 1) {
        bytes[i] = raw.charCodeAt(i);
    }
    return bytes;
}

// 알림 권한 요청. 반드시 사용자의 클릭 핸들러 안에서, 다른 await 보다 먼저 호출한다
export async function requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) return 'denied';

    if (Notification.permission !== 'default') return Notification.permission;
    return Notification.requestPermission();
}

// 백엔드 PushSubscribeRequest 와 같은 스키마로 맞춤
export type PushSubscriptionJson = {
    endpoint: string;
    keys: { p256dh: string; auth: string };
};

// 구독 생성: 권한이 granted 이고 SW 가 등록된 뒤에 호출한다
export async function subscribeToPush(vapidPublicKey: string): Promise<PushSubscriptionJson> {
    // SW 가 activate 될 때까지 대기
    const registration = await navigator.serviceWorker.ready;
    const existing = await registration.pushManager.getSubscription();
    const subscription = existing ?? await registration.pushManager.subscribe({
        // Chrome 대응(푸시마다 반드시 알림을 띄우겠다는 약속)
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });
    const json = subscription.toJSON();
    if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
        throw new Error('INVALID_SUBSCRIPTION');
    }
    return { endpoint: json.endpoint, keys: { p256dh: json.keys.p256dh, auth: json.keys.auth } };
}

// 현재 기기 구독 조회 (설정 화면에서 "켜짐/꺼짐" 표시용)
export async function getCurrentSubscription(): Promise<PushSubscription | null> {
    if (!isPushSupported()) return null;
    const registration = await navigator.serviceWorker.getRegistration();
    return registration ? registration.pushManager.getSubscription() : null;
}

// 브라우저 쪽 구독 해제 서버 쪽 삭제(DELETE /api/push/subscriptions)는 호출자가 따로 수행
export async function unsubscribeFromPush(): Promise<string | null> {
    const subscription = await getCurrentSubscription();
    if (!subscription) return null;
    const endpoint = subscription.endpoint;
    await subscription.unsubscribe();
    return endpoint;
}