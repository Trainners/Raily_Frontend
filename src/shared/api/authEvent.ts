import {createAction} from "@reduxjs/toolkit";

// reissue 성공시 새 accessToken 발급
export const tokenReissued = createAction<string>('auth/tokenReissued');

// reissue 실패 : (400 쿠키없음, 500 무효, 네트워크 에러)혹은 앱 시작 복원 실패 -> 비로그인 상태로 전이
export const sessionExpired = createAction('auth/sessionExpired');