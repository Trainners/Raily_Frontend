import { useSendTestPushMutation } from '../../../entities/notification';
import { Button, Note } from '../../../shared/ui';
import { usePushSubscription } from '../model/usePushSubscription';

export default function EnablePushButton() {
    const { state, error, enable, disable } = usePushSubscription();
    const [sendTestPush, { isLoading: isSendingTest, isSuccess: isTestSent, isError: isTestFailed }] =
        useSendTestPushMutation();

    // 버튼을 보여줄 수 없는 상태는 안내 문구만 보여주고 종료
    if (state === 'unsupported') {
        return <Note tone="warn">이 브라우저는 푸시 알림을 지원하지 않습니다.</Note>;
    }
    if (state === 'ios-not-installed') {
        return (
            <Note tone="warn">
                iPhone·iPad에서는 Safari 하단의 공유 버튼 → <b>홈 화면에 추가</b>를 누른 뒤,
                홈 화면에 생긴 Raily 앱을 열어야 알림을 켤 수 있습니다. (iOS 16.4 이상)
            </Note>
        );
    }
    if (state === 'denied') {
        return (
            <Note tone="error">
                알림 권한이 차단되어 있습니다. 브라우저(또는 기기) 설정에서 Raily 알림을 허용한 뒤 이 화면을 다시 열어 주세요.
            </Note>
        );
    }

    const isBusy = state === 'working' || state === 'checking';

    return (
        <>
            <Note>앉은 좌석이 판매되면 새 승객이 타기 전에 미리 알려드립니다.</Note>
            {state === 'on' ? (
                <>
                    <Button variant="ghost" onClick={disable}>이 기기 알림 끄기</Button>
                    <Button variant="ghost" size="sm" disabled={isSendingTest} onClick={() => void sendTestPush()}>
                        {isSendingTest ? '보내는 중...' : '테스트 알림 보내기'}
                    </Button>
                    {isTestSent && <Note>테스트 알림을 요청했습니다. 잠시 후 기기 알림을 확인해 주세요.</Note>}
                    {isTestFailed && <Note tone="error">테스트 알림을 보내지 못했습니다.</Note>}
                </>
            ) : (
                <Button onClick={enable} disabled={isBusy}>
                    {isBusy ? '확인 중...' : '좌석 판매 알림 켜기'}
                </Button>
            )}
            {error && <Note tone="error">{error}</Note>}
        </>
    );
}