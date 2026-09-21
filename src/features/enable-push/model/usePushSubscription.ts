import { useCallback, useEffect, useState } from 'react';
import {
    useLazyGetVapidPublicKeyQuery,
    useSubscribePushMutation,
    useUnsubscribePushMutation,
} from '../../../entities/notification';
import {
    getCurrentSubscription,
    isIosNotInstalled,
    isPushSupported,
    registerServiceWorker,
    requestNotificationPermission,
    subscribeToPush,
    unsubscribeFromPush,
} from '../../../shared/lib/push';

// 화면이 알아야 할 상태로 버튼/문구를 분기
export type PushState =
    // 브라우저가 Push 미지원
    | 'unsupported'
    // iOS 인데 홈 화면 추가 전 -> 설치 안내
    | 'ios-not-installed'
    // 권한 거부됨 (브라우저/기기 설정에서만 되돌릴 수 있음)
    | 'denied'
    // 이 기기에 구독이 있는지 확인 중
    | 'checking'
    // 켤 수 있음
    | 'off'
    // 이 기기 구독 완료
    | 'on'
    // 켜기/끄기 처리 중
    | 'working';

// 비동기 확인 없이 바로 알 수 있는 상태는 첫 렌더에서 결정 (iOS 미설치를 미지원보다 먼저 확인)
function getInitialState(): PushState {
    if (isIosNotInstalled()) return 'ios-not-installed';
    if (!isPushSupported()) return 'unsupported';
    if (Notification.permission === 'denied') return 'denied';
    return 'checking';
}

export function usePushSubscription() {
    const [state, setState] = useState<PushState>(getInitialState);
    const [error, setError] = useState<string | null>(null);
    // Lazy 쿼리적용 : 마운트 시점이 아니라 버튼을 눌렀을 때만 공개키를 가져온다
    const [fetchVapidKey] = useLazyGetVapidPublicKeyQuery();
    const [subscribeOnServer] = useSubscribePushMutation();
    const [unsubscribeOnServer] = useUnsubscribePushMutation();

    // 'checking' 일 때만: 이 기기에 이미 구독이 있는지 브라우저에 확인
    useEffect(() => {
        if (state !== 'checking') return;
        let cancelled = false;
        getCurrentSubscription()
            .then((subscription) => {
                if (!cancelled) setState(subscription ? 'on' : 'off');
            })
            .catch(() => {
                if (!cancelled) setState('off');
            });
        return () => {
            cancelled = true;
        };
    }, [state]);

    // 반드시 버튼 onClick 에서 호출 (사용자 제스처 필요)
    const enable = useCallback(async () => {
        setState('working');
        setError(null);
        try {
            // 권한 요청을 가장 먼저 — 앞에 다른 await 가 끼면 iOS 가 "사용자 제스처 아님"으로 거부함
            const permission = await requestNotificationPermission();
            if (permission === 'denied') {
                setState('denied');
                return;
            }
            if (permission !== 'granted') {
                // 팝업을 그냥 닫은 경우(default) — 다시 누를 수 있게 off 로 되돌린다
                setState('off');
                return;
            }
            // SW 등록 (이미 등록돼 있으면 같은 registration 이 반환됨)
            const registration = await registerServiceWorker();
            if (!registration) throw new Error('SW_REGISTER_FAILED');
            // 공개키 조회 -> 브라우저 구독 생성 -> 서버 저장
            const { publicKey } = await fetchVapidKey().unwrap();
            const subscription = await subscribeToPush(publicKey);
            await subscribeOnServer(subscription).unwrap();   // 서버에 저장돼야 "켜짐"
            setState('on');
        } catch {
            setState('off');
            setError('알림을 켜지 못했습니다. 잠시 후 다시 시도해주세요.');
        }
    }, [fetchVapidKey, subscribeOnServer]);

    const disable = useCallback(async () => {
        setState('working');
        setError(null);
        try {
            const endpoint = await unsubscribeFromPush();
            if (endpoint) {
                // 서버 삭제가 실패해도 브라우저 구독은 이미 해제됨. 서버는 다음 발송 때 404/410 을 받고 그 행을 삭제함
                await unsubscribeOnServer({ endpoint }).unwrap().catch(() => undefined);
            }
            setState('off');
        } catch {
            setState('on');
            setError('알림을 끄지 못했습니다. 잠시 후 다시 시도해주세요.');
        }
    }, [unsubscribeOnServer]);

    return { state, error, enable, disable };
}