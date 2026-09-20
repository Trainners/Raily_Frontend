import {createAction} from "@reduxjs/toolkit";

// reissue 성공시 새 accessToken과 사용자 정보 전달
// shared는 entities를 import할 수 없어 entities/user의 TokenReissueResponse와 같은 모양을 여기 따로 둠
export type TokenReissuedPayload = {
    accessToken: string;
    email: string;
    name: string;
};

export const tokenReissued = createAction<TokenReissuedPayload>('auth/tokenReissued');

// reissue 실패 : (400 쿠키없음, 500 무효, 네트워크 에러)혹은 앱 시작 복원 실패 -> 비로그인 상태로 전이
export const sessionExpired = createAction('auth/sessionExpired');
