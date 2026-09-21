import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../../../entities/user";
import { finishJourney, selectSeatWatchId } from "../../../entities/journey";
import {
    notificationApi, useCancelSeatWatchMutation, useUnsubscribePushMutation,
} from "../../../entities/notification";
import { unsubscribeFromPush } from "../../../shared/lib/push.ts";
import { Button } from "../../../shared/ui";

export type LogoutButtonProps = {
    // 로그아웃 처리 후 페이지 이동은 부모(페이지) 책임으로 남김(책임범위 구분)
    onLoggedOut: () => void;
}

// 정리 단계가 응답 없이 멈춰도 로그아웃이 막히지 않도록 제한 시간을 둔다
const CLEANUP_TIMEOUT_MS = 3000;

function withTimeout<T>(promise: Promise<T>): Promise<T> {
    return Promise.race([
        promise,
        new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('CLEANUP_TIMEOUT')), CLEANUP_TIMEOUT_MS);
        }),
    ]);
}

export default function LogoutButton({ onLoggedOut }: LogoutButtonProps) {
    const dispatch = useDispatch();
    const seatWatchId = useSelector(selectSeatWatchId);
    const [logout] = useLogoutMutation();
    const [cancelSeatWatch] = useCancelSeatWatchMutation();
    const [unsubscribePush] = useUnsubscribePushMutation();
    // 정리 -> 로그아웃 전체 구간 동안 버튼을 잠근다 (logout 의 isLoading 만으로는 정리 구간이 빠진다)
    const [isBusy, setIsBusy] = useState(false);

    const handleClick = async () => {
        setIsBusy(true);

        // 좌석 감시 취소 — accessToken 이 살아 있는 상태에서 해야함
        if (seatWatchId !== null) {
            try {
                await withTimeout(cancelSeatWatch(seatWatchId).unwrap());
            } catch {
                // 실패해도 로그아웃은 계속. 서버가 여정 종료 시각에 EXPIRED 처리한다
            }
        }

        // 푸시 구독 해제 — 브라우저 쪽을 먼저 끊고, 그 endpoint 를 서버에서도 지운다
        try {
            const endpoint = await withTimeout(unsubscribeFromPush());
            if (endpoint) {
                await withTimeout(unsubscribePush({ endpoint }).unwrap());
            }
        } catch {
            // 실패해도 로그아웃은 계속. 브라우저 구독이 이미 끊겼다면 서버가 다음 발송 때 404/410 을 받고 행을 지운다
        }

        // 로그아웃 - 토큰 삭제
        try {
            await logout().unwrap();
        } catch {
            // 서버가 거부해도 로컬 인증 상태는 userApi.logout의 onQueryStarted가 이미 비움
        }

        // 다음 사용자에게 이전 사람의 여정·알림이 보이지 않도록 로컬 상태를 지워야함
        dispatch(finishJourney());
        dispatch(notificationApi.util.resetApiState());

        setIsBusy(false);
        onLoggedOut();
    };

    return (
        <Button
            disabled={isBusy}
            onClick={handleClick}
        >
            {isBusy ? '로그아웃 중...' : '로그아웃'}
        </Button>
    )
}