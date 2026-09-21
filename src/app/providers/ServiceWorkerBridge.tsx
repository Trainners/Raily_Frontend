import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks.ts";
import { notificationApi } from "../../entities/notification";
import { registerServiceWorker } from "../../shared/lib/push.ts";
import { toSafeInternalPath } from "../../shared/lib/safePath.ts";
import { ROUTES } from "../../shared/config/routes.ts";

// sw.js 의 notificationclick 핸들러가 보내는 메시지 모양
type SwMessage = { type: 'NAVIGATE'; url: string };

export function ServiceWorkerBridge() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        // 구형 브라우저나 http 환경에서는 serviceWorker 자체가 없을 수 있으므로
        if (!('serviceWorker' in navigator)) return;

        void registerServiceWorker();

        const handleMessage = (event: MessageEvent<SwMessage>) => {
            if (event.data?.type !== 'NAVIGATE') return;
            // 알림을 눌렀다는 것은 새 알림이 생겼다는 뜻 이므로 목록과 배지를 다시 받게 한다
            dispatch(notificationApi.util.invalidateTags(['Notifications', 'UnreadCount']));
            // payload 에서 온 값이므로 내부 경로인지 확인하고 이동한다
            navigate(toSafeInternalPath(event.data.url, ROUTES.JOURNEY_SETUP));
        };

        navigator.serviceWorker.addEventListener('message', handleMessage);
        return () => navigator.serviceWorker.removeEventListener('message', handleMessage);
    }, [navigate, dispatch]);

    return null;
}